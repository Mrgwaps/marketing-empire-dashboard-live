import { NextResponse } from 'next/server';

export async function GET(request) {
  const baseId = 'appl6ToZSGjS6wU0K';
  const token = process.env.AIRTABLE_TOKEN;

  if (!token) {
    return NextResponse.json({ error: 'Airtable token not configured' }, { status: 500 });
  }

  try {
    // Fetch Email Metrics
    const emailMetricsResponse = await fetch(
      `https://api.airtable.com/v0/${baseId}/tblkXDs74AhSD4N4T`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Fetch Product Performance
    const productResponse = await fetch(
      `https://api.airtable.com/v0/${baseId}/tblshfGxKJYZEWyU6`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Fetch Reddit Performance
    const redditResponse = await fetch(
      `https://api.airtable.com/v0/${baseId}/tblqPB4YFfZxG2F4E`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!emailMetricsResponse.ok || !productResponse.ok || !redditResponse.ok) {
      throw new Error('Failed to fetch from Airtable');
    }

    const emailData = await emailMetricsResponse.json();
    const productData = await productResponse.json();
    const redditData = await redditResponse.json();

    // Calculate totals
    const totalSubscribers = emailData.records.reduce((sum, record) => {
      return sum + (record.fields['Email Signups'] || 0);
    }, 0);

    const totalRevenue = productData.records.reduce((sum, record) => {
      return sum + (record.fields['Revenue'] || 0);
    }, 0);

    const totalConversions = productData.records.reduce((sum, record) => {
      return sum + (record.fields['Conversions'] || 0);
    }, 0);

    const totalClicks = productData.records.reduce((sum, record) => {
      return sum + (record.fields['Clicks'] || 0);
    }, 0);

    const totalComments = redditData.records.reduce((sum, record) => {
      return sum + (record.fields['Comments Posted'] || 0);
    }, 0);

    // Calculate engagement rate
    const engagementRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : 0;

    // Build weekly chart data (mock for now, will implement historical tracking later)
    const chartData = [
      { name: 'Mon', revenue: totalRevenue * 0.1, subscribers: Math.floor(totalSubscribers * 0.1), clicks: Math.floor(totalClicks * 0.1) },
      { name: 'Tue', revenue: totalRevenue * 0.15, subscribers: Math.floor(totalSubscribers * 0.15), clicks: Math.floor(totalClicks * 0.15) },
      { name: 'Wed', revenue: totalRevenue * 0.12, subscribers: Math.floor(totalSubscribers * 0.12), clicks: Math.floor(totalClicks * 0.12) },
      { name: 'Thu', revenue: totalRevenue * 0.18, subscribers: Math.floor(totalSubscribers * 0.18), clicks: Math.floor(totalClicks * 0.18) },
      { name: 'Fri', revenue: totalRevenue * 0.2, subscribers: Math.floor(totalSubscribers * 0.2), clicks: Math.floor(totalClicks * 0.2) },
      { name: 'Sat', revenue: totalRevenue * 0.15, subscribers: Math.floor(totalSubscribers * 0.15), clicks: Math.floor(totalClicks * 0.15) },
      { name: 'Sun', revenue: totalRevenue * 0.1, subscribers: Math.floor(totalSubscribers * 0.1), clicks: Math.floor(totalClicks * 0.1) },
    ];

    // Recent activities from actual data
    const recentActivities = [];
    
    if (totalSubscribers > 0) {
      recentActivities.push({
        icon: 'Mail',
        title: `${totalSubscribers} email subscribers`,
        time: 'Updated now',
        status: 'success'
      });
    }

    if (totalComments > 0) {
      recentActivities.push({
        icon: 'MessageSquare',
        title: `${totalComments} Reddit comments posted`,
        time: 'Recent',
        status: 'success'
      });
    }

    if (totalRevenue > 0) {
      recentActivities.push({
        icon: 'DollarSign',
        title: `$${totalRevenue.toFixed(2)} revenue generated`,
        time: 'Recent',
        status: 'success'
      });
    }

    return NextResponse.json({
      revenue: totalRevenue,
      subscribers: totalSubscribers,
      conversions: totalConversions,
      engagement: parseFloat(engagementRate),
      chartData,
      recentActivities
    });
  } catch (error) {
    console.error('Airtable API error:', error);
    return NextResponse.json(
      { 
        revenue: 0,
        subscribers: 0,
        conversions: 0,
        engagement: 0,
        chartData: [],
        recentActivities: [],
        error: error.message 
      },
      { status: 500 }
    );
  }
}
