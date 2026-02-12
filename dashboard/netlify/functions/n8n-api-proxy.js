const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    const n8nBaseUrl = process.env.N8N_BASE_URL || 'https://sai.workflowshub.cloud';
    const n8nApiKey = process.env.N8N_API_KEY;

    // Extract the path after /n8n-api/
    // Example: /.netlify/functions/n8n-api-proxy/workflows/123 -> /api/v1/workflows/123
    const path = event.path.replace('/.netlify/functions/n8n-api-proxy', '') || '/';
    const targetUrl = `${n8nBaseUrl}/api/v1${path}${event.rawQuery ? '?' + event.rawQuery : ''}`;

    console.log(`Proxying request to: ${targetUrl}`);

    try {
        const response = await fetch(targetUrl, {
            method: event.httpMethod,
            headers: {
                'X-N8N-API-KEY': n8nApiKey,
                'Content-Type': 'application/json'
            },
            body: event.httpMethod !== 'GET' ? event.body : undefined
        });

        const data = await response.text();

        return {
            statusCode: response.status,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, X-N8N-API-KEY'
            },
            body: data
        };
    } catch (error) {
        console.error('Proxy Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to proxy request to n8n' })
        };
    }
};
