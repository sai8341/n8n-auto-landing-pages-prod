const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://localhost:5678';
const N8N_API_KEY = process.env.N8N_API_KEY;

if (!N8N_API_KEY) {
    console.error('Error: N8N_API_KEY is not defined in .env');
    process.exit(1);
}

app.use(cors());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'n8n-api-proxy' });
});

// Proxy n8n API requests
app.use('/n8n-api', createProxyMiddleware({
    target: `${N8N_BASE_URL}/api/v1`,
    changeOrigin: true,
    pathRewrite: {
        '^/n8n-api': '', // Remove /n8n-api prefix
    },
    on: {
        proxyReq: (proxyReq, req, res) => {
            // Inject API Key
            proxyReq.setHeader('X-N8N-API-KEY', N8N_API_KEY);

            // Log the proxied URL for debugging
            console.log(`[Proxy] ${req.method} ${req.originalUrl} -> ${proxyReq.path}`);
        },
        error: (err, req, res) => {
            console.error('Proxy Error:', err);
            res.status(500).json({ error: 'Proxy communication failed' });
        }
    }
}));

app.listen(PORT, () => {
    console.log(`n8n Security Proxy running on port ${PORT}`);
});
