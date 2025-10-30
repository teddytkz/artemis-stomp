export interface ConnectOptions {
  host: string;
  port: number;
  connectHeaders: {
    host: string;
    login: string;
    passcode: string;
    "heart-beat": string;
  };
}

export interface SubscribeHeaders {
  destination: string;
  ack: string;
}

export interface SendHeaders {
  destination: string;
  "content-type": string;
  persistent: string;
}

export interface Payload {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        automatic_events: Array<{
          id: string;
          event_name: string;
          timestamp: number;
          ctwa_clid: string;
        }>;
      };
      field: string;
    }>;
  }>;
}

export interface CallbackResult {
  success: boolean;
  error?: string;
  message?: string;
  payload?: Payload;
  duration: number;
}
