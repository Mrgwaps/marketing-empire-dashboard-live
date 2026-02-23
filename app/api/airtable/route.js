export async function GET(request) {
  try {
    const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
    const BASE_ID = 'appl6ToZSGjS6wU0K';

    if (!AIRTABLE_TOKEN) {
      return Response.json({ error: 'Missing Airtable token' }, { status: 500 });
    }

    // Fetch Email Metrics
    const emailResponse = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/tblkXDs74AhSD4N4T`,
      {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const emailData = await emailResponse.json();
    const subscribers = emailData.records?.[0]?.fields?.['Email Signups'] || 0;

    // Fetch Product Performance
    const productResponse = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/tblshfGxKJYZEWyU6`,
      {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const productData = await productResponse.json();
    let revenue = 0;
    let conversions = 0;

    if (productData.records) {
      productData.records.forEach(record => {
        revenue += parseFloat(record.fields?.Revenue || 0);
        conversions += parseInt(record.fields?.Conversions || 0);
      });
    }

    // Fetch Reddit Performance
    const redditResponse = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/tblqPB4YFfZxG2F4E`,
      {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const redditData = await redditResponse.json();
    const commentsPosted = redditData.records?.[0]?.fields?.['Comments Posted'] || 0;

    return Response.json({
      revenue,
      subscribers,
      conversions,
      engagement: commentsPosted > 0 ? 75 : 0, // Mock engagement rate
      systemHealth: {
        airtable: 'active',
        reddit: commentsPosted > 0 ? 'active' : 'inactive',
        email: subscribers > 0 ? 'active' : 'inactive',
        craigslist: 'active'
      }
    });

  } catch (error) {
    console.error('Airtable API Error:', error);
    return Response.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
