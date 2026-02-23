import { NextResponse } from 'next/server';

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const BASE_ID = 'appl6ToZSGjS6wU0K';

const TABLES = {
  emailSignups: 'tblkXDs74AhSD4N4T',
  productPerformance: 'tblshfGxKJYZEWyU6',
  redditComments: 'tblqPB4YFfZxG2F4E'
};

async function fetchAirtable(tableId) {
  const response = await fetch(
    `https://api.airtable.com/v0/${BASE_ID}/${tableId}`,
    {
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Airtable API error: ${response.status}`);
  }

  const data = await response.json();
  return data.records || [];
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tableId = searchParams.get('tableId');

    // Fetch all tables
    const [emailRecords, productRecords, redditRecords] = await Promise.all([
      fetchAirtable(TABLES.emailSignups),
      fetchAirtable(TABLES.productPerformance),
      fetchAirtable(TABLES.redditComments)
    ]);

    // Calculate metrics
    const emailSignups = emailRecords.reduce((sum, r) => sum + (r.fields['Email Signups'] || 0), 0);
    const totalRevenue = productRecords.reduce((sum, r) => sum + (r.fields.Revenue || 0), 0);
    const redditComments = redditRecords.reduce((sum, r) => sum + (r.fields['Comments Posted'] || 0), 0);

    const totalClicks = productRecords.reduce((sum, r) => sum + (r.fields.Clicks || 0), 0);
    const totalConversions = productRecords.reduce((sum, r) => sum + (r.fields.Conversions || 0), 0);
    const engagementRate = totalClicks > 0 ? Math.round((totalConversions / totalClicks) * 100) : 0;

    // Build real-time activity feed from Airtable
    const activities = [];

    // Email signups
    emailRecords.forEach(record => {
      const signups = record.fields['Email Signups'] || 0;
      const date = record.fields.Date || 'Unknown';
      if (signups > 0) {
        activities.push({
          message: `${signups} new email signup${signups > 1 ? 's' : ''} from ${record.fields.Source || 'Unknown'}`,
          time: new Date(date).toLocaleString(),
          type: 'email'
        });
      }
    });

    // Product activity
    productRecords.forEach(record => {
      const revenue = record.fields.Revenue || 0;
      const conversions = record.fields.Conversions || 0;
      if (conversions > 0) {
        activities.push({
          message: `${conversions} conversion${conversions > 1 ? 's' : ''} for ${record.fields['Product Name'] || 'Product'} ($${revenue.toFixed(2)})`,
          time: 'Recent',
          type: 'conversion'
        });
      }
    });

    // Reddit activity
    redditRecords.forEach(record => {
      const comments = record.fields['Comments Posted'] || 0;
      const date = record.fields.Date || 'Unknown';
      if (comments > 0) {
        activities.push({
          message: `Posted ${comments} comment${comments > 1 ? 's' : ''} in Reddit communities`,
          time: new Date(date).toLocaleString(),
          type: 'reddit'
        });
      }
    });

    // Sort by most recent and limit to 10
    const recentActivity = activities.slice(0, 10);

    // System health (simplified - can be expanded)
    const systemHealth = {
      status: 'operational',
      uptime: 99.9,
      lastCheck: new Date().toISOString()
    };

    return NextResponse.json({
      emailSignups,
      totalRevenue,
      redditComments,
      engagementRate,
      recentActivity,
      systemHealth,
      lastUpdate: new Date().toISOString()
    });

  } catch (error) {
    console.error('Airtable API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch data',
        emailSignups: 0,
        totalRevenue: 0,
        redditComments: 0,
        engagementRate: 0,
        recentActivity: [],
        systemHealth: { status: 'error', uptime: 0 }
      },
      { status: 500 }
    );
  }
}
