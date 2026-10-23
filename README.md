# 🎬 VibeFlix — Discover Your Vibe. Find Your People. 💜

VibeFlix is an entertainment discovery and social platform designed to make finding something to watch more personal and fun. Explore movies and shows, discover content based on your mood with VibeSearch, connect with fellow fans in the Community Lounge, and bring friends together through Watch Together.

> 🍿 Because entertainment is better when you vibe together.

## ✨ Features

- **VibeSearch** — Discover movies and shows based on your mood and preferences, with AI-powered discovery.
- **Movie Discovery** — Explore movie information powered by the [TMDB API](https://www.themoviedb.org/documentation/api).
- **Community Lounge** — Share recommendations, discuss favorite shows, exchange opinions, and connect with other fans.
- **Watch Together** — Bring friends together for shared entertainment experiences, including long-distance watch plans.
- **Real-Time Social Features** — WebSocket-powered communication for supported social interactions.
- **MCP Exploration** — Explore how the Model Context Protocol (MCP) can connect AI assistants with VibeFlix capabilities.

*Feature availability may vary as development continues.*

## 🛠️ Tech Stack

- **Frontend:** React, Vite, JavaScript, HTML, CSS
- **Backend:** Node.js
- **Movie Data:** The Movie Database (TMDB) API
- **Real-Time Communication:** WebSockets (`ws`)
- **AI / Integration Exploration:** OpenAI API and Model Context Protocol (MCP)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- npm
- A TMDB API Read Access Token
- An OpenAI API key if your VibeSearch implementation uses the OpenAI API

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd vibeflix
```

Replace `<YOUR_GITHUB_REPOSITORY_URL>` with your repository URL.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
TMDB_READ_ACCESS_TOKEN=your_tmdb_read_access_token
```

If your OpenAI integration uses an environment variable, add the exact variable name expected by your code, for example:

```env
OPENAI_API_KEY=your_openai_api_key
```

> **Security:** Never commit your `.env` file or publish API keys and access tokens. Keep credentials on the server and ensure `.env` is listed in `.gitignore`.

### 4. Start the application

If your `package.json` includes the combined development script:

```bash
npm run dev
```

Default local development ports:

| Service | Port |
|---|---:|
| Vite frontend | `5173` |
| Social WebSocket server | `8787` |
| VibeSearch backend | `8788` |
| TMDB backend | `8789` |

Open [http://localhost:5173](http://localhost:5173) in your browser.

If the command does not start all services, check the scripts in `package.json`.

## 🔐 Environment & API Notes

- Movie data is retrieved through the TMDB integration.
- Keep private API credentials in server-side environment variables.
- Never expose secret API keys in frontend code or commit them to GitHub.
- OpenAI-powered features require a valid API key and backend configuration if enabled in your version.

## 🗺️ Roadmap

- Improve mood-aware movie and show recommendations.
- Refine shared-watch planning and experiences.
- Expand community conversations and social interactions.
- Strengthen AI and MCP integrations.
- Improve accessibility, responsiveness, and the TV-friendly experience.

## 🤝 Contributing

Ideas, bug reports, and improvements are welcome!

1. Fork the repository.
2. Create a feature branch.
3. Make your changes and test them.
4. Open a pull request describing your contribution.

## 📄 Credits

- Movie metadata and imagery: [The Movie Database (TMDB)](https://www.themoviedb.org/). This project uses TMDB APIs but is not endorsed or certified by TMDB.
- AI functionality, where enabled, uses the configured AI provider.

---

**VibeFlix — Discover Your Vibe. Find Your People.** 🎬💜
