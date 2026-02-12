# AGENT.md — LeadFlow AI: Single Source of Truth

> **Last Updated:** 2026-02-12  
> **Purpose:** This document is the definitive reference for the LeadFlow AI project. Read it thoroughly before making any changes, adding features, or debugging issues.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Project Structure](#2-project-structure)
3. [Technology Stack](#3-technology-stack)
4. [Application Architecture](#4-application-architecture)
5. [Landing Page — Details](#5-landing-page--details)
6. [Dashboard — Details](#6-dashboard--details)
7. [n8n Workflow — Details](#7-n8n-workflow--details)
8. [Google Sheets Integration](#8-google-sheets-integration)
9. [Data Flow (End-to-End)](#9-data-flow-end-to-end)
10. [Environment Variables](#10-environment-variables)
11. [Proxy Configuration](#11-proxy-configuration)
12. [API Contracts](#12-api-contracts)
13. [Key Design Decisions](#13-key-design-decisions)
14. [Known Issues & Gotchas](#14-known-issues--gotchas)
15. [Development Setup](#15-development-setup)
16. [Deployment Plan](#16-deployment-plan)
17. [File-by-File Reference](#17-file-by-file-reference)

---

## 1. Project Overview

**LeadFlow AI** is a complete AI-powered lead capture and management system consisting of:

- **A public-facing landing page** (`lead-capture-landing-page/`) branded as **Saikumar.ai** — an AI automation services business based in Hyderabad.
- **An admin dashboard** (`dashboard/`) branded as **LeadFlow AI** — for monitoring leads, workflow executions, and AI qualification results in real-time. Hosted on your VPS at `admin.workflowshub.cloud`.
- **An n8n automation workflow** (hosted on your VPS at `https://sai.workflowshub.cloud`) that processes leads via OpenAI GPT-4o-mini, qualifies them, stores qualified leads in Google Sheets, and returns JSON responses.
- **A security proxy** (`vps-proxy/`) — a Node.js Express app running on your VPS that handles API authentication and secure routing between the dashboard and n8n.

The core value proposition: A visitor fills out the landing page form → n8n receives the webhook → AI qualifies the lead → Qualified leads are saved to Google Sheets → Both the landing page and dashboard get real-time feedback.

---

## 2. Project Structure

```
d:\n8n-auto-landing-pages\
├── AGENT.md                        ← THIS FILE (project documentation)
├── README.md                       ← Basic project readme
├── .gitignore                      ← Ignores node_modules, dist, .env files
│
├── lead-capture-landing-page\      ← PUBLIC LANDING PAGE (Port 5174)
│   ├── index.html                  ← Entry HTML (SEO meta tags, Google Fonts: Plus Jakarta Sans)
│   ├── package.json                ← name: "brightsmile-landing-page" (legacy name)
│   ├── vite.config.js              ← Port 5174, webhook proxy config
│   ├── workflow.json               ← Exported snapshot of the n8n workflow (reference only)
│   ├── test-payload.json           ← Test payload (basic lead)
│   ├── test-qualified.json         ← Test payload (qualified lead)
│   └── src\
│       ├── main.jsx                ← React entry point
│       ├── App.jsx                 ← Main app — renders all sections in order
│       ├── App.css                 ← Global app styles
│       ├── index.css               ← CSS reset and design tokens
│       ├── data\
│       │   └── businessData.js     ← ALL business content data (services, testimonials, FAQs, etc.)
│       └── components\
│           ├── Navbar.jsx / .css       ← Sticky navigation with scroll effect + mobile hamburger
│           ├── Hero.jsx / .css         ← Hero section with stats, CTAs, floating badges
│           ├── TrustBar.jsx / .css     ← Trust indicators bar (client logos/stats)
│           ├── Services.jsx / .css     ← 6 service cards with hover expansion
│           ├── WhyChooseUs.jsx / .css  ← 4 value propositions
│           ├── UseCases.jsx / .css     ← 3 industry use case cards
│           ├── Testimonials.jsx / .css ← 4 client testimonials with star ratings
│           ├── LeadCaptureForm.jsx/.css ← ★ THE CORE FORM — submits leads to n8n webhook
│           ├── FAQ.jsx / .css          ← 4 accordion FAQ items
│           └── Footer.jsx / .css       ← Multi-column footer with contact info
│
├── dashboard\                      ← ADMIN DASHBOARD (Port 5173)
│   ├── index.html                  ← Entry HTML (Google Fonts: Inter + JetBrains Mono)
│   ├── package.json                ← name: "n8n-auto-landing-pages" (legacy name)
│   ├── vite.config.js              ← API proxy + webhook proxy config
│   ├── eslint.config.js            ← ESLint config
│   ├── dist\                       ← Production build output (pre-built)
│   └── src\
│       ├── main.jsx                ← React entry wrapped in DataProvider
│       ├── App.jsx                 ← Tab-based SPA (Overview, Leads, Capture, Executions, Workflow)
│       ├── App.css                 ← App layout styles
│       ├── index.css               ← Global dashboard styles, design tokens
│       ├── context\
│       │   └── DataContext.jsx     ← ★ Central data provider — fetches from n8n API every 30s
│       ├── services\
│       │   └── n8nApi.js           ← ★ All n8n API calls + execution data parsers
│       ├── data\
│       │   └── mockData.js         ← Utility functions only (formatDateTime, timeAgo, formatDuration)
│       └── components\
│           ├── Sidebar.jsx / .css      ← Collapsible sidebar navigation
│           ├── Header.jsx / .css       ← Top bar with stats counters + LIVE indicator
│           ├── DashboardOverview.jsx/.css ← Overview tab with stats cards
│           ├── LeadTable.jsx / .css    ← All Leads tab — table of leads parsed from executions
│           ├── LeadForm.jsx / .css     ← Capture Lead tab — form to submit leads from dashboard
│           ├── ExecutionHistory.jsx/.css ← Executions tab — execution status/timing table
│           ├── WorkflowFlow.jsx / .css ← Workflow tab — visual node diagram
│           └── LoadingState.jsx / .css ← Loading spinner + error state components
```

---

## 3. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend Framework** | React | 19.x |
| **Build Tool** | Vite | 7.3.x |
| **Styling** | Vanilla CSS (no Tailwind) | — |
| **Fonts (Landing)** | Plus Jakarta Sans (Google Fonts) | — |
| **Fonts (Dashboard)** | Inter + JetBrains Mono (Google Fonts) | — |
| **Automation Engine** | n8n (self-hosted) | 2.33.4 |
| **AI Model** | OpenAI GPT-4o-mini | via n8n OpenAI node |
| **Data Store** | Google Sheets (for qualified leads) | via n8n Google Sheets node |
| **Hosting (All)** | Hostinger VPS (Ubuntu 24.04) | — |
| **Process Manager** | PM2 / Systemd | — |

**Architecture Note:** The production system uses an Nginx reverse proxy to serve static files and routes API traffic through a Node.js security proxy (`vps-proxy/`) to keep credentials secure.

---

## 4. Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    LANDING PAGE (workflowshub.cloud)        │
│  React Build Files → Nginx → POST /n8n-webhook/             │
│  Nginx Proxy → http://localhost:5678/webhook/               │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP POST (JSON)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              n8n WORKFLOW (workflowshub.cloud)               │
│  Webhook → AI Qualification (GPT-4o-mini) → If Qualified?   │
│    ├── YES → Append to Google Sheet → Qualified Response     │
│    └── NO  → Not Qualified Response                          │
│  Returns JSON response with qualification result             │
└──────────────────────┬──────────────────────────────────────┘
                       │ Local Proxy (Port 3000)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              DASHBOARD (admin.workflowshub.cloud)           │
│  Nginx → Serves Dashboard Static Files                      │
│  API Calls (/n8n-api) → VPS Proxy (injects X-N8N-API-KEY)   │
│  VPS Proxy → http://localhost:5678/api/v1                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Landing Page — Details

### Business Identity
- **Brand:** Saikumar.ai
- **Tagline:** "Empowering Businesses with Intelligent Automation"
- **Location:** Hitech City, Hyderabad, TS 500081
- **Contact:** +91 8341096920 / hello@saikumar.ai

### Page Sections (in render order)
1. **Navbar** — Sticky, glassmorphism, scroll-aware opacity change, mobile hamburger menu
2. **Hero** — Headline, subheadline, dual CTAs, trust avatars, floating badges, stats card
3. **TrustBar** — Social proof indicators
4. **Services** — 6 cards: Custom AI Agents, Workflow Automation, Intelligent Chatbots, Lead Flow Optimization, AI Strategy Consulting, Managed AI Services
5. **WhyChooseUs** — 4 value props: Speed to Market, Result Driven, Secure & Private, Infinite Scalability
6. **UseCases** — 3 industry examples: E-commerce Support, Real Estate Lead Gen, SaaS Onboarding
7. **Testimonials** — 4 client reviews with avatars, ratings, service tags
8. **LeadCaptureForm** — ★ The core conversion form (see below)
9. **FAQ** — 4 accordion items
10. **Footer** — Company info, solution links, contact details

### LeadCaptureForm Component (★ Critical)
- **Fields:** Name (required), Email (required), Phone (required), Service (dropdown, required), Message (optional)
- **Service Options:** AI Agents & Chatbots, Workflow Automation, Lead Flow Optimization, AI Strategy & Consulting, Custom LLM Integration, Other Automation Inquiry
- **Webhook Path:** Configured via `VITE_WEBHOOK_PATH` env var (default: `ai-lead-capture`)
- **Submission URL:** `POST /n8n-webhook/ai-lead-capture` (proxied by Vite)
- **Payload sent:**
  ```json
  {
    "name": "...",
    "email": "...",
    "phone": "...",
    "service": "...",
    "message": "...",
    "source": "saikumar-ai-landing-page",
    "submittedAt": "2026-02-12T10:00:00.000Z"
  }
  ```
- **Success state:** Shows "Inbound Request Received!" card with 🚀 icon
- **Error state:** Shows "Something went wrong. Please try again or reach out on LinkedIn."

### Design System
- **CSS approach:** Vanilla CSS with CSS custom properties (variables)
- **Visual style:** Dark mode, glassmorphism (`.glass` class), gradient accents, micro-animations
- **Font:** Plus Jakarta Sans (400–900 weights)

---

## 6. Dashboard — Details

### Tab-Based Navigation
| Tab | Component | Description |
|-----|-----------|-------------|
| **Overview** | `DashboardOverview.jsx` | Stats cards (total leads, qualified count, rate, tokens used, avg duration), recent leads list, recent executions list |
| **All Leads** | `LeadTable.jsx` | Full table of all leads parsed from n8n execution data, with status badges, filtering |
| **Capture Lead** | `LeadForm.jsx` | Form to manually submit a lead (same webhook as landing page) |
| **Executions** | `ExecutionHistory.jsx` | Table of all workflow executions with status, duration, lead info, errors |
| **Workflow** | `WorkflowFlow.jsx` | Visual representation of the n8n workflow nodes and connections |

### Data Architecture
The dashboard has **NO mock data** and **NO separate backend**. All data comes from the live n8n API:

1. **`DataContext.jsx`** (central state):
   - Fetches workflow metadata via `GET /n8n-api/workflows/{WORKFLOW_ID}`
   - Fetches executions via `GET /n8n-api/executions?workflowId={WORKFLOW_ID}&includeData=true&limit=100`
   - Auto-refreshes every **30 seconds** (`REFRESH_INTERVAL = 30000`)
   - Derives: `workflow`, `leads`, `executions`, `stats` via memoized parsers

2. **`n8nApi.js`** (data service):
   - `fetchWorkflow()` — Gets workflow definition
   - `fetchExecutions(limit)` — Gets execution history with data
   - `parseLeadsFromExecutions(executions)` — Extracts lead info from webhook node + AI results
   - `parseExecutionsMeta(executions)` — Extracts execution metadata (status, duration, errors)
   - `parseWorkflowInfo(workflow)` — Parses nodes and connections for visual display
   - `submitLead({...})` — Submits a lead via webhook from dashboard

3. **Execution Data Parsing** (CRITICAL understanding):
   Lead data is NOT fetched from Google Sheets. It is parsed directly from the **execution result data** returned by n8n's API:
   - Lead info: `runData['Webhook'][0].data.main[0][0].json.body.{name,email,phone,...}`
   - AI result: `runData['AI Qualification'][0].data.main[0][0].json.message.content` (simplified format) **OR** `runData['AI Qualification'][0].data.main[0][0].json.choices[0].message.content` (full format)
   - The parser handles **both formats** with fallback: `aiData?.message?.content || aiData?.choices?.[0]?.message?.content`

### Design System
- **CSS approach:** Vanilla CSS with custom properties
- **Visual style:** Dark theme, card-based layout, sidebar navigation
- **Fonts:** Inter (UI text), JetBrains Mono (monospace/code elements)

---

## 7. n8n Workflow — Details

### Workflow Identity
| Property | Value |
|----------|-------|
| **Name** | AI Lead Capture & Booking MVP |
| **ID** | `z7hftIHKkaxIDHKMCflwE` |
| **Status** | Active ✅ |
| **Host** | `https://sai.workflowshub.cloud` |
| **Owner** | Sai Kumar (`saikumard8390@gmail.com`) |
| **Webhook Path** | `/webhook/ai-lead-capture` |

### Workflow Nodes (8 total)

```
[Webhook] → [AI Qualification] → [Is Qualified?]
                                      ├── TRUE  → [Append or Update Sheet] → [Email to Lead] → [Email to Admin] → [Qualified Response]
                                      └── FALSE → [Not Qualified Response]
```

**Key Features:**
- **Duplicate Detection:** Uses `appendOrUpdate` operation with `Email` as the matching column. If a lead with the same email submits again, their existing row is **updated** instead of creating a duplicate.
- **Email Notifications:** Sends personalized HTML emails to both the lead (confirmation) and admin (notification) after successful Google Sheets entry.
- **Updated AI Prompt:** System prompt now correctly references Saikumar.ai and AI automation services (no longer the old "dental clinic" prompt).

#### Node 1: Webhook
- **Type:** `n8n-nodes-base.webhook` (v2.1)
- **Method:** POST
- **Path:** `ai-lead-capture`
- **Response Mode:** `responseNode` (response is sent by a downstream Respond to Webhook node)
- **On Error:** `continueRegularOutput`
- **Input data is available at:** `$json.body.{name, email, phone, service, message, source, submittedAt}`

#### Node 2: AI Qualification
- **Type:** `n8n-nodes-base.openAi` (v1.1)
- **Model:** `gpt-4o-mini`
- **Credential:** `OpenAIAPIKey` (id: `L50tzVeIuwayaVlB`)
- **Resource:** `chat`
- **Output format:** `{ index, message: { role, content }, logprobs, finish_reason }`
  - Data is accessed via `$json.message.content`
  - **Both formats** (`$json.message.content` and `$json.choices[0].message.content`) should be handled in any downstream parsing for backward compatibility with historical executions
- **System Prompt:**
  ```
  You are an AI automation expert and lead qualification assistant for Saikumar.ai. Classify the lead as either QUALIFIED or NOT_QUALIFIED based on their interest in AI automation or business agents.

  A qualified lead must:
  - Show interest in automating business processes, AI agents, or custom AI solutions.
  - Be looking for consultation or services related to business efficiency.

  Respond ONLY in this exact format:
  STATUS: QUALIFIED or NOT_QUALIFIED
  REASON: short explanation
  ```
- **User Prompt (template):**
  ```
  Name: {{ $json.body.name }}
  Email: {{ $json.body.email }}
  Phone: {{ $json.body.phone || 'Not provided' }}
  Service: {{ $json.body.service || 'Not specified' }}
  Message: {{ $json.body.message }}
  ```

#### Node 3: Is Qualified?
- **Type:** `n8n-nodes-base.if` (v2.3)
- **Condition:** Extracts `STATUS` from AI response using regex, compares to `"QUALIFIED"`
- **Expression:** `{{ ($json.message.content.match(/STATUS:\s*(\w+)/i) || [])[1] }}`
- **Case Sensitive:** `false`
- **Output 0 (true):** Leads to "Append or Update Sheet"
- **Output 1 (false):** Leads to "Not Qualified Response"

#### Node 4: Append or Update Sheet
- **Type:** `n8n-nodes-base.googleSheets` (v4.7)
- **Credential:** `Google Sheets account` (OAuth2, id: `JQS8IgeFbaxByY61`)
- **Operation:** `appendOrUpdate` ← **KEY: Handles duplicates by updating existing rows**
- **Matching Column:** `Email` ← **Used to detect duplicates**
- **Document ID:** `1omzK8szrA7bAdplT_ZAgu-XqI12rwuDXiP36yOsjqBk`
- **Sheet:** `Sheet1` (gid=0)
- **Data Mode:** `defineBelow` (using schema mapping)
- **Column Mapping:**

| Sheet Column | Expression | Source |
|--------------|-----------|--------|
| Name | `{{ $('Webhook').item.json.body.name }}` | Webhook body |
| Email | `{{ $('Webhook').item.json.body.email }}` | Webhook body (matching key) |
| Message | `{{ $('Webhook').item.json.body.message \|\| $('Webhook').item.json.body.service \|\| 'No message' }}` | Webhook body |
| Mobile | `{{ $('Webhook').item.json.body.phone \|\| 'Not provided' }}` | Webhook body |
| Status | `{{ ($json.message.content.match(/STATUS:\s*(\w+)/i) \|\| [])[1] \|\| 'UNKNOWN' }}` | AI output |
| Reason | `{{ ($json.message.content.match(/REASON:\s*(.*)/i) \|\| [])[1] \|\| 'No reason provided' }}` | AI output |
| Timestamp | `{{ $('Webhook').item.json.body.submittedAt \|\| new Date().toISOString() }}` | Webhook body or server time |

#### Node 5: Email to Lead
- **Type:** `n8n-nodes-base.emailSend` (v2.1)
- **Credential:** SMTP (**✅ Configured as "Gmail SMTP"**)
- **Operation:** `send`
- **Email Format:** `html`
- **To:** `{{ $('Webhook').item.json.body.email }}` (dynamic — the lead's email)
- **Subject:** `Thank you, {{ name }}! We received your inquiry 🚀`
- **Body:** Branded HTML email with:
  - Purple gradient header with Saikumar.ai branding
  - Personalized greeting
  - Submission details table
  - Footer with copyright
- **On Error:** `continueRegularOutput`

#### Node 6: Email to Admin
- **Type:** `n8n-nodes-base.emailSend` (v2.1)
- **Credential:** SMTP (**✅ Configured as "Gmail SMTP"**)
- **Operation:** `send`
- **Email Format:** `html`
- **To:** `saikumard8390@gmail.com`
- **Subject:** `🔔 New Qualified Lead: {{ name }} ({{ service }})`
- **Body:** Branded HTML email with:
  - Green gradient header ("New Qualified Lead Captured!")
  - Lead details table and direct link to Google Sheets
- **On Error:** `continueRegularOutput`

#### Node 7: Qualified Response
- **Type:** `n8n-nodes-base.respondToWebhook` (v1.5)
- **Response Body (JSON string):**
  ```json
  {
    "status": "qualified",
    "name": "<from Webhook>",
    "email": "<from Webhook>",
    "qualification": "QUALIFIED",
    "reason": "<extracted from AI>",
    "savedToSheets": true,
    "emailSent": true,
    "timestamp": "<ISO string>"
  }
  ```

#### Node 8: Not Qualified Response
- **Type:** `n8n-nodes-base.respondToWebhook` (v1.5)
- **Response Body (JSON string):**
  ```json
  {
    "status": "not_qualified",
    "name": "<from Webhook>",
    "email": "<from Webhook>",
    "qualification": "NOT_QUALIFIED",
    "reason": "<extracted from AI>",
    "timestamp": "<ISO string>"
  }
  ```

### Workflow Credentials
| Credential Name | Type | ID | Used By |
|----------------|------|-----|---------| 
| OpenAIAPIKey | OpenAI API | `L50tzVeIuwayaVlB` | AI Qualification node |
| Google Sheets account | Google Sheets OAuth2 | `JQS8IgeFbaxByY61` | Append or Update Sheet node |
| Gmail SMTP | SMTP | `LFGuPL68Pgg3BIDT` | Email to Lead, Email to Admin |

### ✅ SMTP Credential Setup Complete
The workflow is now configured to use **Gmail SMTP** with an App Password. This handles:
1. **Lead Confirmation Email**
2. **Admin Notification Email**

Tested and verified in execution **#3849**.

---

## 8. Google Sheets Integration

| Property | Value |
|----------|-------|
| **Sheet Name** | Lead storing |
| **Document ID** | `1omzK8szrA7bAdplT_ZAgu-XqI12rwuDXiP36yOsjqBk` |
| **URL** | `https://docs.google.com/spreadsheets/d/1omzK8szrA7bAdplT_ZAgu-XqI12rwuDXiP36yOsjqBk/edit` |
| **Sheet Tab** | Sheet1 (gid=0) |
| **Range** | A:H |
| **Columns** | Name, Email, Message, Mobile, Status, Reason, Timestamp, Source |

Only **QUALIFIED** leads are written to the sheet. The node uses `appendOrUpdate` operation — if a lead with the same email already exists, the row is **updated** with the latest data instead of creating a duplicate.

---

## 9. Data Flow (End-to-End)

### Flow 1: Lead Submission (Landing Page → n8n → Google Sheets)
```
1. Visitor fills form on Landing Page (localhost:5174)
2. Form POSTs JSON to /n8n-webhook/ai-lead-capture
3. Vite proxy rewrites → https://sai.workflowshub.cloud/webhook/ai-lead-capture
4. n8n Webhook node receives POST body under $json.body
5. AI Qualification node sends lead data to GPT-4o-mini
6. GPT responds with STATUS: QUALIFIED/NOT_QUALIFIED and REASON
7. Is Qualified? node extracts STATUS via regex
8. If QUALIFIED:
   a. Append row in sheet → writes 8 columns to Google Sheet
   b. Qualified Response → returns JSON { status: "qualified", ... }
9. If NOT_QUALIFIED:
   a. Not Qualified Response → returns JSON { status: "not_qualified", ... }
10. Landing page shows success card ("Inbound Request Received!")
```

### Flow 2: Dashboard Data (n8n API → Dashboard)
```
1. Dashboard loads (localhost:5173)
2. DataContext fetches:
   a. GET /n8n-api/workflows/z7hftIHKkaxIDHKMCflwE → workflow definition
   b. GET /n8n-api/executions?workflowId=...&includeData=true&limit=100 → execution data
3. Vite proxy rewrites /n8n-api → /api/v1 and injects X-N8N-API-KEY header
4. parseLeadsFromExecutions() extracts lead data from each execution's runData:
   - Webhook node data → name, email, phone, service, message, source
   - AI Qualification node data → qualification status, reason, tokens used
5. parseExecutionsMeta() extracts execution metadata (status, duration, errors)
6. parseWorkflowInfo() extracts node graph for visualization
7. Stats are computed: total leads, qualification rate, avg duration, total tokens
8. DataContext auto-refreshes every 30 seconds
```

### Flow 3: Dashboard Lead Submission (Dashboard → n8n)
```
1. User fills the "Capture Lead" form on Dashboard
2. Form POSTs JSON to /n8n-webhook/ai-lead-capture (same webhook as landing page)
3. Same n8n workflow processes the lead
4. Dashboard refreshes to show the new lead in real-time
```

---

## 10. Environment Variables

### Landing Page (`lead-capture-landing-page/.env`)
```env
N8N_BASE_URL=https://sai.workflowshub.cloud     # n8n instance URL (used by Vite proxy, NOT exposed to browser)
VITE_WEBHOOK_PATH=ai-lead-capture                # Webhook path (exposed to browser via import.meta.env)
```

### Dashboard (`dashboard/.env`)
```env
# These are used for Local Development via Vite Proxy
N8N_BASE_URL=https://sai.workflowshub.cloud
N8N_API_KEY=n8n_api_...
VITE_WORKFLOW_ID=z7hftIHKkaxIDHKMCflwE
VITE_WEBHOOK_PATH=ai-lead-capture
```

### VPS Proxy (`/opt/leadflow-ai/proxy/.env`)
```env
# These are used for Production Proxy logic
N8N_BASE_URL=http://127.0.0.1:5678
N8N_API_KEY=n8n_api_...
PORT=3000
```

> **Security Note:** The `N8N_API_KEY` is NEVER bundled into the browser code. In development, the Vite server holds it. In production, the Node Express proxy holds it.

---

## 11. Proxy Configuration

### Landing Page Vite Proxy (`lead-capture-landing-page/vite.config.js`)
```
/n8n-webhook/*  →  https://sai.workflowshub.cloud/webhook/*
```
- `changeOrigin: true`, `secure: true`
- Rewrite: `/n8n-webhook` → `/webhook`
- No API key needed (webhook is a public endpoint)

### Dashboard Vite Proxy (`dashboard/vite.config.js`)
```
/n8n-api/*      →  https://sai.workflowshub.cloud/api/v1/*     (+ X-N8N-API-KEY header)
/n8n-webhook/*  →  https://sai.workflowshub.cloud/webhook/*
```
- The API proxy injects `X-N8N-API-KEY` header on every request using `proxy.on('proxyReq', ...)`
- This keeps the API key server-side only

---

## 12. API Contracts

### Webhook Request (from frontend to n8n)
```
POST /n8n-webhook/ai-lead-capture
Content-Type: application/json

{
  "name": string,          // required
  "email": string,         // required
  "phone": string,         // required
  "service": string,       // required (from dropdown)
  "message": string,       // optional
  "source": string,        // auto-set: "saikumar-ai-landing-page" or "dashboard"
  "submittedAt": string    // ISO 8601 timestamp
}
```

### Webhook Response (from n8n to frontend)
**Qualified:**
```json
{
  "status": "qualified",
  "name": "John Smith",
  "email": "john@techcorp.com",
  "qualification": "QUALIFIED",
  "reason": "Lead shows clear interest in AI automation services.",
  "savedToSheets": true,
  "timestamp": "2026-02-12T10:29:38.471Z"
}
```

**Not Qualified:**
```json
{
  "status": "not_qualified",
  "name": "Test User",
  "email": "test@test.com",
  "qualification": "NOT_QUALIFIED",
  "reason": "No clear business need identified.",
  "savedToSheets": false,
  "timestamp": "2026-02-12T10:29:38.471Z"
}
```

### n8n REST API (used by dashboard only)
```
GET /n8n-api/workflows/{workflowId}                      → Workflow definition
GET /n8n-api/executions?workflowId={id}&includeData=true  → Execution history with data
```
Both proxied through Vite to `/api/v1/*` with API key injected.

---

## 13. Key Design Decisions

### 1. No Separate Backend
The project intentionally has **no Express/Node.js backend**. Vite's dev server proxy handles all API routing. For production, a reverse proxy (Nginx/Cloudflare) or serverless functions would be needed.

### 2. Data Parsed from n8n Executions (Not Google Sheets)
The dashboard reads lead data from **n8n execution history**, NOT from Google Sheets. This was a deliberate choice because:
- n8n's API provides richer data (execution status, timing, AI token usage, error details)
- No need for a separate Google Sheets API integration in the frontend
- Real-time data without polling Google's API

### 3. Google Sheets as Write-Only Storage
Google Sheets serves as **persistent storage for qualified leads only**. The dashboard never reads from it. It is the "CRM" layer for manual business review.

### 4. OpenAI Output Format Handling
The dashboard's parser handles **both** OpenAI output formats:
- `$json.message.content` (simplified output, `simplifyOutput: true`)
- `$json.choices[0].message.content` (full output, `simplifyOutput: false`)

This dual handling exists because the workflow was modified multiple times, and different executions may have different output structures in their historical data.

### 5. `responseNode` Mode on Webhook
The webhook uses `responseMode: "responseNode"`, meaning the HTTP response is NOT sent immediately when the webhook receives data. Instead, it waits for a downstream "Respond to Webhook" node to define the response. This allows the workflow to process data (AI qualification) before responding.

### 6. CSS-Only Styling
Both apps use **vanilla CSS** with CSS custom properties. No Tailwind, no CSS-in-JS, no component libraries. This keeps bundle size small and gives full design control.

### 7. Vite Env Var Convention
Only variables prefixed with `VITE_` are exposed to the browser bundle. Server-only secrets (`N8N_BASE_URL`, `N8N_API_KEY`) are NOT prefixed, keeping them server-side only.

---

## 14. Known Issues & Gotchas

### ✅ AI Prompt — Fixed
The AI Qualification node's system prompt has been updated to correctly reference **Saikumar.ai** and AI automation services (was previously "dental clinic"). The prompt now evaluates leads based on their interest in automating business processes, AI agents, or custom AI solutions.

### ⚠️ `simplifyOutput` Format — Historical Compatibility
The current live workflow uses `$json.message.content` format (OpenAI node v1.1). However, **historical executions** stored in n8n may use the `$json.choices[0].message.content` format. The dashboard's parser handles **both formats** with fallback logic.

### ⚠️ Gmail OAuth2 Credential — Not Yet Configured
The **Email to Lead** and **Email to Admin** Gmail nodes currently do not have a valid Gmail OAuth2 credential. The workflow still runs successfully (due to `onError: continueRegularOutput`), but emails will not be sent until the credential is configured in the n8n UI. See [Section 7 — Gmail Credential Setup](#-gmail-credential-setup-required) for instructions.

### ⚠️ Google Sheets Node — Duplicate Handling
The Google Sheets node now uses `appendOrUpdate` (v4.7) with `Email` as the matching column. If the sheet columns are renamed or the Email column header is missing, the duplicate detection will fail and all leads will be appended as new rows.

### ✅ Production Deployment — Complete
Both apps are now deployed on a Hostinger VPS using Nginx, PM2, and a custom security proxy. Static files are served via Nginx, and all API traffic is securely routed through the local proxy to n8n.

### ⚠️ Landing Page `index.html` Metadata
The `index.html` still has the old "BrightSmile Dental Care" title and meta description from the original template. Should be updated to match "Saikumar.ai".

### ⚠️ `package.json` Names
- Landing page: `"name": "brightsmile-landing-page"` (legacy, should be updated)
- Dashboard: `"name": "n8n-auto-landing-pages"` (generic, should be updated)

### ⚠️ `.env` Files Are Gitignored
The `.env` files are in `.gitignore` and will NOT be in version control. New developers must create them from the template in [Section 10](#10-environment-variables).

---

## 15. Development Setup

### Prerequisites
- Node.js (v18+ recommended)
- npm
- Access to n8n instance at `https://sai.workflowshub.cloud`
- n8n API key (for dashboard)

### Quick Start

```bash
# 1. Clone the repository
git clone <repo-url>
cd n8n-auto-landing-pages

# 2. Set up Landing Page
cd lead-capture-landing-page
cp .env.example .env   # Create .env with N8N_BASE_URL and VITE_WEBHOOK_PATH
npm install
npm run dev            # → http://localhost:5174

# 3. Set up Dashboard (in a new terminal)
cd ../dashboard
cp .env.example .env   # Create .env with N8N_BASE_URL, N8N_API_KEY, VITE_WORKFLOW_ID, VITE_WEBHOOK_PATH
npm install
npm run dev            # → http://localhost:5173
```

### Testing the Webhook
```bash
# From the lead-capture-landing-page directory:
curl -s -X POST https://sai.workflowshub.cloud/webhook/ai-lead-capture \
  -H "Content-Type: application/json" \
  --data-binary "@test-qualified.json"
```

Or through the Vite proxy:
```bash
curl -s -X POST http://localhost:5174/n8n-webhook/ai-lead-capture \
  -H "Content-Type: application/json" \
  --data-binary "@test-qualified.json"
```

---

## 16. Deployment Plan

| App | Planned Domain | Status |
|-----|---------------|--------|
| Landing Page | `workflowshub.cloud` | ✅ Live (VPS) |
| Admin Dashboard | `admin.workflowshub.cloud` | ✅ Live (VPS) |
| n8n Instance | `sai.workflowshub.cloud` | ✅ Live (VPS) |
| Google Sheets | N/A (backend only) | ✅ Live |

### Production Requirements
1. **Reverse proxy** (Nginx/Caddy) to handle:
   - Landing page static files
   - `/webhook/*` proxy to n8n (no API key)
   - `/api/v1/*` proxy to n8n (with API key, for dashboard)
2. **Build the apps:** `npm run build` in each directory
3. **Environment variables** must be set at build time for `VITE_*` vars
4. **Server-side secrets** (`N8N_API_KEY`) must be configured in the reverse proxy, not in the frontend build

---

## 17. File-by-File Reference

### Landing Page Files
| File | Lines | Purpose |
|------|-------|---------|
| `index.html` | 22 | Entry HTML, `<meta>` tags (⚠️ still has BrightSmile metadata), Plus Jakarta Sans font |
| `vite.config.js` | 22 | Port 5174, `/n8n-webhook` proxy → `/webhook` |
| `package.json` | 19 | React 19, Vite 7.3 (no other deps) |
| `workflow.json` | 1 (minified) | Snapshot of n8n workflow export — **reference only, not used at runtime** |
| `test-payload.json` | — | Test payload for curl testing |
| `test-qualified.json` | — | Test payload designed to be classified as QUALIFIED |
| `src/main.jsx` | ~10 | React entry point |
| `src/App.jsx` | 31 | Renders all sections in order |
| `src/data/businessData.js` | 185 | **All** business content: company info, hero data, services (6), why choose us (4), testimonials (4), use cases (3), service dropdown options (6), FAQs (4) |
| `src/components/LeadCaptureForm.jsx` | 259 | ★ Core form — handles submission, loading, success, error states |

### Dashboard Files
| File | Lines | Purpose |
|------|-------|---------|
| `index.html` | 18 | Entry HTML, Inter + JetBrains Mono fonts |
| `vite.config.js` | 36 | Port 5173, `/n8n-api` proxy (with API key injection), `/n8n-webhook` proxy |
| `package.json` | 28 | React 19, Vite 7.3, ESLint |
| `src/main.jsx` | 14 | React entry wrapped in `<DataProvider>` |
| `src/App.jsx` | 81 | Tab-based SPA with 5 tabs, responsive sidebar |
| `src/context/DataContext.jsx` | 104 | ★ Central data provider — fetches n8n API, computes stats, 30s refresh |
| `src/services/n8nApi.js` | 209 | ★ All API calls + data parsers for leads, executions, workflow |
| `src/data/mockData.js` | 42 | Utility functions only: `formatDateTime`, `timeAgo`, `formatDuration` |
| `src/components/DashboardOverview.jsx` | 177 | Overview tab — stats cards, recent leads, recent executions |
| `src/components/LeadTable.jsx` | 173 | All Leads tab — sortable table with status badges |
| `src/components/LeadForm.jsx` | 281 | Capture Lead tab — manual lead submission form |
| `src/components/ExecutionHistory.jsx` | 208 | Executions tab — status/duration/error table |
| `src/components/WorkflowFlow.jsx` | 236 | Workflow tab — visual node diagram with icons |
| `src/components/Sidebar.jsx` | 63 | Collapsible sidebar with workflow status badge |
| `src/components/Header.jsx` | 45 | Top bar with counters, refresh button, LIVE indicator |
| `src/components/LoadingState.jsx` | ~30 | Loading spinner + error state reusable components |

---

*This document should be updated whenever significant changes are made to the project structure, n8n workflow, or data flow.*
