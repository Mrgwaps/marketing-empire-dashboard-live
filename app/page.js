'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Users, DollarSign, Activity, Mail, MessageSquare, 
  Globe, CheckCircle2, AlertCircle, Sparkles, Zap, Target,
  BarChart3, LineChart, PieChart, ArrowUpRight, Home, Settings,
  Bell, Search, Menu, X
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, LineChart as RechartsLineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    subscribers: 0,
    conversions: 0,
    engagement: 0
  });

  const [systemHealth, setSystemHealth] = useState({
    airtable: 'active',
    reddit: 'active',
    email: 'active',
    craigslist: 'active'
  });

  const [chartData, setChartData] = useState([
    { name: 'Mon', revenue: 0, subscribers: 0, clicks: 0 },
    { name: 'Tue', revenue: 0, subscribers: 0, clicks: 0 },
    { name: 'Wed', revenue: 0, subscribers: 0, clicks: 0 },
    { name: 'Thu', revenue: 0, subscribers: 0, clicks: 0 },
    { name: 'Fri', revenue: 0, subscribers: 0, clicks: 0 },
    { name: 'Sat', revenue: 0, subscribers: 0, clicks: 0 },
    { name: 'Sun', revenue: 0, subscribers: 0, clicks: 0 },
  ]);

  const [recentActivities, setRecentActivities] = useState([]);

  // Fetch data from Airtable
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/airtable');
        const data = await response.json();

        setStats({
          revenue: data.revenue || 0,
          subscribers: data.subscribers || 0,
          conversions: data.conversions || 0,
          engagement: data.engagement || 0
        });

        // Update chart data if available
        if (data.chartData) {
          setChartData(data.chartData);
        }

        // Update recent activities if available
        if (data.recentActivities) {
          setRecentActivities(data.recentActivities);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#12162a] to-[#1a1f3a]">
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-screen w-64 bg-[#0d1117]/90 backdrop-blur-xl border-r border-purple-500/10 z-50"
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Marketing
              </h1>
              <p className="text-xs text-gray-500">Empire Dashboard</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            <NavItem icon={Home} label="Dashboard" active />
            <NavItem icon={BarChart3} label="Analytics" />
            <NavItem icon={Users} label="Subscribers" />
            <NavItem icon={Target} label="Campaigns" />
            <NavItem icon={Settings} label="Settings" />
          </nav>

          {/* System Status */}
          <div className="mt-auto pt-4 border-t border-purple-500/10">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span>All Systems Online</span>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-[#0d1117]/80 backdrop-blur-xl border-b border-purple-500/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5 text-gray-400" /> : <Menu className="w-5 h-5 text-gray-400" />}
              </button>
              <div>
                <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
                <p className="text-sm text-gray-400">Real-time analytics & automation monitoring</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full" />
              </button>
              <button className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors">
                <Search className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Stats Grid - Horizontal 4-column */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <CompactStatCard
              icon={DollarSign}
              title="Revenue"
              value={`$${stats.revenue.toFixed(2)}`}
              change="+12.5%"
              gradient="from-emerald-500 to-teal-600"
              delay={0.1}
            />
            <CompactStatCard
              icon={Users}
              title="Subscribers"
              value={stats.subscribers}
              change="+8.2%"
              gradient="from-blue-500 to-purple-600"
              delay={0.2}
            />
            <CompactStatCard
              icon={Target}
              title="Conversions"
              value={stats.conversions}
              change="+15.3%"
              gradient="from-pink-500 to-rose-600"
              delay={0.3}
            />
            <CompactStatCard
              icon={Activity}
              title="Engagement"
              value={`${stats.engagement}%`}
              change="+5.7%"
              gradient="from-orange-500 to-amber-600"
              delay={0.4}
            />
          </div>

          {/* Charts Row - 2 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <CompactChartCard title="Revenue Trend" icon={TrendingUp} delay={0.5}>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2f45" />
                  <XAxis dataKey="name" stroke="#6b7280" tick={{fontSize: 12}} />
                  <YAxis stroke="#6b7280" tick={{fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1d29', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8b5cf6" 
                    fillOpacity={1} 
                    fill="url(#revenueGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CompactChartCard>

            <CompactChartCard title="Subscriber Growth" icon={Users} delay={0.6}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2f45" />
                  <XAxis dataKey="name" stroke="#6b7280" tick={{fontSize: 12}} />
                  <YAxis stroke="#6b7280" tick={{fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1d29', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="subscribers" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CompactChartCard>
          </div>

          {/* Bottom Row - System Health + Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CompactSystemHealth systemHealth={systemHealth} delay={0.7} />
            <CompactActivityFeed activities={recentActivities} delay={0.8} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Navigation Item
function NavItem({ icon: Icon, label, active = false }) {
  return (
    <motion.button
      whileHover={{ x: 4 }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        active 
          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-l-2 border-purple-500 text-white' 
          : 'text-gray-400 hover:bg-purple-500/5 hover:text-gray-300'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </motion.button>
  );
}

// Compact Stat Card
function CompactStatCard({ icon: Icon, title, value, change, gradient, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="relative group"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl blur-xl`} />
      <div className="relative bg-[#1a1d29]/60 backdrop-blur-xl rounded-xl p-4 border border-gray-800/50 hover:border-purple-500/30 transition-all">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} shadow-lg`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-full">
            <ArrowUpRight className="w-3 h-3" />
            {change}
          </span>
        </div>
        <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-1">{title}</h3>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </motion.div>
  );
}

// Compact Chart Card
function CompactChartCard({ title, icon: Icon, children, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-[#1a1d29]/60 backdrop-blur-xl rounded-xl p-5 border border-gray-800/50 hover:border-purple-500/20 transition-all"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-purple-500/10">
          <Icon className="w-4 h-4 text-purple-400" />
        </div>
        <h3 className="text-base font-semibold text-white">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

// Compact System Health
function CompactSystemHealth({ systemHealth, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-[#1a1d29]/60 backdrop-blur-xl rounded-xl p-5 border border-gray-800/50"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-emerald-500/10">
          <Zap className="w-4 h-4 text-emerald-400" />
        </div>
        <h3 className="text-base font-semibold text-white">System Health</h3>
        <div className="ml-auto flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-xs text-emerald-400 font-medium">All Online</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {Object.entries(systemHealth).map(([name, status], index) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.05 * index }}
            className="flex items-center justify-between p-3 bg-[#12162a] rounded-lg border border-gray-800/30 hover:border-purple-500/20 transition-all"
          >
            <div className="flex items-center gap-2">
              {status === 'active' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
              <span className="text-sm text-gray-300 capitalize font-medium">{name}</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-emerald-400' : 'bg-red-400'}`} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Compact Activity Feed
function CompactActivityFeed({ activities, delay }) {
  const defaultActivities = [
    { icon: Mail, title: 'Email sync active', time: 'Live', status: 'success' },
    { icon: MessageSquare, title: 'Reddit monitoring', time: 'Live', status: 'success' },
    { icon: Globe, title: 'Craigslist posting', time: 'Live', status: 'success' },
    { icon: Activity, title: 'Analytics updating', time: 'Live', status: 'success' },
  ];

  const displayActivities = activities.length > 0 ? activities : defaultActivities;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-[#1a1d29]/60 backdrop-blur-xl rounded-xl p-5 border border-gray-800/50"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-blue-500/10">
          <Activity className="w-4 h-4 text-blue-400" />
        </div>
        <h3 className="text-base font-semibold text-white">Recent Activity</h3>
      </div>

      <div className="space-y-2">
        {displayActivities.slice(0, 4).map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.05 * index }}
            className="flex items-center gap-3 p-3 bg-[#12162a] rounded-lg border border-gray-800/30 hover:border-blue-500/20 transition-all group"
          >
            <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/15 transition-colors">
              <activity.icon className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-200 font-medium">{activity.title}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
