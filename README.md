# LeadFlow AI — Lead Capture & Dashboard System

A complete lead capture and management system powered by **n8n automation** and **AI qualification**.

## 📁 Project Structure

```
n8n-auto-landing-pages/
├── lead-capture-landing-page/   # Public-facing dental landing page
│   ├── src/                     # React components, styles, data
│   ├── index.html               # Entry HTML
│   ├── vite.config.js           # Vite config (port 5174, webhook proxy)
│   ├── .env                     # Webhook URL configuration
│   └── package.json
│
├── dashboard/                   # Admin dashboard for lead management
│   ├── src/                     # React components, context, services
│   ├── index.html               # Entry HTML
│   ├── vite.config.js           # Vite config (port 5173, API proxy)
│   ├── .env                     # n8n API key + webhook config
│   └── package.json
│
└── README.md                    # This file
```

## 🔄 Data Flow

```
Customer visits Landing Page
  → Fills out consultation form
    → Form POSTs to n8n webhook (/webhook/ai-lead-capture)
      → n8n workflow processes the lead:
        → AI qualifies the lead (GPT-4o mini)
        → Routes qualified leads to Google Sheets
        → Sends response back to landing page
          → Dashboard reads n8n executions via API
            → Shows real-time lead updates, stats, execution history
```

## 🚀 Development

### Landing Page (Port 5174)
```bash
cd lead-capture-landing-page
npm install
npm run dev
# → http://localhost:5174
```

### Dashboard (Port 5173)
```bash
cd dashboard
npm install
npm run dev
# → http://localhost:5173
```

## 🌐 Deployment Plan (Future)

| App | Domain |
|-----|--------|
| Landing Page | `leadcapturepage.com` |
| Admin Dashboard | `admin.leadcapture.com` |

## ⚙️ Environment Variables

### Landing Page (`.env`)
```
N8N_BASE_URL=https://your-n8n-instance.com
VITE_WEBHOOK_PATH=ai-lead-capture
```

### Dashboard (`.env`)
```
N8N_BASE_URL=https://your-n8n-instance.com
N8N_API_KEY=your-api-key
VITE_WORKFLOW_ID=your-workflow-id
VITE_WEBHOOK_PATH=ai-lead-capture
```

## 🔐 Security

- **API Key**: Only used server-side via Vite proxy (dashboard only). Never exposed to browser.
- **Webhook**: Public endpoint — no API key needed (landing page).
- **`.env` files**: Gitignored to prevent accidental exposure.
