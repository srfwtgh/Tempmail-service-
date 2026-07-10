# Temp Mail

A disposable temp mail service with a neobrutalism UI. Generate temporary inboxes, receive emails, and read messages — all in-app.

## Features

- **Instant inbox** — generate a disposable email address with one click
- **Live message viewing** — read full email content (HTML/Plain Text) inside the app, including inline images
- **Neobrutalism UI** — bold borders, hard shadows, flat colors, Space Grotesk + Inter fonts
- **Dark/Light mode** — toggle in the navbar, persisted to localStorage, defaults to system preference
- **Auto-refresh** — polls inbox every 10 seconds, togglable

## Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | React 19, Vite 8, Tailwind CSS v4 |
| Backend | Express, Helmet, CORS, rate-limited |
| API Proxy | FastToolsHQ temp email PHP endpoint |
| Styling | Neobrutalism — `#000` borders, `5px 5px 0` shadows, orange accent |

## Quick Start

```bash
# Install dependencies
npm run install:all

# Run both server + client in dev mode
npm run dev

# Or run individually
npm run dev:server   # Express on :3001
npm run dev:client   # Vite on :5173
```

## Production Build

```bash
npm run build
npm start            # Serves built client from Express on :3001
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `NODE_ENV` | `development` | Set to `production` for production mode |
| `ALLOWED_ORIGINS` | `http://localhost:5173` | Comma-separated CORS origins |
| `RATE_LIMIT_MAX` | `30` | Max API requests per minute |
| `FETCH_TIMEOUT_MS` | `20000` | Upstream API timeout in ms |
| `POMAILBOX_PROXY` | `https://fasttoolshq.com/.../temp-email-api.php` | Upstream temp-email API endpoint (swappable) |

## Project Structure

```
temp-email-app/
├── client/             # React + Vite frontend
│   ├── src/
│   │   ├── components/ # Navbar, EmailPanel, InboxView, QuickViewModal, ErrorBoundary
│   │   ├── utils/      # tempEmailApi.js
│   │   ├── App.jsx
│   │   └── index.css   # Neo theme, dark mode variables
│   └── index.html
├── server/             # Express API proxy
│   └── index.js
├── package.json        # Root orchestration scripts
└── render.yaml         # Render deploy config
```

## Notes

- The backend is a thin proxy to a third-party temp-email API (FastToolsHQ by default). If that endpoint is down or changes, the service stops working — swap it via `POMAILBOX_PROXY`.
- The generated email + password are cached in `localStorage` for 30 minutes so the inbox survives a page refresh. Clearing site data or closing past 30 min ends the session.
