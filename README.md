<div align="center">

<img src="public/favicon.ico" alt="Shabble Logo" width="80" height="80" />

# 🔷 Shabble

### _Can you guess the hidden shape?_

**A daily shape-guessing puzzle game inspired by Wordle — play once a day, share your score, and flex your geometric intuition.**

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://shabble.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)
[![Contributors](https://img.shields.io/github/contributors/coder-zs-cse/shabble?style=flat-square&color=orange)](https://github.com/coder-zs-cse/shabble/graphs/contributors)
[![Forks](https://img.shields.io/github/forks/coder-zs-cse/shabble?style=flat-square)](https://github.com/coder-zs-cse/shabble/network/members)

<br/>

[🎮 Play Live](https://shabble.vercel.app) · [🐛 Report a Bug](https://github.com/coder-zs-cse/shabble/issues) · [✨ Request a Feature](https://github.com/coder-zs-cse/shabble/issues) · [🤝 Contribute](CONTRIBUTING.md)

</div>

---

## 📖 What is Shabble?

Shabble is a **daily shape-guessing puzzle game** — think Wordle, but for geometry lovers.

Each day, a new hidden shape is waiting. You get a limited number of guesses, with each attempt revealing clues that narrow down the answer. It's simple, satisfying, and surprisingly addictive. Choose between **Easy** and **Hard** mode depending on how brave you're feeling.

> 🗓️ One puzzle per day. Zero distractions. Pure geometry.

---

## ✨ Features

- 🎯 **Daily puzzle** — a fresh shape every 24 hours, same for all players worldwide
- 🔢 **Multiple difficulty modes** — Easy and Hard for every skill level
- 🌙 **Dark mode toggle** — because some of us guess shapes at midnight
- 🎉 **Confetti on win** — you earned it
- 📊 **Score sharing** — brag to your friends with a shareable result card
- 📱 **Fully responsive** — play on any device

---

## 📸 Screenshots

> Screenshots are stored in `docs/screenshots/` — see the [screenshot guide](#-adding-screenshots) below.

<table>
  <tr>
    <td align="center"><b>🌞 Light Mode — Home</b></td>
    <td align="center"><b>🌙 Dark Mode — Home</b></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/home-light.png" alt="Home Light" width="400"/></td>
    <td><img src="docs/screenshots/home-dark.png" alt="Home Dark" width="400"/></td>
  </tr>
  <tr>
    <td align="center"><b>🟢 Easy Mode — Gameplay</b></td>
    <td align="center"><b>🔴 Hard Mode — Gameplay</b></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/gameplay-easy.png" alt="Easy Gameplay" width="400"/></td>
    <td><img src="docs/screenshots/gameplay-hard.png" alt="Hard Gameplay" width="400"/></td>
  </tr>
  <tr>
    <td align="center"><b>🏆 Win State</b></td>
    <td align="center"><b>💀 Loss State</b></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/win.png" alt="Win" width="400"/></td>
    <td><img src="docs/screenshots/loss.png" alt="Loss" width="400"/></td>
  </tr>
</table>

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org/) with Turbopack |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) + [tailwind-variants](https://www.tailwind-variants.org/) |
| **Database ORM** | [Prisma 5](https://www.prisma.io/) |
| **Database** | PostgreSQL |
| **Validation** | [Zod](https://zod.dev/) |
| **Animations** | [canvas-confetti](https://github.com/catdad/canvas-confetti) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [pnpm](https://pnpm.io/) (recommended) — or npm/yarn
- A [PostgreSQL](https://www.postgresql.org/) database (local or hosted, e.g. [Neon](https://neon.tech/), [Supabase](https://supabase.com/))

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/coder-zs-cse/shabble.git
cd shabble
```

**2. Set up environment variables**

```bash
cp .env.example .env
```

Open `.env` and fill in your database URL:

```env
POSTGRES_URL="postgresql://user:password@localhost:5432/shabble"
```

**3. Install dependencies**

```bash
pnpm install
```

**4. Run database migrations**

```bash
npm run prisma:migrate
```

**5. Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Start guessing! 🔷

---

## 📁 Project Structure

```
shabble/
├── app/               # Next.js App Router pages & layouts
├── src/
│   ├── components/    # Reusable UI components
│   ├── lib/           # Utility functions & helpers
│   └── types/         # TypeScript type definitions
├── prisma/
│   └── schema.prisma  # Database schema
├── public/            # Static assets
├── docs/
│   └── screenshots/   # App screenshots (light, dark, gameplay)
└── .env.example       # Environment variable template
```

---

## 🖼️ Adding Screenshots

> **For contributors & maintainers:** Store all screenshots in `docs/screenshots/`.

Use this naming convention so the README table auto-resolves:

| File name | What it shows |
|---|---|
| `home-light.png` | Landing page in light mode |
| `home-dark.png` | Landing page in dark mode |
| `gameplay-easy.png` | Active game on Easy difficulty |
| `gameplay-hard.png` | Active game on Hard difficulty |
| `win.png` | Win state / confetti screen |
| `loss.png` | Game over / reveal screen |

Capture at **1280×800** resolution for consistency. Both light and dark mode screenshots should be included whenever a new UI feature lands.

---

## 🤝 Contributing

We'd love your help making Shabble even better! Whether it's fixing a bug, adding a feature, or improving docs — every contribution counts.

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for the full guide.

**Quick steps:**

```bash
# 1. Fork the repo, then clone your fork
git clone https://github.com/YOUR_USERNAME/shabble.git

# 2. Create a feature branch
git checkout -b feat/your-feature-name

# 3. Make your changes, then commit
git commit -m "feat: add your feature"

# 4. Push and open a PR
git push origin feat/your-feature-name
```

---

## 👥 Contributors

Thanks to all the wonderful people who've contributed to Shabble! 🎉

<!-- ALL-CONTRIBUTORS-LIST:START -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%">
        <a href="https://github.com/coder-zs-cse">
          <img src="https://avatars.githubusercontent.com/u/75170293?v=4" width="80px;" alt="coder-zs-cse"/><br/>
          <sub><b>coder-zs-cse</b></sub>
        </a><br/>
        <sub>💻 Creator & Maintainer</sub>
      </td>
    </tr>
  </tbody>
</table>
<!-- ALL-CONTRIBUTORS-LIST:END -->

[![Contributors](https://contrib.rocks/image?repo=coder-zs-cse/shabble)](https://github.com/coder-zs-cse/shabble/graphs/contributors)

> Want to see your face here? [Start contributing!](CONTRIBUTING.md)

---

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=coder-zs-cse/shabble&type=Date)](https://star-history.com/#coder-zs-cse/shabble&Date)

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute.  
See [LICENSE](LICENSE) for details.

---

<div align="center">

Made with ❤️ by the Shabble community

⭐ If you like this project, give it a star — it helps more people discover it!

[🎮 Play Shabble Now →](https://shabble.vercel.app)

</div>