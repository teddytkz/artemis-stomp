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

stompit.connect(connectOptions, (error, client) => {
  if (error) {
    console.error("❌ Connection error:", error.message);
    return;
  }

  console.log("✅ Connected to Artemis via STOMP");

  const subscribeHeaders = {
    destination: process.env.DESTINATION,
    ack: "auto",
  };

  client.subscribe(subscribeHeaders, (error, message) => {
    if (error) {
      console.error("❌ Subscribe error:", error.message);
      return;
    }

    message.readString("utf-8", (error, body) => {
      if (error) {
        console.error("❌ Read message error:", error.message);
        return;
      }

      console.log("📥 Received message:", body);
    });
  });
});
