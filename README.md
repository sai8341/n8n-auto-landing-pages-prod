# Saikumar.ai Monorepo

Mono-repo for Saikumar.ai: Lead Capture Landing Page & Admin Dashboard with n8n integration.

## 🚀 Deployment (Netlify Monorepo)

This repository is structured as a monorepo. You should create **two separate sites** on Netlify pointing to this same repository.

### 1. Lead Capture Landing Page
- **Site Name:** `saikumarai`
- **Base directory:** `lead-capture-landing-page`
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Redirects:** Managed automatically via `lead-capture-landing-page/netlify.toml`.

### 2. Admin Dashboard
- **Site Name:** `saikumar-admin`
- **Base directory:** `dashboard`
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Redirects & Proxy:** Managed via `dashboard/netlify.toml` and a Netlify Function.
- **Environment Variables:**
  - `N8N_BASE_URL`: `https://sai.workflowshub.cloud`
  - `N8N_API_KEY`: Your n8n API Key (found in your `dashboard/.env`)

### Why this setup?
- **Security:** The dashboard uses a server-side Netlify Function to proxy n8n API calls, meaning your **n8n API Key is never exposed** to the user's browser.
- **Automation:** Every push to the `main` branch will automatically trigger a re-deploy for both sites.

---

## 🛠️ Project Structure
```
/
├── dashboard/                  # Admin dashboard (React + Vite)
├── lead-capture-landing-page/  # Public landing page (React + Vite)
└── AGENT.md                    # Detailed project documentation
```
