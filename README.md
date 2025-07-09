# Artemis STOMP Client (TypeScript)

This project provides TypeScript implementation for Apache Artemis STOMP client with both consumer and producer functionality.

## Features

- **Consumer** (`src/index.ts`): Subscribes to STOMP queues and processes incoming messages
- **Producer** (`src/index-send.ts`): Sends messages to STOMP queues with callback-based confirmation
- **Type Safety**: Full TypeScript support with proper type definitions
- **Environment Configuration**: Uses dotenv for configuration management

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy the environment template:
```bash
cp .env.example .env
```

3. Configure your `.env` file with your Artemis connection details:
```env
HOST=localhost
PORT=61613
LOGIN=your_username
PASSWORD=your_password
DESTINATION=/queue/your_queue_name
```

## Development

### TypeScript Development (Recommended)

- **Run Consumer**: `npm run consumer`
- **Run Producer**: `npm run send`
- **Build Project**: `npm run build`

### Production

- **Build and Run Consumer**: `npm run consumer:build`
- **Build and Run Producer**: `npm run send:build`

## Project Structure

```
src/
├── index.ts          # STOMP consumer
├── index-send.ts     # STOMP producer
└── types.ts          # TypeScript type definitions

dist/                 # Compiled JavaScript output
├── index.js          # Compiled consumer
├── index-send.js     # Compiled producer
└── types.js          # Compiled types
```

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run consumer` - Run consumer in development mode
- `npm run send` - Run producer in development mode
- `npm run consumer:build` - Build and run consumer
- `npm run send:build` - Build and run producer
- `npm start` - Run compiled consumer

## Legacy JavaScript Files

The original JavaScript files (`index.js`, `index-send.js`) are still available for reference but the TypeScript versions in `src/` directory are recommended for new development.