
"use client";

import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Settings, TrendingUp, Mail, DollarSign, Activity, Brain, Upload, Save, Bell, Lock, Palette, Database, LogOut, MessageSquare, Play, Pause, ChevronRight , Share2, Facebook, Twitter, Linkedin, Instagram} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showBrainUpload, setShowBrainUpload] = useState(false);
  const [airtableData, setAirtableData] = useState({
    emailSignups: 0,
    totalRevenue: 0,
    comments: 0,
    activeProducts: 5
  });
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


  // 7-Agent Team with Cultural Diversity
  const agents = [
    {
      id: 1,
      name: 'Sophia Chen',
      role: 'Content Strategist',
      ethnicity: 'Asian-American',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=faces',
      status: 'active',
      tasks: ['Reddit Content Calendar', 'Email Sequence Optimization', 'Trend Analysis']
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      role: 'Data Analyst',
      ethnicity: 'African-American',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces',
      status: 'active',
      tasks: ['Analytics Dashboard', 'Performance Metrics', 'ROI Tracking']
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      role: 'Community Manager',
      ethnicity: 'Latina',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=faces',
      status: 'active',
      tasks: ['Engagement Tracking', 'Comment Moderation', 'Community Growth']
    },
    {
      id: 4,
      name: 'Aisha Patel',
      role: 'Email Marketing Specialist',
      ethnicity: 'South Asian',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces',
      status: 'active',
      tasks: ['Brevo Automation', 'Email Sequences', 'Subscriber Segmentation']
    },
    {
      id: 5,
      name: 'David Kim',
      role: 'SEO Specialist',
      ethnicity: 'Korean-American',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces',
      status: 'idle',
      tasks: ['Keyword Research', 'Content Optimization', 'Link Building']
    },
    {
      id: 6,
      name: "Sarah O'Connor",
      role: 'Conversion Optimizer',
      ethnicity: 'Irish-American',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=faces',
      status: 'active',
      tasks: ['A/B Testing', 'Landing Page Optimization', 'Funnel Analysis']
    },
    {
      id: 7,
      name: 'James Williams',
      role: 'Product Research Lead',
      ethnicity: 'British',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=faces',
      status: 'active',
      tasks: ['Amazon Product Research', 'Competitor Analysis', 'Trend Forecasting']
    }
  ];

  useEffect(() => {
    // SSR guard - only run on client
    if (typeof window === 'undefined') return;

    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchAirtableData();
      const interval = setInterval(fetchAirtableData, 60000);
      return () => clearInterval(interval);
    }
  }, []);

  const fetchAirtableData = async () => {
    try {
      const emailRes = await fetch('/api/airtable?tableId=tblkXDs74AhSD4N4T');
      const productRes = await fetch('/api/airtable?tableId=tblshfGxKJYZEWyU6');
      const redditRes = await fetch('/api/airtable?tableId=tblqPB4YFfZxG2F4E');

      const emailData = await emailRes.json();
      const productData = await productRes.json();
      const redditData = await redditRes.json();

      setAirtableData({
        emailSignups: emailData.records?.[0]?.fields?.['Email Signups'] || 0,
        totalRevenue: productData.records?.reduce((sum, r) => sum + (r.fields?.Revenue || 0), 0) || 0,
        comments: redditData.records?.[0]?.fields?.['Comments Posted'] || 0,
        activeProducts: productData.records?.length || 0
      });

      // Fetch social media data
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
        engagement: p.count > 0 ? parseFloat((p.engagement / p.count * 100).toFixed(1)) : 0
      }));

      const totalFollowers = platforms.reduce((sum, p) => sum + p.followers, 0);
      const totalPosts = platforms.reduce((sum, p) => sum + p.posts, 0);
      const avgEngagement = platforms.length > 0 
        ? parseFloat((platforms.reduce((sum, p) => sum + parseFloat(p.engagement), 0) / platforms.length).toFixed(1))
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

    } catch (error) {
      console.error('Airtable fetch error:', error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'cptdigitals@gmail.com' && password === 'admin456!') {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      fetchAirtableData();
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    setCurrentPage('dashboard');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">Marketing Empire</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400" />
            <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  const chartData = [
    { name: 'Week 1', revenue: 0, signups: 0 },
    { name: 'Week 2', revenue: 0, signups: 0 },
    { name: 'Week 3', revenue: 0, signups: 0 },
    { name: 'Week 4', revenue: 0, signups: airtableData.emailSignups }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex">
      {/* Compact Sidebar */}
      <div className="w-16 bg-black/30 backdrop-blur-sm border-r border-white/10 flex flex-col items-center py-4 gap-2">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
          <span className="text-white font-bold text-lg">ME</span>
        </div>

        <button onClick={() => setCurrentPage('dashboard')} className={`p-2 rounded-lg transition ${currentPage === 'dashboard' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}>
          <LayoutDashboard size={20} />
        </button>
        <button onClick={() => setCurrentPage('agents')} className={`p-2 rounded-lg transition ${currentPage === 'agents' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}>
          <Users size={20} />
        </button>
        <button onClick={() => setCurrentPage('settings')} className={`p-2 rounded-lg transition ${currentPage === 'settings' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}>
          <Settings size={20} />
        </button>

        <div className="mt-auto">
          <button onClick={handleLogout} className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-4 flex justify-between items-center border border-white/20">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {currentPage === 'dashboard' && 'Dashboard Overview'}
              {currentPage === 'agents' && 'AI Agent Team'}
              {currentPage === 'settings' && 'Settings & Configuration'}
            </h1>
            <p className="text-white/60 text-sm">Marketing Empire Command Center</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-white/60">Logged in as</p>
              <p className="text-sm text-white font-medium">cptdigitals@gmail.com</p>
            </div>
          </div>
        </div>

        {/* DASHBOARD PAGE */}
        {currentPage === 'dashboard' && (
          <div className="space-y-3">
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm p-3 rounded-lg border border-blue-400/30">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="text-blue-300" size={18} />
                  <span className="text-white/80 text-xs">Email Subscribers</span>
                </div>
                <p className="text-white text-xl font-bold">{airtableData.emailSignups}</p>
                <p className="text-blue-200 text-xs">Next: 10 subscribers</p>
              </div>

              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm p-3 rounded-lg border border-green-400/30">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="text-green-300" size={18} />
                  <span className="text-white/80 text-xs">Total Revenue</span>
                </div>
                <p className="text-white text-xl font-bold">${airtableData.totalRevenue.toFixed(2)}</p>
                <p className="text-green-200 text-xs">Next: $1.00</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm p-3 rounded-lg border border-purple-400/30">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="text-purple-300" size={18} />
                  <span className="text-white/80 text-xs">Reddit Comments</span>
                </div>
                <p className="text-white text-xl font-bold">{airtableData.comments}</p>
                <p className="text-purple-200 text-xs">Automated engagement</p>
              </div>

              <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-sm p-3 rounded-lg border border-pink-400/30">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="text-pink-300" size={18} />
                  <span className="text-white/80 text-xs">Active Products</span>
                </div>
                <p className="text-white text-xl font-bold">{airtableData.activeProducts}</p>
                <p className="text-pink-200 text-xs">Luxury beauty dupes</p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                <h3 className="text-white font-semibold mb-3 text-sm">Revenue Growth</h3>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="name" stroke="#ffffff60" style={{fontSize: '11px'}} />
                    <YAxis stroke="#ffffff60" style={{fontSize: '11px'}} />
                    <Tooltip contentStyle={{background: '#1a1a2e', border: 'none', borderRadius: '8px'}} />
                    <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                <h3 className="text-white font-semibold mb-3 text-sm">Email Signups</h3>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="name" stroke="#ffffff60" style={{fontSize: '11px'}} />
                    <YAxis stroke="#ffffff60" style={{fontSize: '11px'}} />
                    <Tooltip contentStyle={{background: '#1a1a2e', border: 'none', borderRadius: '8px'}} />
                    <Bar dataKey="signups" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Activity Feed */}
            
            {/* Social Media Traffic Overview */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
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
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
              <h3 className="text-white font-semibold mb-4">Platform Performance</h3>

              {/* Platform Health Status */}
              <div className="mb-6">
                <h4 className="text-white/80 font-medium mb-3 flex items-center gap-2">
                  <Activity size={16} className="text-green-400" />
                  Platform Health
                </h4>
                <div className="grid grid-cols-5 gap-3">
                  <div className="bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Facebook size={16} className="text-blue-400" />
                      <p className="text-white/70 text-sm font-medium">Facebook</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <p className="text-green-400 text-xs">Active</p>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Twitter size={16} className="text-sky-400" />
                      <p className="text-white/70 text-sm font-medium">Twitter/X</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <p className="text-green-400 text-xs">Active</p>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Linkedin size={16} className="text-blue-600" />
                      <p className="text-white/70 text-sm font-medium">LinkedIn</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <p className="text-green-400 text-xs">Active</p>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Instagram size={16} className="text-pink-400" />
                      <p className="text-white/70 text-sm font-medium">Instagram</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <p className="text-yellow-400 text-xs">Pending</p>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Share2 size={16} className="text-orange-400" />
                      <p className="text-white/70 text-sm font-medium">Reddit</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <p className="text-green-400 text-xs">Active</p>
                    </div>
                  </div>
                </div>
              </div>

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

            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <h3 className="text-white font-semibold mb-3 text-sm flex items-center gap-2">
                <Activity size={16} />
                Recent Activity
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                <div className="text-xs text-white/70 bg-white/5 p-2 rounded">
                  <span className="text-green-400">●</span> Milestone check completed - No new milestones
                </div>
                <div className="text-xs text-white/70 bg-white/5 p-2 rounded">
                  <span className="text-blue-400">●</span> Dashboard v4.1 deployed successfully
                </div>
                <div className="text-xs text-white/70 bg-white/5 p-2 rounded">
                  <span className="text-purple-400">●</span> Airtable integration active
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AGENTS PAGE */}
        {currentPage === 'agents' && !selectedAgent && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {agents.map((agent) => (
                <div key={agent.id} onClick={() => setSelectedAgent(agent)}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:border-white/40 transition cursor-pointer group">
                  <div className="flex items-start gap-3 mb-3">
                    <img src={agent.avatar} alt={agent.name} className="w-16 h-16 rounded-full border-2 border-white/30" />
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{agent.name}</h3>
                      <p className="text-purple-300 text-xs">{agent.role}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                        <span className="text-white/60 text-xs capitalize">{agent.status}</span>
                      </div>
                    </div>
                    <ChevronRight className="text-white/40 group-hover:text-white/80 transition" size={20} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-black/20 p-2 rounded">
                      <p className="text-white/60 text-xs">Tasks</p>
                      <p className="text-white font-semibold">{agent.completedTasks}/{agent.totalTasks}</p>
                    </div>
                    <div className="bg-black/20 p-2 rounded">
                      <p className="text-white/60 text-xs">Memory</p>
                      <p className="text-white font-semibold">{agent.memory} GB</p>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="w-full bg-black/30 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" 
                        style={{width: `${(agent.completedTasks / agent.totalTasks) * 100}%`}}></div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {agent.skills.slice(0, 2).map((skill, idx) => (
                      <span key={idx} className="text-xs bg-purple-500/30 text-purple-200 px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                    {agent.skills.length > 2 && (
                      <span className="text-xs bg-white/10 text-white/60 px-2 py-1 rounded">
                        +{agent.skills.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AGENT PROFILE PAGE */}
        {currentPage === 'agents' && selectedAgent && (
          <div className="space-y-4">
            <button onClick={() => setSelectedAgent(null)} 
              className="text-white/60 hover:text-white flex items-center gap-2 text-sm mb-2">
              ← Back to Team
            </button>

            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="flex items-start gap-6 mb-6">
                <img src={selectedAgent.avatar} alt={selectedAgent.name} className="w-24 h-24 rounded-full border-4 border-white/30" />
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-1">{selectedAgent.name}</h2>
                  <p className="text-purple-300 text-lg mb-2">{selectedAgent.role}</p>
                  <p className="text-white/70 text-sm mb-3">{selectedAgent.description}</p>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedAgent.status === 'active' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-gray-500/20 text-gray-300'}`}>
                      {selectedAgent.status === 'active' ? '🟢 Active' : '⚫ Offline'}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {selectedAgent.ethnicity}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <button onClick={() => setShowBrainUpload(!showBrainUpload)}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:from-pink-600 hover:to-purple-700 transition">
                    <Brain size={18} />
                    Agent Brain
                  </button>
                </div>
              </div>

              {/* Agent Brain Upload Section */}
              {showBrainUpload && (
                <div className="bg-black/30 p-4 rounded-lg mb-6 border border-purple-500/30">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Brain size={18} className="text-purple-400" />
                    Upload Knowledge to Agent Brain (RAG)
                  </h3>
                  <p className="text-white/60 text-sm mb-4">
                    Upload documents, videos, or text files to enhance {selectedAgent.name}'s knowledge base and capabilities.
                  </p>
                  <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-purple-500/50 transition cursor-pointer">
                    <Upload className="mx-auto mb-2 text-white/60" size={32} />
                    <p className="text-white/80 mb-1">Drop files here or click to upload</p>
                    <p className="text-white/50 text-xs">Supports: PDF, TXT, DOCX, MP4, MP3 (Max 50MB)</p>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-white/80 text-sm font-medium mb-2">Current Knowledge Base:</h4>
                    <div className="space-y-2">
                      <div className="bg-white/5 p-2 rounded flex items-center justify-between">
                        <span className="text-white/70 text-sm">📄 Marketing Strategy Guide.pdf</span>
                        <span className="text-white/50 text-xs">2.3 MB</span>
                      </div>
                      <div className="bg-white/5 p-2 rounded flex items-center justify-between">
                        <span className="text-white/70 text-sm">📊 Product Analysis Dataset.csv</span>
                        <span className="text-white/50 text-xs">1.8 MB</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-black/20 p-4 rounded-lg">
                  <p className="text-white/60 text-sm mb-1">Completed Tasks</p>
                  <p className="text-white text-2xl font-bold">{selectedAgent.completedTasks}</p>
                </div>
                <div className="bg-black/20 p-4 rounded-lg">
                  <p className="text-white/60 text-sm mb-1">Total Tasks</p>
                  <p className="text-white text-2xl font-bold">{selectedAgent.totalTasks}</p>
                </div>
                <div className="bg-black/20 p-4 rounded-lg">
                  <p className="text-white/60 text-sm mb-1">Memory Used</p>
                  <p className="text-white text-2xl font-bold">{selectedAgent.memory} GB</p>
                </div>
                <div className="bg-black/20 p-4 rounded-lg">
                  <p className="text-white/60 text-sm mb-1">Cost/Day</p>
                  <p className="text-white text-2xl font-bold">${selectedAgent.cost}</p>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3">Core Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedAgent.skills.map((skill, idx) => (
                    <span key={idx} className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white px-4 py-2 rounded-lg border border-purple-400/30">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Current Tasks */}
              <div>
                <h3 className="text-white font-semibold mb-3">Current Tasks</h3>
                <div className="space-y-2">
                  {selectedAgent.tasks.map((task, idx) => (
                    <div key={idx} className="bg-black/20 p-3 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        <span className="text-white">{task}</span>
                      </div>
                      <span className="text-white/60 text-sm">In Progress</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS PAGE */}
        {currentPage === 'settings' && (
          <div className="space-y-4">
            {/* Account Settings */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <Lock size={20} className="text-purple-400" />
                Account Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-white/80 text-sm mb-2 block">Email Address</label>
                  <input type="email" defaultValue="cptdigitals@gmail.com" 
                    className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="text-white/80 text-sm mb-2 block">Current Password</label>
                  <input type="password" placeholder="Enter current password"
                    className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="text-white/80 text-sm mb-2 block">New Password</label>
                  <input type="password" placeholder="Enter new password"
                    className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:from-pink-600 hover:to-purple-700 transition">
                  <Save size={18} />
                  Save Account Settings
                </button>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <Bell size={20} className="text-blue-400" />
                Notification Preferences
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Email Notifications</p>
                    <p className="text-white/60 text-sm">Receive updates about campaigns and milestones</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Milestone Alerts</p>
                    <p className="text-white/60 text-sm">Get notified when revenue or subscriber milestones are reached</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Agent Activity Reports</p>
                    <p className="text-white/60 text-sm">Daily summary of AI agent tasks and performance</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
                <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:from-pink-600 hover:to-purple-700 transition">
                  <Save size={18} />
                  Save Notification Settings
                </button>
              </div>
            </div>

            {/* Integration Settings */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <Database size={20} className="text-green-400" />
                Integration Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-white/80 text-sm mb-2 block">Airtable Base ID</label>
                  <input type="text" defaultValue="appl6ToZSGjS6wU0K" 
                    className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="text-white/80 text-sm mb-2 block">Amazon Affiliate Tag</label>
                  <input type="text" defaultValue="megonlpro-20" 
                    className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="text-white/80 text-sm mb-2 block">Reddit Username</label>
                  <input type="text" defaultValue="u/CaptainDigitals" 
                    className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="text-white/80 text-sm mb-2 block">Data Refresh Interval (seconds)</label>
                  <select className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="30">30 seconds</option>
                    <option value="60" selected>60 seconds</option>
                    <option value="120">2 minutes</option>
                    <option value="300">5 minutes</option>
                  </select>
                </div>
                <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:from-pink-600 hover:to-purple-700 transition">
                  <Save size={18} />
                  Save Integration Settings
                </button>
              </div>
            </div>

            {/* Automation Settings */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <Activity size={20} className="text-yellow-400" />
                Automation Controls
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Reddit Comment System</p>
                    <p className="text-white/60 text-sm">Automated commenting on relevant posts (4x/day)</p>
                  </div>
                  <button className="bg-green-500 px-4 py-2 rounded-lg text-white flex items-center gap-2">
                    <Play size={16} />
                    Active
                  </button>
                </div>
                <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Email Automation (Brevo)</p>
                    <p className="text-white/60 text-sm">Welcome sequence and nurture campaigns</p>
                  </div>
                  <button className="bg-green-500 px-4 py-2 rounded-lg text-white flex items-center gap-2">
                    <Play size={16} />
                    Active
                  </button>
                </div>
                <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Multi-Platform Q&A</p>
                    <p className="text-white/60 text-sm">Hyperbrowser engagement across platforms (3x/day)</p>
                  </div>
                  <button className="bg-red-500 px-4 py-2 rounded-lg text-white flex items-center gap-2">
                    <Pause size={16} />
                    Paused
                  </button>
                </div>
                <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Milestone Monitoring</p>
                    <p className="text-white/60 text-sm">Track revenue and subscriber milestones (every 30 min)</p>
                  </div>
                  <button className="bg-green-500 px-4 py-2 rounded-lg text-white flex items-center gap-2">
                    <Play size={16} />
                    Active
                  </button>
                </div>
              </div>
            </div>

            {/* Theme Settings */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <Palette size={20} className="text-pink-400" />
                Theme & Appearance
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => setAccentColor('purple')} className={`bg-gradient-to-br from-purple-900 to-pink-800 p-4 rounded-lg border-2 ${accentColor === 'purple' ? 'border-white/40' : 'border-white/20'} cursor-pointer hover:border-white/40 transition-all`}>
                  <p className="text-white font-medium text-center">Purple Dream {accentColor === 'purple' && '(Active)'}</p>
                </button>
                <button onClick={() => setAccentColor('blue')} className={`bg-gradient-to-br from-blue-900 to-cyan-800 p-4 rounded-lg border-2 ${accentColor === 'blue' ? 'border-white/40' : 'border-white/20'} cursor-pointer hover:border-white/40 transition-all`}>
                  <p className="text-white font-medium text-center">Ocean Blue {accentColor === 'blue' && '(Active)'}</p>
                </button>
                <button onClick={() => setAccentColor('green')} className={`bg-gradient-to-br from-green-900 to-emerald-800 p-4 rounded-lg border-2 ${accentColor === 'green' ? 'border-white/40' : 'border-white/20'} cursor-pointer hover:border-white/40 transition-all`}>
                  <p className="text-white font-medium text-center">Forest Green {accentColor === 'green' && '(Active)'}</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
