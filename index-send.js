const stompit = require("stompit");
require("dotenv").config();

const connectOptions = {
  host: process.env.HOST,
  port: parseInt(process.env.PORT),
  connectHeaders: {
    host: "/",
    login: process.env.LOGIN,
    passcode: process.env.PASSWORD,
    "heart-beat": "5000,5000",
  },
};

const payload = {
  type: "order",
  order_id: "ORD-123456",
  status: "pending",
  timestamp: new Date().toISOString(),
};

function sendMessage(payload, callback) {
  const startTime = Date.now();

  stompit.connect(connectOptions, (error, client) => {
    if (error) {
      console.error("❌ Connection error:", error.message);
      return callback({
        success: false,
        error: `Connection failed: ${error.message}`,
        duration: Date.now() - startTime,
      });
    }

    console.log("✅ Connected to Artemis server");

    const sendHeaders = {
      destination: process.env.DESTINATION,
      "content-type": "application/json",
      persistent: "true",
    };

    try {
      const frame = client.send(sendHeaders);

      frame.on("error", (frameError) => {
        console.error("❌ Frame error:", frameError.message);
        client.disconnect();
        return callback({
          success: false,
          error: `Send failed: ${frameError.message}`,
          duration: Date.now() - startTime,
        });
      });

      frame.write(JSON.stringify(payload));
      frame.end();

      console.log("📤 Message sent to queue");

      const timeoutId = setTimeout(() => {
        client.disconnect();
        callback({
          success: false,
          error: "Send timeout - no confirmation received",
          duration: Date.now() - startTime,
        });
      }, 5000);

      setTimeout(() => {
        clearTimeout(timeoutId);
        client.disconnect();
        callback({
          success: true,
          message: "Message successfully sent to queue",
          payload: payload,
          duration: Date.now() - startTime,
        });
      }, 1000);
    } catch (sendError) {
      console.error("❌ Send error:", sendError.message);
      client.disconnect();
      return callback({
        success: false,
        error: `Send exception: ${sendError.message}`,
        duration: Date.now() - startTime,
      });
    }
  });
}

sendMessage(payload, (result) => {
  if (result.success) {
    console.log("✅ PENGIRIMAN BERHASIL!");
    console.log(`📊 Duration: ${result.duration}ms`);
    console.log("📄 Payload:", result.payload);
  } else {
    console.log("❌ PENGIRIMAN GAGAL!");
    console.log(`🔴 Error: ${result.error}`);
    console.log(`📊 Duration: ${result.duration}ms`);
  }

  console.log("🏁 Process completed");
});
