// api/airtable.js - Secure Vercel serverless function
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE_ID = 'appl6ToZSGjS6wU0K';

  if (!AIRTABLE_TOKEN) {
    return res.status(500).json({ error: 'Airtable token not configured' });
  }

  try {
    const { tableId, fields } = req.query;
    
    if (!tableId) {
      return res.status(400).json({ error: 'Missing tableId parameter' });
    }

    let airtableUrl = `https://api.airtable.com/v0/${BASE_ID}/${tableId}`;
    
    if (fields) {
      const fieldParams = fields.split(',').map(f => `fields[]=${encodeURIComponent(f)}`).join('&');
      airtableUrl += `?${fieldParams}`;
    }

    const response = await fetch(airtableUrl, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error || 'Airtable API error' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}