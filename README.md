# Artemis STOMP Client

A comprehensive STOMP client application for Apache Artemis message broker with both **GUI desktop application** and **command-line interface** support.

## 🚀 Features

### Desktop GUI Application (Electron)

- **Modern GUI Interface**: User-friendly desktop application built with Electron
- **Real-time Connection Management**: Connect/disconnect to Artemis STOMP broker with visual status
- **Message Producer**: Send messages to queues with count control
- **Message Consumer**: Listen to queues with real-time message display
- **Settings Persistence**: Automatically saves connection settings locally
- **Portable Executable**: Available as standalone .exe file (no installation required)
- **React Icon**: Modern React-themed application icon

### Command Line Interface

- **Consumer** (`src/index.ts`): Subscribes to STOMP queues and processes incoming messages
- **Producer** (`src/index-send.ts`): Sends messages to STOMP queues with callback-based confirmation
- **Type Safety**: Full TypeScript support with proper type definitions
- **Environment Configuration**: Uses dotenv for configuration management

## 🛠️ Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**:

```bash
git clone https://github.com/teddytkz/artemis-stomp.git
cd artemis-stomp
```

2. **Install dependencies**:

```bash
npm install
```

3. **Configure environment** (for CLI usage):

```bash
cp .env.example .env
```

4. **Edit `.env` file** with your Artemis connection details:

```env
HOST=127.0.0.1
PORT=61616
LOGIN=admin
PASSWORD=admin
DESTINATION=destination
RECEIVER=receiver
```

## 🖥️ Usage

### GUI Desktop Application

#### Development Mode

```bash
# Build and run the Electron app in development
npm run electron:dev
```

#### Build Executable

```bash
# Build portable .exe file (no installation required)
npm run electron:build:portable

# Build both installer and portable versions
npm run electron:build
```

**Built files location**: `release/`

- `Artemis STOMP Client 1.0.0.exe` - Portable executable
- `Artemis STOMP Client Setup 1.0.0.exe` - Windows installer

#### GUI Features

- **Connection Panel**: Enter IP, Port, Username, Password and connect to broker
- **Send Panel**: Send messages to specified queue with custom count
- **Receive Panel**: Listen to queue and view incoming messages in real-time
- **Status Monitoring**: Real-time connection and operation status with timestamps

### Command Line Interface

#### Development Mode (TypeScript)

```bash
# Run consumer (listen to messages)
npm run consumer

# Run producer (send messages)
npm run send

# Build TypeScript files
npm run build
```

#### Production Mode

```bash
# Build and run consumer
npm run consumer:build

# Build and run producer
npm run send:build
```

## 📁 Project Structure

```
artemis-stomp/
├── src/
│   ├── electron/           # Electron GUI application
│   │   ├── main.ts        # Main Electron process
│   │   ├── renderer.ts    # Renderer process (UI logic)
│   │   ├── preload.ts     # Preload script for security
│   │   └── index.html     # GUI layout and styles
│   ├── index.ts           # CLI STOMP consumer
│   ├── index-send.ts      # CLI STOMP producer
│   └── types.ts           # TypeScript type definitions
├── build/
│   └── icon.png          # Application icon (React logo)
├── dist/                 # Compiled JavaScript output
├── release/              # Built executable files
├── .env                  # Environment configuration
└── package.json          # Project configuration
```

## 🔧 Available Scripts

### Electron GUI

- `npm run electron:dev` - Run GUI app in development mode
- `npm run electron:build` - Build installer + portable executable
- `npm run electron:build:portable` - Build portable .exe only

### CLI Development

- `npm run build` - Compile TypeScript to JavaScript
- `npm run consumer` - Run consumer in development mode
- `npm run send` - Run producer in development mode
- `npm run consumer:build` - Build and run consumer
- `npm run send:build` - Build and run producer

### Utilities

- `npm run build:electron` - Build Electron app files only
- `npm start` - Run compiled CLI consumer

## 🔐 Configuration

The application supports two configuration methods:

### 1. GUI Configuration

- **In-app settings**: Enter connection details directly in the GUI
- **Auto-save**: Settings are automatically saved to local storage
- **Per-session**: No need to configure files

### 2. Environment File (.env)

```env
HOST=10.0.7.106           # Artemis broker IP
PORT=61616               # STOMP port (usually 61613 or 61616)
LOGIN=admin              # Username
PASSWORD=JAtis123!@#     # Password
DESTINATION=webhook.validator    # Default send queue
RECEIVER=automatic.events        # Default receive queue
```

## 🚀 Distribution

### Portable Application

The built `.exe` file is completely portable:

- **No installation required** - Just double-click to run
- **Self-contained** - Includes all dependencies
- **Transferable** - Copy to USB drives, cloud storage, or other computers
- **No registry changes** - Leaves no traces on the system

### System Requirements

- **Windows 10/11** (64-bit)
- **RAM**: Minimum 4GB recommended
- **Disk Space**: ~300MB for the application

## 🛡️ Technologies Used

- **Electron** - Cross-platform desktop app framework
- **TypeScript** - Type-safe JavaScript development
- **STOMP.js** - STOMP protocol implementation
- **HTML/CSS** - Modern responsive UI
- **Node.js** - Runtime environment
- **Electron Builder** - Application packaging and distribution

## 📝 License

ISC License - See LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
