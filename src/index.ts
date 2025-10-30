const stompit = require("stompit");
require("dotenv").config();

import { ConnectOptions, SubscribeHeaders } from "./types";

const connectOptions: ConnectOptions = {
  host: process.env.HOST as string,
  port: parseInt(process.env.PORT as string),
  connectHeaders: {
    host: "/",
    login: process.env.LOGIN as string,
    passcode: process.env.PASSWORD as string,
    "heart-beat": "5000,5000",
  },
};

stompit.connect(connectOptions, (error: Error | null, client: any) => {
  if (error) {
    console.error("❌ Connection error:", error.message);
    return;
  }

  console.log("✅ Connected to Artemis via STOMP");

  const subscribeHeaders: SubscribeHeaders = {
    destination: process.env.RECEIVER as string,
    ack: "auto",
  };

  client.subscribe(subscribeHeaders, (error: Error | null, message: any) => {
    if (error) {
      console.error("❌ Subscribe error:", error.message);
      return;
    }

    message.readString("utf-8", (error: Error | null, body: string) => {
      if (error) {
        console.error("❌ Read message error:", error.message);
        return;
      }

      console.log("📥 Received message:", body);
    });
  });
});
