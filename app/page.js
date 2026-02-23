
"use client";
import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Mail, DollarSign, MessageCircle, Users, Calendar, Target, Zap, Globe, Twitter, Linkedin, Instagram, Facebook } from "lucide-react";

export default function Dashboard() {
  const [activeTheme, setActiveTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("dashboardTheme") || "purpleDream";
    }
    return "purpleDream";
  });

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Theme configurations
  const themes = {
    purpleDream: {
      name: "Purple Dream",
      gradient: "from-purple-900 via-purple-800 to-indigo-900",
      cardBg: "bg-purple-800/30",
      accent: "text-purple-400",
      border: "border-purple-700"
    },
    oceanBlue: {
      name: "Ocean Blue",
      gradient: "from-blue-900 via-blue-800 to-cyan-900",
      cardBg: "bg-blue-800/30",
      accent: "text-blue-400",
      border: "border-blue-700"
    },
    darkMode: {
      name: "Dark Mode",
      gradient: "from-gray-900 via-gray-800 to-black",
      cardBg: "bg-gray-800/30",
      accent: "text-gray-400",
      border: "border-gray-700"
    }
  };

  const currentTheme = themes[activeTheme];

  // Human-like AI agent avatars (realistic professional headshots)
  const agents = [
    {
      id: 1,
      name: "Sophia Chen",
      role: "Content Strategist",
      ethnicity: "Asian-American",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
      progress: 87,
      tasks: 12,
      skills: ["SEO", "Copywriting", "Analytics"],
      memory: "2.3 GB",
      cost: "$0.45/day"
    },
    {
      id: 2,
      name: "Marcus Johnson",
      role: "Data Analyst",
      ethnicity: "African-American",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
      progress: 92,
      tasks: 8,
      skills: ["Python", "Airtable", "Visualization"],
      memory: "1.8 GB",
      cost: "$0.38/day"
    },
    {
      id: 3,
      name: "Isabella Rodriguez",
      role: "Email Automation",
      ethnicity: "Latina",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
      progress: 78,
      tasks: 15,
      skills: ["Brevo", "Automation", "A/B Testing"],
      memory: "1.5 GB",
      cost: "$0.32/day"
    },
    {
      id: 4,
      name: "Ava Williams",
      role: "Product Research",
      ethnicity: "African-American",
      avatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop",
      progress: 95,
      tasks: 6,
      skills: ["Amazon", "Market Research", "Trends"],
      memory: "2.1 GB",
      cost: "$0.42/day"
    },
    {
      id: 5,
      name: "Daniel Kim",
      role: "Automation Engineer",
      ethnicity: "Asian-American",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      progress: 88,
      tasks: 10,
      skills: ["Hyperbrowser", "APIs", "Integration"],
      memory: "3.2 GB",
      cost: "$0.58/day"
    },
    {
      id: 6,
      name: "Zara Patel",
      role: "Community Manager",
      ethnicity: "South Asian",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop",
      progress: 82,
      tasks: 14,
      skills: ["Social Media", "Engagement", "Content"],
      memory: "1.9 GB",
      cost: "$0.36/day"
    },
    {
      id: 7,
      name: "Jamal Washington",
      role: "Conversion Optimizer",
      ethnicity: "African-American",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
      progress: 90,
      tasks: 9,
      skills: ["CRO", "Testing", "Analytics"],
      memory: "2.4 GB",
      cost: "$0.48/day"
    }
  ];

  // Fetch data from Airtable
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [emailRes, productRes, redditRes, socialRes] = await Promise.all([
          fetch("/api/airtable?tableId=tblkXDs74AhSD4N4T"),
          fetch("/api/airtable?tableId=tblshfGxKJYZEWyU6"),
          fetch("/api/airtable?tableId=tblqPB4YFfZxG2F4E"),
          fetch("/api/airtable?tableId=tblcyuxtdueFDnSjJ")
        ]);

        const emailData = await emailRes.json();
        const productData = await productRes.json();
        const redditData = await redditRes.json();
        const socialData = await socialRes.json();

        setDashboardData({
          email: emailData.records || [],
          products: productData.records || [],
          reddit: redditData.records || [],
          social: socialData.records || []
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Save theme to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dashboardTheme", activeTheme);
    }
  }, [activeTheme]);

  // Calculate social media metrics
  const calculateSocialMetrics = () => {
    if (!dashboardData?.social) return null;

    const totalFollowers = dashboardData.social.reduce((sum, r) => 
      sum + (r.fields?.["Follower Count"] || 0), 0
    );
    const totalPosts = dashboardData.social.reduce((sum, r) => 
      sum + (r.fields?.["Posts Published"] || 0), 0
    );
    const totalEngagement = dashboardData.social.reduce((sum, r) => 
      sum + (r.fields?.["Engagement Score"] || 0), 0
    );
    const totalLeadMagnets = dashboardData.social.reduce((sum, r) => 
      sum + (r.fields?.["Lead Magnets Distributed"] || 0), 0
    );
    const totalTraffic = dashboardData.social.reduce((sum, r) => 
      sum + (r.fields?.["Traffic to Site"] || 0), 0
    );
    const totalSignups = dashboardData.social.reduce((sum, r) => 
      sum + (r.fields?.["Email Signups from Social"] || 0), 0
    );
    const totalRevenue = dashboardData.social.reduce((sum, r) => 
      sum + (r.fields?.["Revenue Generated"] || 0), 0
    );

    // Platform breakdown
    const platformData = {};
    dashboardData.social.forEach(record => {
      const platform = record.fields?.Platform;
      if (platform) {
        if (!platformData[platform]) {
          platformData[platform] = { posts: 0, followers: 0, engagement: 0 };
        }
        platformData[platform].posts += record.fields?.["Posts Published"] || 0;
        platformData[platform].followers += record.fields?.["Follower Count"] || 0;
        platformData[platform].engagement += record.fields?.["Engagement Score"] || 0;
      }
    });

    return {
      totalFollowers,
      totalPosts,
      avgEngagement: totalPosts > 0 ? (totalEngagement / totalPosts).toFixed(2) : 0,
      totalLeadMagnets,
      totalTraffic,
      totalSignups,
      totalRevenue: totalRevenue.toFixed(2),
      platformData
    };
  };

  const socialMetrics = calculateSocialMetrics();

  const getPlatformIcon = (platform) => {
    switch(platform) {
      case "Twitter": return <Twitter className="w-4 h-4" />;
      case "LinkedIn": return <Linkedin className="w-4 h-4" />;
      case "Instagram": return <Instagram className="w-4 h-4" />;
      case "Facebook": return <Facebook className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} flex items-center justify-center`}>
        <div className="text-white text-xl">Loading Marketing Empire...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} p-3`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Marketing Empire Dashboard</h1>
          <p className={`text-sm ${currentTheme.accent}`}>Social Media Traffic System v5.0</p>
        </div>
        <div className="flex gap-2">
          {Object.entries(themes).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => setActiveTheme(key)}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                activeTheme === key 
                  ? "bg-white text-gray-900" 
                  : `${currentTheme.cardBg} text-white border ${currentTheme.border} hover:bg-white/10`
              }`}
            >
              {theme.name}
            </button>
          ))}
        </div>
      </div>

      {/* Social Media Overview */}
      {socialMetrics && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white mb-2">Social Media Overview</h2>
          <div className="grid grid-cols-7 gap-2">
            <div className={`${currentTheme.cardBg} backdrop-blur-sm border ${currentTheme.border} rounded-lg p-2`}>
              <div className="flex items-center gap-1 mb-1">
                <Users className={`w-4 h-4 ${currentTheme.accent}`} />
                <span className="text-xs text-gray-400">Followers</span>
              </div>
              <div className="text-xl font-bold text-white">{socialMetrics.totalFollowers}</div>
            </div>
            <div className={`${currentTheme.cardBg} backdrop-blur-sm border ${currentTheme.border} rounded-lg p-2`}>
              <div className="flex items-center gap-1 mb-1">
                <MessageCircle className={`w-4 h-4 ${currentTheme.accent}`} />
                <span className="text-xs text-gray-400">Posts</span>
              </div>
              <div className="text-xl font-bold text-white">{socialMetrics.totalPosts}</div>
            </div>
            <div className={`${currentTheme.cardBg} backdrop-blur-sm border ${currentTheme.border} rounded-lg p-2`}>
              <div className="flex items-center gap-1 mb-1">
                <Zap className={`w-4 h-4 ${currentTheme.accent}`} />
                <span className="text-xs text-gray-400">Engagement</span>
              </div>
              <div className="text-xl font-bold text-white">{socialMetrics.avgEngagement}</div>
            </div>
            <div className={`${currentTheme.cardBg} backdrop-blur-sm border ${currentTheme.border} rounded-lg p-2`}>
              <div className="flex items-center gap-1 mb-1">
                <Target className={`w-4 h-4 ${currentTheme.accent}`} />
                <span className="text-xs text-gray-400">Lead Magnets</span>
              </div>
              <div className="text-xl font-bold text-white">{socialMetrics.totalLeadMagnets}</div>
            </div>
            <div className={`${currentTheme.cardBg} backdrop-blur-sm border ${currentTheme.border} rounded-lg p-2`}>
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className={`w-4 h-4 ${currentTheme.accent}`} />
                <span className="text-xs text-gray-400">Traffic</span>
              </div>
              <div className="text-xl font-bold text-white">{socialMetrics.totalTraffic}</div>
            </div>
            <div className={`${currentTheme.cardBg} backdrop-blur-sm border ${currentTheme.border} rounded-lg p-2`}>
              <div className="flex items-center gap-1 mb-1">
                <Mail className={`w-4 h-4 ${currentTheme.accent}`} />
                <span className="text-xs text-gray-400">Signups</span>
              </div>
              <div className="text-xl font-bold text-white">{socialMetrics.totalSignups}</div>
            </div>
            <div className={`${currentTheme.cardBg} backdrop-blur-sm border ${currentTheme.border} rounded-lg p-2`}>
              <div className="flex items-center gap-1 mb-1">
                <DollarSign className={`w-4 h-4 ${currentTheme.accent}`} />
                <span className="text-xs text-gray-400">Revenue</span>
              </div>
              <div className="text-xl font-bold text-white">${socialMetrics.totalRevenue}</div>
            </div>
          </div>
        </div>
      )}

      {/* Platform Performance */}
      {socialMetrics && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white mb-2">Platform Performance</h2>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(socialMetrics.platformData).map(([platform, data]) => (
              <div key={platform} className={`${currentTheme.cardBg} backdrop-blur-sm border ${currentTheme.border} rounded-lg p-2`}>
                <div className="flex items-center gap-2 mb-2">
                  {getPlatformIcon(platform)}
                  <span className="text-sm font-semibold text-white">{platform}</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Posts:</span>
                    <span className="text-white font-medium">{data.posts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Followers:</span>
                    <span className="text-white font-medium">{data.followers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Engagement:</span>
                    <span className="text-white font-medium">{data.engagement.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Agents Team */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white mb-2">AI Agent Team</h2>
        <div className="grid grid-cols-7 gap-2">
          {agents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className={`${currentTheme.cardBg} backdrop-blur-sm border ${currentTheme.border} rounded-lg p-2 cursor-pointer hover:bg-white/10 transition-all`}
            >
              <img
                src={agent.avatar}
                alt={agent.name}
                className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
              />
              <h3 className="text-sm font-semibold text-white text-center truncate">{agent.name}</h3>
              <p className="text-xs text-gray-400 text-center truncate">{agent.role}</p>
              <div className="mt-2 bg-gray-700 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${
                    activeTheme === "purpleDream" ? "from-purple-500 to-pink-500" :
                    activeTheme === "oceanBlue" ? "from-blue-500 to-cyan-500" :
                    "from-gray-500 to-gray-400"
                  }`}
                  style={{ width: `${agent.progress}%` }}
                />
              </div>
              <p className="text-xs text-center text-gray-400 mt-1">{agent.progress}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedAgent(null)}>
          <div className={`${currentTheme.cardBg} backdrop-blur-xl border ${currentTheme.border} rounded-lg p-6 max-w-lg w-full mx-4`} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-4 mb-4">
              <img src={selectedAgent.avatar} alt={selectedAgent.name} className="w-20 h-20 rounded-full object-cover" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">{selectedAgent.name}</h3>
                <p className={`text-sm ${currentTheme.accent}`}>{selectedAgent.role}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-white/10 rounded text-xs text-gray-300">{selectedAgent.ethnicity}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400 mb-1">Skills</p>
                <div className="flex gap-1 flex-wrap">
                  {selectedAgent.skills.map(skill => (
                    <span key={skill} className="px-2 py-0.5 bg-white/10 rounded text-xs text-white">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-gray-400">Tasks</p>
                  <p className="text-lg font-bold text-white">{selectedAgent.tasks}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Memory</p>
                  <p className="text-lg font-bold text-white">{selectedAgent.memory}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Cost</p>
                  <p className="text-lg font-bold text-white">{selectedAgent.cost}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedAgent(null)}
              className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 rounded text-white text-sm font-medium transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
