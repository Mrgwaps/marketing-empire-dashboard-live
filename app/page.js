'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Users, DollarSign, Activity, Mail, MessageSquare, 
  Globe, CheckCircle2, AlertCircle, Sparkles, Zap, Target,
  BarChart3, LineChart, PieChart, ArrowUpRight
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, LineChart as RechartsLineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export default function Dashboard() {
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
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#12162a] to-[#1a1f3a]">
      {/* Animated background gradient orbs */}
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

      {/* Main container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Marketing Empire Dashboard
            </h1>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-purple-400" />
            </motion.div>
          </div>
          <p className="text-gray-400 text-lg">Real-time analytics & automation monitoring</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={DollarSign}
            title="Total Revenue"
            value={`$${stats.revenue.toFixed(2)}`}
            change="+12.5%"
            gradient="from-emerald-500 to-teal-600"
            delay={0.1}
          />
          <StatCard
            icon={Users}
            title="Subscribers"
            value={stats.subscribers}
            change="+8.2%"
            gradient="from-blue-500 to-purple-600"
            delay={0.2}
          />
          <StatCard
            icon={Target}
            title="Conversions"
            value={stats.conversions}
            change="+15.3%"
            gradient="from-pink-500 to-rose-600"
            delay={0.3}
          />
          <StatCard
            icon={Activity}
            title="Engagement"
            value={`${stats.engagement}%`}
            change="+5.7%"
            gradient="from-orange-500 to-amber-600"
            delay={0.4}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Revenue Trend" icon={TrendingUp} delay={0.5}>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2f45" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1d29', 
                    border: '1px solid #374151',
                    borderRadius: '12px'
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
          </ChartCard>

          <ChartCard title="Subscriber Growth" icon={Users} delay={0.6}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2f45" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1d29', 
                    border: '1px solid #374151',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="subscribers" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* System Health & Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SystemHealthCard systemHealth={systemHealth} delay={0.7} />
          <ActivityCard delay={0.8} />
        </div>
      </div>
    </div>
  );
}

// Stat Card Component with animations
function StatCard({ icon: Icon, title, value, change, gradient, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl from-purple-500/20 to-blue-500/20" />
      <div className="relative bg-[#1a1d29]/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50 hover:border-purple-500/50 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <motion.div 
            className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
            whileHover={{ rotate: 5, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3 }}
            className="text-emerald-400 text-sm font-semibold flex items-center gap-1 bg-emerald-500/10 px-3 py-1 rounded-full"
          >
            <ArrowUpRight className="w-4 h-4" />
            {change}
          </motion.span>
        </div>
        <h3 className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wide">{title}</h3>
        <motion.p 
          className="text-4xl font-bold text-white"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.2, type: "spring" }}
        >
          {value}
        </motion.p>
      </div>
    </motion.div>
  );
}

// Chart Card Component
function ChartCard({ title, icon: Icon, children, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-[#1a1d29]/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-purple-500/10">
          <Icon className="w-5 h-5 text-purple-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

// System Health Card
function SystemHealthCard({ systemHealth, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-[#1a1d29]/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-emerald-500/10">
          <Zap className="w-5 h-5 text-emerald-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">System Health</h3>
        <div className="ml-auto flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-sm text-emerald-400 font-medium">All Online</span>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(systemHealth).map(([name, status], index) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.1 * index }}
            className="flex items-center justify-between p-4 bg-[#12162a] rounded-xl border border-gray-800/30 hover:border-purple-500/30 transition-all group"
          >
            <div className="flex items-center gap-3">
              {status === 'active' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
              <span className="text-gray-300 font-medium capitalize">{name}</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.div 
                className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-emerald-400' : 'bg-red-400'}`}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm text-gray-400 capitalize">{status}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Activity Card
function ActivityCard({ delay }) {
  const activities = [
    { icon: Mail, title: 'New subscriber', time: '2 min ago', status: 'success' },
    { icon: MessageSquare, title: 'Reddit comment posted', time: '15 min ago', status: 'success' },
    { icon: Globe, title: 'Craigslist post live', time: '1 hour ago', status: 'success' },
    { icon: Activity, title: 'Analytics updated', time: '2 hours ago', status: 'success' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-[#1a1d29]/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-blue-500/10">
          <Activity className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
      </div>

      <div className="space-y-3">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.1 * index }}
            className="flex items-center gap-4 p-4 bg-[#12162a] rounded-xl border border-gray-800/30 hover:border-blue-500/30 transition-all group"
          >
            <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
              <activity.icon className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-200 font-medium">{activity.title}</p>
              <p className="text-sm text-gray-500">{activity.time}</p>
            </div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
