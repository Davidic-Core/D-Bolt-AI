# Replit Development Guide: D-Bolt-AI

This document provides specific instructions for developing and running D-Bolt-AI within the Replit environment.

## 🚀 Quick Start on Replit

1. **Environment Setup**: Replit automatically detects the `package.json` and suggests installing dependencies. If not, run:
   ```bash
   npm install
   ```
2. **Run Application**: Click the "Run" button or execute:
   ```bash
   npm run dev
   ```
   The app will be available on port `5000`.

## 🔑 API Configuration

D-Bolt-AI uses **OpenRouter** for AI capabilities. 

- **Storage**: For security and convenience, your API key is stored in the browser's `localStorage`.
- **Setup**: Open the **Settings** modal in the web preview and paste your key.
- **Persistence**: The key persists across browser sessions but is never stored on the Replit server itself.

## 🌿 Branch & Deployment Strategy

- **Main Branch**: This is the production-ready branch. Do not commit directly to `main`.
- **Feature Branches**: Create a new branch for every task. Use the Replit Git pane to manage branches.
- **Publishing**: Use the **Deploy** tab to publish the static build. Replit is configured to build from `npm run build` and serve from the `dist` directory.

## 🛠️ Development Tips

- **HMR**: Hot Module Replacement is configured to work through the Replit proxy. If styles aren't updating, check `vite.config.ts`.
- **Testing**: Test AI streaming by ensuring you have a valid balance on your OpenRouter account.
- **Dependencies**: Keep the project healthy by occasionally running `npm update` to get the latest security patches.

## 📝 Maintenance

Update this `REPLIT.md` file whenever you make significant changes to the environment configuration or deployment workflow.
