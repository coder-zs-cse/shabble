# Contributing to Shabble 🔷

First off — thank you for taking the time to contribute! Whether you're fixing a typo, squashing a bug, or shipping a new feature, every contribution makes Shabble better for everyone.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Branch Naming](#branch-naming)
- [Commit Message Format](#commit-message-format)
- [Pull Request Process](#pull-request-process)
- [Development Setup](#development-setup)

---

## 🤝 Code of Conduct

Be kind. Be respectful. We're all here to build something fun together. Harassment or exclusionary behavior of any kind will not be tolerated.

---

## 💡 How Can I Contribute?

### 🐛 Reporting Bugs

Before opening a bug report, please [search existing issues](https://github.com/coder-zs-cse/shabble/issues) to avoid duplicates.

When filing a bug, include:
- A clear title and description
- Steps to reproduce the behavior
- What you expected to happen vs. what actually happened
- Screenshots if applicable
- Your browser/OS/device info

### ✨ Suggesting Features

Open an [issue](https://github.com/coder-zs-cse/shabble/issues/new) with the label `enhancement`. Describe:
- What problem does this solve?
- How would users interact with it?
- Any sketches or mockups (even rough ones) are welcome!

### 📝 Improving Documentation

Spotted a typo, confusing instruction, or a missing section? Go ahead and open a PR — docs improvements are always welcome.

### 💻 Writing Code

Check the [open issues](https://github.com/coder-zs-cse/shabble/issues) for things labeled `good first issue` or `help wanted`. Comment on the issue to let others know you're working on it.

---

## 🚀 Getting Started

1. **Fork** the repository using the Fork button on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/shabble.git
   cd shabble
   ```
3. **Add the upstream remote** so you can keep your fork in sync:
   ```bash
   git remote add upstream https://github.com/coder-zs-cse/shabble.git
   ```
4. **Set up the project** following the [README setup guide](README.md#-getting-started)

---

## 🌿 Branch Naming

Use descriptive, lowercase, hyphen-separated branch names with a type prefix:

| Prefix | When to use |
|---|---|
| `feat/` | New features |
| `fix/` | Bug fixes |
| `docs/` | Documentation only |
| `refactor/` | Code refactoring (no feature/fix) |
| `style/` | Formatting, missing semicolons, etc. |
| `chore/` | Maintenance tasks, dependency updates |

**Examples:**
```
feat/dark-mode-toggle
fix/daily-puzzle-reset
docs/revamp-readme
refactor/game-state-logic
```

---

## 📝 Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) spec:

```
<type>(<optional scope>): <short description>

[optional body]

[optional footer]
```

**Examples:**
```
feat(game): add hard mode difficulty selector
fix(auth): resolve session expiry on daily reset
docs: add contributing guide
chore: upgrade Next.js to 15.1
```

Keep the short description under 72 characters and in the imperative mood ("add" not "added" or "adds").

---

## 🔄 Pull Request Process

1. **Sync your fork** before starting work:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create your branch** from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```

3. **Make your changes** — keep commits focused and atomic

4. **Test locally** — make sure `npm run dev` runs cleanly and your changes work as expected

5. **Push your branch**:
   ```bash
   git push origin feat/your-feature-name
   ```

6. **Open a Pull Request** on GitHub with:
   - A clear title following the commit convention
   - A description of *what* changed and *why*
   - Screenshots/videos for any UI changes
   - Reference to the related issue (e.g., `Closes #27`)

7. **Respond to review feedback** — maintainers may request changes; this is normal and healthy!

---

## 🛠️ Development Setup

```bash
# Install dependencies
pnpm install

# Run the dev server (with Turbopack)
npm run dev

# Run linting
npm run lint

# Generate Prisma client (after schema changes)
npx prisma generate

# Run a new database migration
npm run prisma:migrate
```

The app runs at [http://localhost:3000](http://localhost:3000).

---

## 🖼️ Screenshot Contributions

When adding UI features, please add screenshots to `docs/screenshots/` following the naming convention in the [README](README.md#-adding-screenshots). Include both **light mode** and **dark mode** variants where applicable.

---

Thanks again for contributing to Shabble! 🎉  
Every PR, issue, and idea makes this project better. You're awesome. 🔷