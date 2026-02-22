# 🚀 Marketing Empire Dashboard - Setup Instructions

## ✅ Deployment Complete!

Your dashboard is now live at:
**https://marketing-empire-dashboard-mrgwaps-projects.vercel.app**

Additional URLs:
- https://marketing-empire-dashboard-git-main-mrgwaps-projects.vercel.app
- https://marketing-empire-dashboard-is5b7gto1-mrgwaps-projects.vercel.app

---

## 🔑 Step 1: Get Your Airtable Personal Access Token

1. Go to https://airtable.com/create/tokens
2. Click **"Create new token"**
3. Give it a name: `Marketing Dashboard`
4. Add these scopes:
   - `data.records:read`
   - `schema.bases:read`
5. Add access to your base: `appl6ToZSGjS6wU0K`
6. Click **"Create token"** and copy it

---

## 🔧 Step 2: Update Dashboard with Your Token

### Option A: Direct Edit (Quick)

1. Go to: https://github.com/Mrgwaps/marketing-empire-dashboard-live/edit/main/index.html
2. Find line 265: `const AIRTABLE_TOKEN = 'YOUR_AIRTABLE_TOKEN';`
3. Replace `YOUR_AIRTABLE_TOKEN` with your actual token
4. Scroll down and click **"Commit changes"**
5. Vercel will auto-deploy in ~30 seconds

### Option B: Local Clone (Recommended)

```bash
# Clone repository
git clone https://github.com/Mrgwaps/marketing-empire-dashboard-live.git
cd marketing-empire-dashboard-live

# Edit index.html
# Replace 'YOUR_AIRTABLE_TOKEN' with your token (line 265)

# Commit and push
git add index.html
git commit -m "Add Airtable token"
git push origin main
```

---

## 📊 Dashboard Features

### Main Dashboard (index.html)
- **Live Metrics**: Email subscribers, revenue, clicks, Reddit comments
- **Scheduled Tasks**: Countdown timers for 4 automations
- **Product Chart**: Visual breakdown of product performance
- **System Logs**: Real-time monitoring of automation activity
- **Auto-Refresh**: Updates every 60 seconds

### AI Agent Team (agents.html)
- **5 AI Agents**: Sophia, Marcus, Isabella, Ava, Daniel
- **Agent Stats**: Performance metrics for each agent
- **Active Tasks**: Current assignments and status
- **Visual Design**: Professional cards with avatars

---

## 🎯 Airtable Tables Connected

| Table Name | Table ID | Fields Tracked |
|------------|----------|----------------|
| Email Metrics | tblkXDs74AhSD4N4T | Email Signups |
| Product Performance | tblshfGxKJYZEWyU6 | Product Name, Clicks, Revenue, Conversions |
| Reddit Performance | tblqPB4YFfZxG2F4E | Comments Posted |

---

## ⏰ Scheduled Automations Tracked

1. **Milestone Check** - Every 30 minutes
2. **Reddit Comment System** - 4x daily (8 AM, 12 PM, 4 PM, 8 PM PST)
3. **Hyperbrowser Multi-Platform** - 3x daily (10 AM, 2 PM, 6 PM PST)
4. **Craigslist Lead Generation** - Daily at 1 AM UTC

---

## 🔄 Auto-Deployment

Every time you push to GitHub, Vercel automatically:
1. Detects the change
2. Builds the new version
3. Deploys to production
4. Updates all URLs within 30 seconds

---

## 🐛 Troubleshooting

### Dashboard shows "Loading..." forever
- Check that you replaced `YOUR_AIRTABLE_TOKEN` with actual token
- Verify token has access to base `appl6ToZSGjS6wU0K`
- Check browser console (F12) for errors

### Data not updating
- Airtable API rate limit: 5 requests/second
- Dashboard refreshes every 60 seconds automatically
- Click **"Refresh"** button to force update

### Vercel deployment fails
- Check GitHub Actions tab for build errors
- Verify all HTML files are valid
- Check Vercel dashboard: https://vercel.com/mrgwaps-projects/marketing-empire-dashboard

---

## 📱 Mobile Responsive

The dashboard is fully responsive and works on:
- Desktop (1920×1080 and up)
- Laptop (1366×768)
- Tablet (768×1024)
- Mobile (375×667 and up)

---

## 🔗 Quick Links

- **Live Dashboard**: https://marketing-empire-dashboard-mrgwaps-projects.vercel.app
- **GitHub Repo**: https://github.com/Mrgwaps/marketing-empire-dashboard-live
- **Vercel Project**: https://vercel.com/mrgwaps-projects/marketing-empire-dashboard
- **Airtable Base**: https://airtable.com/appl6ToZSGjS6wU0K

---

## 🎨 Customization

### Change Colors
Edit the gradient in index.html (line ~15):
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Add More Metrics
1. Add new metric card in index.html (~line 155)
2. Fetch data in `loadDashboardData()` function
3. Update the metric value with `document.getElementById()`

### Modify Automation Schedule
Update countdown logic in `updateCountdowns()` function (~line 380)

---

## ✨ Next Steps

1. ✅ Get Airtable token
2. ✅ Update index.html with token
3. ✅ Verify data loads on dashboard
4. ✅ Share dashboard URL with team
5. ✅ Monitor automation performance

---

**Questions? Check the logs in the dashboard or browser console (F12)**