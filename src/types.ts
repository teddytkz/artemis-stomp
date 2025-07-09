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
  type: string;
  order_id: string;
  status: string;
  timestamp: string;
}

export interface CallbackResult {
  success: boolean;
  error?: string;
  message?: string;
  payload?: Payload;
  duration: number;
}
