# Marketing Empire Dashboard v2.0

Modern React dashboard built with Next.js 14, Tailwind CSS, and integrated with Airtable for real-time marketing automation tracking.

## 🎨 Design

Inspired by [Blaxel AI Dashboard](https://dribbble.com/shots/26596950-Blaxel-AI-Agent-Dashboard-Redesign)

**Features:**
- ✨ Modern dark theme with purple/blue gradients
- 📊 Real-time Airtable data integration
- 📱 Fully responsive design
- 🎯 Card-based stat widgets
- 💫 Smooth animations and transitions
- 🔄 Auto-refresh every 60 seconds

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **UI:** React 18 + Tailwind CSS 3
- **Charts:** Chart.js + react-chartjs-2
- **Icons:** Lucide React
- **Backend:** Serverless API routes
- **Database:** Airtable

## 🚀 Local Development

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## 📦 Deployment

Automatically deploys to Vercel on push to main branch.

**Environment Variables:**
- \`AIRTABLE_TOKEN\` - Your Airtable API token

## 📁 Project Structure

\`\`\`
marketing-empire-dashboard/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   └── api/
│       └── airtable/
│           └── route.ts    # Airtable API endpoint
├── components/
│   └── Dashboard.tsx       # Main dashboard component
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── vercel.json
\`\`\`

## 🎯 Features

### Dashboard Overview
- **Revenue Tracking** - Real-time Amazon affiliate revenue
- **Email Subscribers** - Total email list size
- **Conversions** - Product conversion tracking
- **Engagement Rate** - Reddit automation metrics

### System Health Monitor
- Airtable sync status
- Reddit bot activity
- Email automation status
- Craigslist posting status

### Activity Feed
- Recent automation events
- Real-time updates
- Status indicators

## 🔧 Customization

Edit \`components/Dashboard.tsx\` to modify:
- Stat cards and metrics
- System health indicators
- Activity feed items
- Layout and styling

## 📝 License

MIT
