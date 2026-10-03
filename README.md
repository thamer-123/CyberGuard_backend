# 🛡️ CyberGuard Backend

Backend security-analysis service for **CyberGuard**, a Chrome extension that evaluates websites and warns users about potentially unsafe domains.

The backend is built with **Node.js and Express** and combines domain reputation data, phishing threat intelligence, caching, and heuristic risk analysis to produce explainable security assessments.

## Overview

CyberGuard separates browser-side security analysis from external threat-intelligence processing.

When the browser extension analyzes a domain, the backend:

1. Receives the domain through the analysis API.
2. Retrieves domain registration information from WhoisFreaks.
3. Calculates the age of the domain.
4. Checks the domain against the OpenPhish public phishing feed.
5. Passes the collected intelligence to the risk engine.
6. Returns a risk score, verdict, and human-readable reasons.

This architecture keeps external API credentials out of the browser extension while providing a centralized security-analysis service.

## Features

### Domain Reputation Analysis

Retrieves WHOIS information and calculates:

- Domain creation date
- Domain age in days
- Domain age in years

Recently registered domains receive additional risk weight because newly created domains are commonly associated with phishing and scam campaigns.

### OpenPhish Threat Intelligence

CyberGuard checks analyzed domains against the OpenPhish public phishing feed.

If a domain appears in the phishing feed, the risk engine immediately returns a critical security verdict.

The OpenPhish feed is cached in memory for one hour to avoid downloading the full threat feed for every analysis request.

### Risk Scoring Engine

Security signals are processed by a modular risk engine.

Current signals include:

- Known phishing-domain detection
- Domain registration age
- Domain reputation information

The engine returns:

- Numerical risk score
- Security status
- Human-readable reasons explaining the verdict

### Caching

CyberGuard uses in-memory caching to reduce unnecessary external requests.

WHOIS results are cached by domain, while the OpenPhish threat feed is refreshed periodically rather than downloaded for every request.

## Architecture

```text
Chrome Extension
       │
       │ Domain
       ▼
CyberGuard Backend
       │
       ├── WHOIS Service
       │      └── WhoisFreaks API
       │
       ├── Threat Intelligence
       │      └── OpenPhish Feed
       │
       ▼
   Risk Engine
       │
       ▼
Risk Score + Verdict + Reasons
       │
       ▼
Chrome Extension
```

## Project Structure

```text
CyberGuard_backend/
│
├── analysis/
│   └── riskEngine.js
│
├── routes/
│   └── domain.js
│
├── services/
│   ├── openPhiService.js
│   └── whoisService.js
│
├── .gitignore
├── package-lock.json
├── package.json
└── server.js
```

## Tech Stack

- **Node.js**
- **Express.js**
- **JavaScript**
- **Axios**
- **CORS**
- **dotenv**
- **WhoisFreaks API**
- **OpenPhish threat intelligence**

## API

### Health Check

```http
GET /
```

Example response:

```json
{
  "message": "CyberGuard Backend Online"
}
```

### Analyze Domain

```http
GET /api/analyze/:domain
```

Example:

```text
GET /api/analyze/example.com
```

The backend retrieves domain intelligence, checks phishing threat data, runs the risk engine, and returns the resulting assessment.

Example response structure:

```json
{
  "analyzedAt": "2026-10-02T20:00:00.000Z",
  "reputation": {
    "domain": "example.com",
    "createdDate": "...",
    "ageDays": 1000,
    "ageYears": 2
  },
  "risk": {
    "score": 0,
    "status": "Safe",
    "reasons": [
      "Domain has an established history"
    ]
  }
}
```

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd CyberGuard_backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
WHOIS_API_KEY=your_whoisfreaks_api_key
PORT=3000
```

The `.env` file is ignored by Git and should never be committed.

### 4. Start the server

```bash
node server.js
```

The backend will start on port `3000` unless another port is specified through the `PORT` environment variable.

### 5. Verify the server

Open:

```text
http://localhost:3000/
```

You should receive:

```json
{
  "message": "CyberGuard Backend Online"
}
```

## Security

Sensitive credentials are stored using environment variables and are not committed to the repository.

The backend acts as an intermediary between the browser extension and services requiring private API credentials, preventing those credentials from being exposed in client-side extension code.

Files containing secrets such as `.env` are excluded through `.gitignore`.

## Related Project

This repository contains the backend analysis service for the **CyberGuard browser extension**.

The browser extension contains the user-facing interface, browser integration, website analysis, security warnings, and communication with this backend.

See the companion project:

[CyberGuard Browser Extension](../CyberGuard)

## Future Improvements

Potential future additions include:

- Additional threat-intelligence providers
- Expanded domain and URL heuristics
- Persistent caching with Redis
- Rate limiting
- Automated testing
- Request validation
- Additional phishing indicators
- Production deployment
- Historical domain-analysis tracking

## Purpose

CyberGuard was built as a cybersecurity and software engineering project exploring how browser extensions, backend services, external threat-intelligence sources, and risk-scoring systems can work together to provide understandable website security information.

The project focuses on building an explainable security-analysis pipeline rather than relying on a single security signal.

## License

This project is intended for educational and portfolio purposes.
