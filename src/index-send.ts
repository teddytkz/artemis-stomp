const stompitSender = require("stompit");
require("dotenv").config();

import { CallbackResult, ConnectOptions, Payload, SendHeaders } from "./types";

const connectOptionsForSender: ConnectOptions = {
  host: process.env.HOST as string,
  port: parseInt(process.env.PORT as string),
  connectHeaders: {
    host: "/",
    login: process.env.LOGIN as string,
    passcode: process.env.PASSWORD as string,
    "heart-beat": "5000,5000",
  },
};

const payload: Payload = {
  object: "whatsapp_business_account",
  entry: [
    {
      id: "12345678",
      changes: [
        {
          value: {
            messaging_product: "whatsapp",
            metadata: {
              display_phone_number: "<BUSINESS_DISPLAY_PHONE_NUMBER>",
              phone_number_id: "<BUSINESS_PHONE_NUMBER_ID>",
            },
            automatic_events: [
              {
                id: "987654321",
                event_name: "LeadSubmitted",
                timestamp: Date.now(),
                ctwa_clid: "click_id_123",
              },
            ],
          },
          field: "automatic_events",
        },
      ],
    },
  ],
};

function sendMessage(
  payload: Payload,
  callback: (result: CallbackResult) => void
): void {
  const startTime: number = Date.now();

  stompitSender.connect(
    connectOptionsForSender,
    (error: Error | null, client: any) => {
      if (error) {
        console.error("❌ Connection error:", error.message);
        return callback({
          success: false,
          error: `Connection failed: ${error.message}`,
          duration: Date.now() - startTime,
        });
      }

      console.log("✅ Connected to Artemis server");

      const sendHeaders: SendHeaders = {
        destination: process.env.DESTINATION as string,
        "content-type": "application/json",
        persistent: "true",
      };

      try {
        const frame = client.send(sendHeaders);

        frame.on("error", (frameError: Error) => {
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

        const timeoutId: ReturnType<typeof setTimeout> = setTimeout(() => {
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
      } catch (sendError: any) {
        console.error("❌ Send error:", sendError.message);
        client.disconnect();
        return callback({
          success: false,
          error: `Send exception: ${sendError.message}`,
          duration: Date.now() - startTime,
        });
      }
    }
  );
}

sendMessage(payload, (result: CallbackResult) => {
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
