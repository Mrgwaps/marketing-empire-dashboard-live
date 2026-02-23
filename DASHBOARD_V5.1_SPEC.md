# Dashboard v5.1 Implementation Guide

## Overview
Restore v4.2 layout with ALL original features + add Social Media tracking sections.

## Changes Required

### 1. Main Dashboard (`app/page.js`)

#### A. Add Imports
After existing lucide-react imports, add:
```javascript
import { Facebook, Twitter, Linkedin, Instagram, Share2 } from 'lucide-react';
```

#### B. Add Social Data State
After existing useState declarations:
```javascript
const [socialData, setSocialData] = useState({
  totalFollowers: 0,
  postsPublished: 0,
  avgEngagement: 0,
  leadMagnets: 0,
  trafficToSite: 0,
  emailSignups: 0,
  revenue: 0,
  platforms: [
    { name: 'Facebook', followers: 0, posts: 0, engagement: 0, clicks: 0 },
    { name: 'Twitter', followers: 0, posts: 0, engagement: 0, clicks: 0 },
    { name: 'LinkedIn', followers: 0, posts: 0, engagement: 0, clicks: 0 },
    { name: 'Instagram', followers: 0, posts: 0, engagement: 0, clicks: 0 },
    { name: 'Reddit', followers: 0, posts: 0, engagement: 0, clicks: 0 }
  ]
});
```

#### C. Add Social Data Fetch Function
Add this to `fetchAirtableData()` function:
```javascript
const socialRes = await fetch('/api/airtable?tableId=tblcyuxtdueFDnSjJ');
const socialDataRaw = await socialRes.json();

// Calculate aggregated metrics
const records = socialDataRaw.records || [];
const platformStats = {};

records.forEach(record => {
  const platform = record.fields?.Platform;
  if (!platform) return;
  
  if (!platformStats[platform]) {
    platformStats[platform] = {
      name: platform,
      followers: 0,
      posts: 0,
      engagement: 0,
      clicks: 0,
      count: 0
    };
  }
  
  platformStats[platform].followers = Math.max(platformStats[platform].followers, record.fields?.Followers || 0);
  platformStats[platform].posts += record.fields?.Posts || 0;
  platformStats[platform].clicks += record.fields?.Clicks || 0;
  platformStats[platform].engagement += record.fields?.['Engagement Score'] || 0;
  platformStats[platform].count += 1;
});

// Calculate averages and totals
const platforms = Object.values(platformStats).map(p => ({
  ...p,
  engagement: p.count > 0 ? (p.engagement / p.count * 100).toFixed(1) : 0
}));

const totalFollowers = platforms.reduce((sum, p) => sum + p.followers, 0);
const totalPosts = platforms.reduce((sum, p) => sum + p.posts, 0);
const avgEngagement = platforms.length > 0 
  ? (platforms.reduce((sum, p) => sum + parseFloat(p.engagement), 0) / platforms.length).toFixed(1)
  : 0;

const leadMagnets = records.reduce((sum, r) => sum + (r.fields?.['Lead Magnets Distributed'] || 0), 0);
const trafficToSite = records.reduce((sum, r) => sum + (r.fields?.['Traffic to Site'] || 0), 0);
const socialEmailSignups = records.reduce((sum, r) => sum + (r.fields?.['Email Signups'] || 0), 0);
const socialRevenue = records.reduce((sum, r) => sum + (r.fields?.Revenue || 0), 0);

setSocialData({
  totalFollowers,
  postsPublished: totalPosts,
  avgEngagement,
  leadMagnets,
  trafficToSite,
  emailSignups: socialEmailSignups,
  revenue: socialRevenue,
  platforms
});
```

#### D. Add UI Sections
Insert BEFORE the "Recent Activity" section (around line 15662):

```jsx
{/* Social Media Traffic Overview */}
<div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 col-span-2">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-white font-semibold flex items-center gap-2">
      <Share2 size={18} className="text-purple-400" />
      Social Media Overview
    </h3>
  </div>
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
    <div className="text-center">
      <div className="text-2xl font-bold text-purple-400">{socialData.totalFollowers.toLocaleString()}</div>
      <div className="text-xs text-white/60 mt-1">Followers</div>
    </div>
    <div className="text-center">
      <div className="text-2xl font-bold text-blue-400">{socialData.postsPublished}</div>
      <div className="text-xs text-white/60 mt-1">Posts</div>
    </div>
    <div className="text-center">
      <div className="text-2xl font-bold text-green-400">{socialData.avgEngagement}%</div>
      <div className="text-xs text-white/60 mt-1">Engagement</div>
    </div>
    <div className="text-center">
      <div className="text-2xl font-bold text-yellow-400">{socialData.leadMagnets}</div>
      <div className="text-xs text-white/60 mt-1">Leads</div>
    </div>
    <div className="text-center">
      <div className="text-2xl font-bold text-pink-400">{socialData.trafficToSite.toLocaleString()}</div>
      <div className="text-xs text-white/60 mt-1">Traffic</div>
    </div>
    <div className="text-center">
      <div className="text-2xl font-bold text-indigo-400">{socialData.emailSignups}</div>
      <div className="text-xs text-white/60 mt-1">Signups</div>
    </div>
    <div className="text-center">
      <div className="text-2xl font-bold text-emerald-400">${socialData.revenue.toFixed(2)}</div>
      <div className="text-xs text-white/60 mt-1">Revenue</div>
    </div>
  </div>
</div>

{/* Platform Performance Cards */}
<div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 col-span-2">
  <h3 className="text-white font-semibold mb-4">Platform Performance</h3>
  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
    {socialData.platforms.map((platform) => (
      <div key={platform.name} className="bg-white/5 p-3 rounded-lg border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium text-sm">{platform.name}</span>
          {platform.name === 'Facebook' && <Facebook size={14} className="text-blue-500" />}
          {platform.name === 'Twitter' && <Twitter size={14} className="text-sky-400" />}
          {platform.name === 'LinkedIn' && <Linkedin size={14} className="text-blue-600" />}
          {platform.name === 'Instagram' && <Instagram size={14} className="text-pink-500" />}
          {platform.name === 'Reddit' && <MessageSquare size={14} className="text-orange-500" />}
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-white/50">Followers</span>
            <span className="text-white font-semibold">{platform.followers.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Posts</span>
            <span className="text-white font-semibold">{platform.posts}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Engagement</span>
            <span className="text-white font-semibold">{platform.engagement}%</span>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
```

### 2. Agents Page (`app/agents/page.js`)

#### Update Agent Avatars to Realistic Humans
Replace the DiceBear avatar URLs with realistic Unsplash professional headshots:

```javascript
const agents = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Content Strategist",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    // ... rest of config
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "SEO Specialist",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    // ... rest of config
  },
  {
    id: 3,
    name: "Emily Thompson",
    role: "Social Media Manager",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    // ... rest of config
  },
  {
    id: 4,
    name: "David Park",
    role: "Email Marketing Lead",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    // ... rest of config
  },
  {
    id: 5,
    name: "Aisha Patel",
    role: "Analytics Expert",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
    // ... rest of config
  },
  {
    id: 6,
    name: "James Wilson",
    role: "Conversion Optimizer",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
    // ... rest of config
  },
  {
    id: 7,
    name: "Luna Martinez",
    role: "AI Automation Lead",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop",
    // ... rest of config
  }
];
```

## Testing Checklist

- [ ] Main dashboard loads with v4.2 sidebar
- [ ] All original metrics visible (Email Signups, Revenue, Comments, Products)
- [ ] New "Social Media Overview" card shows 7 metrics
- [ ] New "Platform Performance" section shows 5 platform cards
- [ ] Social data fetches from Airtable (tblcyuxtdueFDnSjJ)
- [ ] Agents page shows 7 realistic human avatars
- [ ] Settings, automation queue, and all v4.2 features intact
- [ ] Theme switcher works (if present in v4.2)
- [ ] Login system still functional

## Deployment

1. Apply all changes above to v4.2 codebase
2. Test locally: `npm run dev`
3. Commit with message: "Deploy v5.1: v4.2 Layout + Social Media Tracking + Realistic Agent Avatars"
4. Push to main branch
5. Verify Vercel auto-deploys
6. Hard refresh browser to see changes

---

**Version**: 5.1  
**Base**: v4.2 (commit c683fae)  
**Additions**: Social Media Overview + Platform Performance + Realistic Avatars  
**Preserves**: ALL v4.2 features (sidebar, settings, agents link, metrics, login)