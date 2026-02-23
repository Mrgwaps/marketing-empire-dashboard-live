'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Check localStorage for existing session
  useEffect(() => {
    const session = localStorage.getItem('dashboard_session');
    if (session) {
      const userData = JSON.parse(session);
      setIsLoggedIn(true);
      setUserEmail(userData.email);
    }
  }, []);

  // Fetch data every 60s after login
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchData = async () => {
      try {
        const res = await fetch('/api/airtable?tableId=all');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'cptdigitals@gmail.com' && password === 'admin456!') {
      const userData = { email, loginTime: Date.now() };
      localStorage.setItem('dashboard_session', JSON.stringify(userData));
      setIsLoggedIn(true);
      setUserEmail(email);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dashboard_session');
    setIsLoggedIn(false);
    setUserEmail('');
    setEmail('');
    setPassword('');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 w-full max-w-sm"
        >
          <h1 className="text-xl font-bold text-white mb-4">Marketing Empire Login</h1>
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="block text-xs text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                required
              />
            </div>
            {loginError && <p className="text-red-400 text-xs">{loginError}</p>}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded text-sm font-medium hover:opacity-90 transition"
            >
              Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const subscribers = stats?.emailSignups || 0;
  const revenue = stats?.totalRevenue || 0;
  const comments = stats?.redditComments || 0;
  const engagement = stats?.engagementRate || 0;
  const activities = stats?.recentActivity || [];

  // Mock chart data (7-day trend)
  const chartData = [
    { day: 'Mon', subscribers: 0, revenue: 0 },
    { day: 'Tue', subscribers: 0, revenue: 0 },
    { day: 'Wed', subscribers: 0, revenue: 0 },
    { day: 'Thu', subscribers: 0, revenue: 0 },
    { day: 'Fri', subscribers: 0, revenue: 0 },
    { day: 'Sat', subscribers: 0, revenue: 0 },
    { day: 'Sun', subscribers: subscribers, revenue: revenue },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* SIDEBAR - 60px wide */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? '60px' : '48px' }}
        className="bg-white/5 backdrop-blur-md border-r border-white/10 flex flex-col items-center py-3 gap-3"
      >
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white text-lg">
          ☰
        </button>
        <div className="flex flex-col gap-2 text-white/60 text-xs">
          <button className="hover:text-white transition">📊</button>
          <button className="hover:text-white transition">💰</button>
          <button className="hover:text-white transition">📧</button>
          <button className="hover:text-white transition">⚙️</button>
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-4 overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Marketing Empire</h1>
            <p className="text-xs text-gray-400">Real-time Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-300">{userEmail}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded text-xs text-red-300 hover:bg-red-500/30 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* STATS GRID - 4 columns, COMPACT cards */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { icon: '📧', label: 'Email Subscribers', value: subscribers, target: '/ 10', color: 'from-blue-500 to-cyan-500' },
            { icon: '💰', label: 'Total Revenue', value: `$${revenue.toFixed(2)}`, target: '/ $1.00', color: 'from-green-500 to-emerald-500' },
            { icon: '💬', label: 'Reddit Comments', value: comments, target: '', color: 'from-purple-500 to-pink-500' },
            { icon: '📊', label: 'Engagement', value: `${engagement}%`, target: '', color: 'from-orange-500 to-red-500' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">{stat.icon}</span>
                <h3 className="text-xs font-medium text-gray-300">{stat.label}</h3>
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </span>
                {stat.target && <span className="text-xs text-gray-500">{stat.target}</span>}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CHARTS ROW - 2 columns, COMPACT height (160px) */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Subscriber Growth */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-3">
            <h3 className="text-sm font-semibold text-white mb-2">Subscriber Growth</h3>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="day" stroke="#9ca3af" style={{ fontSize: '10px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '10px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '6px', fontSize: '11px' }} />
                <Area type="monotone" dataKey="subscribers" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorSubs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-3">
            <h3 className="text-sm font-semibold text-white mb-2">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="day" stroke="#9ca3af" style={{ fontSize: '10px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '10px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '6px', fontSize: '11px' }} />
                <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Feed - COMPACT */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-3">
          <h3 className="text-sm font-semibold text-white mb-2">Recent Activity</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {activities.length > 0 ? (
              activities.map((activity, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <div className="flex-1">
                    <p className="text-gray-300">{activity.message}</p>
                    <p className="text-gray-500 text-[10px]">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-xs">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
