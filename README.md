# devdock

A local-first developer workspace. 

I built this because I was tired of Googling "json formatter" or "epoch converter" and pasting sensitive data into random websites. **devdock** replaces those scattered tabs with a single, offline application that lives on your `localhost`.

It’s completely client-side. Nothing leaves your browser.

---

### What's inside

The exact tools I use daily, refined to be fast and keyboard-friendly.

- **Scratchpad**: A quick place to dump text or TODOs. Autosaves to `localStorage` while you type.
- **JSON Toolkit**: Format, minify, and validate JSON.
- **Env Diff**: Paste two `.env` files and see exactly what keys are missing, added, or changed.
- **Command Library**: Store complex one-liners (like that long `docker` command) with tags.
- **Timestamp Inspector**: Convert between Epoch ms, seconds, and ISO 8601 without thinking about it.
- **Utils**: Base64 encoder/decoder and Hash generator (SHA-256/512).

### Designed to be calm

Most "developer tools" are cluttered, ugly, or riddled with ads. This isn't.
- **Minimalist**: Clean typography (IBM Plex & Source Serif), muted colors, and intentional whitespace.
- **Responsive**: Works on your vertical monitor, laptop, or split-screen.
- **Dark Mode**: Respects your system preferences automatically.

---

### Running locally

It’s a standard Next.js application.

```bash
git clone https://github.com/halfthew0rldaway/devdock.git
cd devdock
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 (No config, just CSS)
- **State**: React 19 + LocalStorage
- **Type Safety**: TypeScript

### License

MIT. Go ahead and fork it, change the tools, or make it your own personal dashboard.
