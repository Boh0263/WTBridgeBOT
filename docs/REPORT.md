# BridgeBOT Project Documentation Report

## Overview
BridgeBOT is a Node.js application designed to bridge messaging between WhatsApp and Telegram groups. It enables seamless, bidirectional forwarding of messages, media, and metadata while preserving features like replies and mentions. The project uses unofficial APIs for WhatsApp and official bots for Telegram, with a focus on robustness through queue-based processing and persistent mappings.

This report analyzes the current implementation, detailing features, architecture, potential issues, and recommendations for improvement.

## Implemented Features

### Core Functionality
- **Bidirectional Message Bridging**: Messages sent in one platform's group are automatically forwarded to the other. To prevent echo loops, each platform uses a single account that listens and sends, ignoring its own messages.
  - *Explanation*: For WhatsApp, one `whatsapp-web.js` client authenticates via QR code and handles both listening and sending. For Telegram, one bot token handles polling and sending.

- **Media Forwarding**: Supports images, documents, and videos. Media is downloaded from the source and uploaded to the destination, with captions preserved.
  - *Explanation*: Uses `downloadMedia()` for WhatsApp and file streams for Telegram. Buffers are handled asynchronously to avoid blocking.

- **Reply Support**: Maintains conversation threads by mapping message IDs across platforms and using native reply features.
  - *Explanation*: Each forwarded message gets a unique ID on the target platform. Original IDs are mapped (stored in JSON), allowing replies to reference the correct message (e.g., `reply_to_message_id` in Telegram).

- **User Mention Preservation**: Detects @mentions in messages, maps users by ID/username, and replaces tags with equivalent references on the target platform.
  - *Explanation*: WhatsApp mentions (e.g., @1234567890) are replaced with Telegram usernames or names. User data is collected from messages and persisted.

- **Persistent Storage**: Message and user mappings saved to disk for continuity across restarts.
  - *Explanation*: JSON files (`messageMappings.json`, `userMappings.json`) store mappings. Automatic cleanup removes entries older than 7 days.

- **Queue-Based Processing**: Incoming messages are buffered in FIFO queues, processed asynchronously every second.
  - *Explanation*: Prevents blocking during bursts; in-memory queues decouple reception from forwarding. Future-proof for spam analysis.

- **Authentication Setup**: Dedicated setup script for WhatsApp QR authentication.
  - *Explanation*: `setup.js` generates QR codes for listen/write clients, saving sessions separately from the main server.

- **Logging & Error Handling**: Structured logging with Winston; global error handlers.
  - *Explanation*: Logs to console and files; catches uncaught exceptions/rejections to prevent crashes.

- **Configuration Management**: Environment-based config with validation.
  - *Explanation*: Requires tokens, group IDs, etc.; throws errors if missing.

- **Basic Web Server**: Express server with health-check endpoint.
  - *Explanation*: Runs on configurable port; minimal API for monitoring.

## Architecture Overview

### High-Level Diagram
```
[WhatsApp Group] --> [Listen Client] --> [Queue] --> [Message Handler] --> [Forward to Telegram]
[Telegram Group] --> [Listen Bot]    --> [Queue] --> [Message Handler] --> [Forward to WhatsApp]
                              |
                              v
                        [Persistent Mappings]
                              ^
                              |
                        [User Mappings]
```

### Key Components
- **Clients (`src/clients/`)**: Abstractions for platforms.
  - WhatsApp: Handles QR auth, group filtering, media downloads.
  - Telegram: Bot-based, supports polling/webhooks, media uploads.
- **Handlers (`src/handlers/`)**: Parse messages into unified format.
  - Message: Extracts text, media, replies, mentions, user info.
  - Media: Downloads/uploads with platform-specific logic.
- **Bridge (`src/bridge/`)**: Orchestrates everything—initializes clients, manages queues/mappings, forwards messages.
- **Utils (`src/utils/`)**: Logging, error handling.
- **Queue System**: Simple in-memory FIFO for asynchronous processing.

### File Structure
- `server.js`: Main entry; checks sessions, starts bridge/server.
- `setup.js`: QR setup for WhatsApp.
- `src/`: Modular code.
- `tests/`: Basic tests (incomplete).
- `docs/`: This report.

## Setup Guide

### Prerequisites
- Node.js v16+, npm.
- WhatsApp accounts (separate for listen/write).
- Telegram bot tokens (@BotFather).

### Steps
1. `npm install`
2. Copy `.env.example` to `.env`; fill in vars (token, group IDs).
3. Run `npm run setup`; scan QR with WhatsApp account.
4. `npm start` (checks for session before running).

### Configuration
- Env vars: `WHATSAPP_SESSION` (default `./sessions/whatsapp`), `TELEGRAM_BOT_TOKEN`, `WHATSAPP_GROUP_ID`, `TELEGRAM_GROUP_ID`, `PORT`, `LOG_LEVEL`.
- Session: Stored in `./sessions/`; mappings in root JSON files.

## Potential Issues and Mitigations

### Functional Issues
- **Echo Loops**: *Mitigation*: Use distinct accounts; add loop detection via message signatures.
- **Message Loss**: *Mitigation*: Add retries, dead-letter queues (e.g., Redis).
- **Incomplete Features**: No voice/stickers. *Mitigation*: Extend handlers for new types.
- **Mention Failures**: Incomplete mappings. *Mitigation*: Manual user sync or DB.

### Security Concerns
- **Credential Exposure**: *Mitigation*: Encrypt env files; use vaults (e.g., AWS Secrets).
- **Unsanitized Input**: *Mitigation*: Validate/clean content; scan media.
- **Session Risks**: *Mitigation*: Encrypt files; rotate sessions periodically.
- **Server Vulnerabilities**: *Mitigation*: Add auth, HTTPS, rate limiting.

### Performance & Scalability
- **Bottlenecks**: Synchronous processing. *Mitigation*: Parallelize with workers; use Redis queues.
- **I/O Overhead**: *Mitigation*: Batch saves; use DB.
- **Polling Latency**: *Mitigation*: Implement Telegram webhooks.
- **Resource Limits**: *Mitigation*: Add size limits, horizontal scaling.

### Code Quality
- **Testing Gaps**: *Mitigation*: Expand Jest tests; add E2E.
- **No Type Safety**: *Mitigation*: Migrate to TypeScript.
- **Error Recovery**: *Mitigation*: Add circuit breakers, auto-restart (PM2).

### Other
- **Dependency Risks**: WhatsApp unofficial. *Mitigation*: Monitor for alternatives.
- **Deployment Gaps**: *Mitigation*: Add Docker, CI/CD.

## Recommendations
1. **Immediate**: Fix security (encryption, validation); add retries.
2. **Short-Term**: Expand tests; add webhooks/Redis.
3. **Long-Term**: Multi-group support, advanced features (edits, polls).
4. **Best Practices**: Code reviews, monitoring, documentation updates.

## Conclusion
BridgeBOT is a promising prototype with innovative features like queueing and mappings. With enhancements, it can become a robust production tool. Current readiness: 6/10—functional but needs polishing.

For questions or contributions, see GitHub issues.