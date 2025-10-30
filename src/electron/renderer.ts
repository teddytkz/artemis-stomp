const stompit = require("stompit");

interface StompClient {
  disconnect: (callback?: () => void) => void;
  subscribe: (
    headers: any,
    callback: (error: Error | null, message: any) => void
  ) => void;
  send: (headers: any, body?: string) => any;
}

let stompClient: StompClient | null = null;
let isListening = false;
let currentSubscription: any = null;

// UI Elements
const ipInput = document.getElementById("ip") as HTMLInputElement;
const portInput = document.getElementById("port") as HTMLInputElement;
const userInput = document.getElementById("user") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const connectBtn = document.getElementById("connectBtn") as HTMLButtonElement;
const connectionStatus = document.getElementById(
  "connectionStatus"
) as HTMLDivElement;

const sendQueueInput = document.getElementById("sendQueue") as HTMLInputElement;
const sendCountInput = document.getElementById("sendCount") as HTMLInputElement;
const sendMessageInput = document.getElementById(
  "sendMessage"
) as HTMLTextAreaElement;
const sendBtn = document.getElementById("sendBtn") as HTMLButtonElement;

const receiveQueueInput = document.getElementById(
  "receiveQueue"
) as HTMLInputElement;
const listenBtn = document.getElementById("listenBtn") as HTMLButtonElement;
const receiveOutput = document.getElementById(
  "receiveOutput"
) as HTMLDivElement;

// Load saved values from localStorage
function loadSettings() {
  ipInput.value = localStorage.getItem("ip") || "localhost";
  portInput.value = localStorage.getItem("port") || "61613";
  userInput.value = localStorage.getItem("user") || "admin";
  passwordInput.value = localStorage.getItem("password") || "admin";
  sendQueueInput.value = localStorage.getItem("sendQueue") || "";
  receiveQueueInput.value = localStorage.getItem("receiveQueue") || "";
}

// Save settings to localStorage
function saveSettings() {
  localStorage.setItem("ip", ipInput.value);
  localStorage.setItem("port", portInput.value);
  localStorage.setItem("user", userInput.value);
  localStorage.setItem("password", passwordInput.value);
  localStorage.setItem("sendQueue", sendQueueInput.value);
  localStorage.setItem("receiveQueue", receiveQueueInput.value);
}

// Update status display
function updateStatus(message: string, isError: boolean = false) {
  const timestamp = new Date().toLocaleTimeString();
  const statusLine = document.createElement("div");
  statusLine.textContent = `[${timestamp}] ${message}`;
  statusLine.style.color = isError ? "#d32f2f" : "#333";
  connectionStatus.insertBefore(statusLine, connectionStatus.firstChild);
}

// Add message to receive output
function addReceivedMessage(message: string) {
  const timestamp = new Date().toLocaleTimeString();
  const currentText = receiveOutput.textContent;
  receiveOutput.textContent = `[${timestamp}] ${message}\n${currentText}`;
}

// Connect to STOMP
connectBtn.addEventListener("click", () => {
  if (stompClient) {
    // Disconnect
    stompClient.disconnect(() => {
      stompClient = null;
      isListening = false;
      currentSubscription = null;
      connectBtn.textContent = "Connect";
      connectBtn.classList.add("primary");
      listenBtn.textContent = "Listen";
      listenBtn.classList.remove("primary");
      updateStatus("Disconnected");
      receiveOutput.textContent = "";
    });
    return;
  }

  saveSettings();

  const connectOptions = {
    host: ipInput.value || "localhost",
    port: parseInt(portInput.value) || 61613,
    connectHeaders: {
      host: "/",
      login: userInput.value || "admin",
      passcode: passwordInput.value || "admin",
      "heart-beat": "5000,5000",
    },
  };

  updateStatus("Connecting...");

  stompit.connect(
    connectOptions,
    (error: Error | null, client: StompClient) => {
      if (error) {
        updateStatus(`❌ Connection error: ${error.message}`, true);
        return;
      }

      stompClient = client;
      connectBtn.textContent = "Disconnect";
      connectBtn.classList.remove("primary");
      updateStatus("✅ Connected to Artemis via STOMP");
    }
  );
});

// Send message
sendBtn.addEventListener("click", () => {
  if (!stompClient) {
    alert("Please connect first!");
    return;
  }

  const queueName = sendQueueInput.value.trim();
  if (!queueName) {
    alert("Please enter a queue name!");
    return;
  }

  const message = sendMessageInput.value.trim() || "{}";
  const count = parseInt(sendCountInput.value) || 1;

  saveSettings();

  for (let i = 0; i < count; i++) {
    const sendHeaders = {
      destination: queueName,
      "content-type": "application/json",
    };

    const frame = stompClient.send(sendHeaders);
    frame.write(message);
    frame.end();
  }

  updateStatus(`✅ Sent ${count} message(s) to ${queueName}`);
});

// Listen to queue
listenBtn.addEventListener("click", () => {
  if (!stompClient) {
    alert("Please connect first!");
    return;
  }

  // Stop listening
  if (isListening) {
    if (currentSubscription) {
      currentSubscription.unsubscribe();
      currentSubscription = null;
    }
    isListening = false;
    listenBtn.textContent = "Listen";
    listenBtn.classList.remove("primary");
    updateStatus("⏹️ Stopped listening");
    return;
  }

  // Start listening
  const queueName = receiveQueueInput.value.trim();
  if (!queueName) {
    alert("Please enter a queue name!");
    return;
  }

  saveSettings();

  const subscribeHeaders = {
    destination: queueName,
    ack: "auto",
  };

  currentSubscription = stompClient.subscribe(
    subscribeHeaders,
    (error: Error | null, message: any) => {
      if (error) {
        addReceivedMessage(`❌ Subscribe error: ${error.message}`);
        return;
      }

      message.readString("utf-8", (error: Error | null, body: string) => {
        if (error) {
          addReceivedMessage(`❌ Read error: ${error.message}`);
          return;
        }

        addReceivedMessage(`📥 ${body}`);
      });
    }
  );

  isListening = true;
  listenBtn.textContent = "Stop";
  listenBtn.classList.add("primary");
  updateStatus(`🎧 Listening to ${queueName}`);
  addReceivedMessage(`Started listening to queue: ${queueName}`);
});

// Load settings on startup
loadSettings();

// Sample message template
sendMessageInput.value = JSON.stringify({}, null, 2);

// Clear initial status text
connectionStatus.textContent = "";
