import fetch from 'node-fetch';

export const handler = async function (event, context) {
    const n8nBaseUrl = process.env.N8N_BASE_URL || 'https://sai.workflowshub.cloud';
    const n8nApiKey = process.env.N8N_API_KEY;

    if (!n8nApiKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'N8N_API_KEY is not configured in Netlify' })
        };
    }

    // Extract the actual API path
    // We need to remove both the Netlify function path AND the /n8n-api prefix
    let path = event.path
        .replace('/.netlify/functions/n8n-api-proxy', '')
        .replace('/n8n-api', '') || '/';

    // Construct the final target URL
    const targetUrl = `${n8nBaseUrl.replace(/\/$/, '')}/api/v1${path}${event.rawQuery ? '?' + event.rawQuery : ''}`;

    console.log(`Proxying request to: ${targetUrl}`);

    try {
        const response = await fetch(targetUrl, {
            method: event.httpMethod,
            headers: {
                'X-N8N-API-KEY': n8nApiKey,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: (event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD') ? event.body : undefined
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
            body: JSON.stringify({ error: 'Failed to proxy request to n8n', details: error.message })
        };
    }
};
