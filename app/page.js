'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [currentView, setCurrentView] = useState('overview');
  const [nextTaskTime, setNextTaskTime] = useState(null);

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

  // Calculate next task countdown
  useEffect(() => {
    if (!isLoggedIn) return;

    const updateCountdown = () => {
      const now = new Date();
      const nextTasks = [
        { name: 'Reddit Comments', hours: [8, 12, 16, 20] },
        { name: 'Hyperbrowser Q&A', hours: [10, 14, 18] },
        { name: 'Milestone Check', minutes: 30 }
      ];

      let nearest = null;
      nextTasks.forEach(task => {
        if (task.hours) {
          task.hours.forEach(hour => {
            const target = new Date();
            target.setHours(hour, 0, 0, 0);
            if (target < now) target.setDate(target.getDate() + 1);
            if (!nearest || target < nearest.time) {
              nearest = { name: task.name, time: target };
            }
          });
        } else if (task.minutes) {
          const mins = now.getMinutes();
          const nextSlot = Math.ceil(mins / task.minutes) * task.minutes;
          const target = new Date();
          target.setMinutes(nextSlot, 0, 0);
          if (target < now) target.setHours(target.getHours() + 1, 0, 0, 0);
          if (!nearest || target < nearest.time) {
            nearest = { name: task.name, time: target };
          }
        }
      });

      if (nearest) {
        const diff = nearest.time - now;
        const hours = Math.floor(diff / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setNextTaskTime({
          name: nearest.name,
          countdown: hours > 0 ? `${hours}h ${mins}m` : `${mins}m ${secs}s`
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
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
  const systemHealth = stats?.systemHealth || { status: 'operational', uptime: 99.9 };

  // Agent tasks from Airtable
  const agents = [
    { name: 'Reddit Scout', status: 'active', task: 'Posting comments in r/SkincareAddiction', completion: 75 },
    { name: 'Email Nurture', status: 'idle', task: 'Waiting for new subscribers', completion: 0 },
    { name: 'Content Analyzer', status: 'active', task: 'Analyzing top posts for insights', completion: 45 },
    { name: 'Hyperbrowser', status: 'error', task: 'Platform outage (500 error)', completion: 0 },
    { name: 'Analytics Bot', status: 'active', task: 'Updating Airtable metrics', completion: 90 }
  ];

  // Automation queue
  const automationQueue = [
    { name: 'Reddit Comments', nextRun: nextTaskTime?.name === 'Reddit Comments' ? nextTaskTime.countdown : '2h 15m', status: 'scheduled' },
    { name: 'Hyperbrowser Q&A', nextRun: nextTaskTime?.name === 'Hyperbrowser Q&A' ? nextTaskTime.countdown : '4h 30m', status: 'blocked' },
    { name: 'Milestone Check', nextRun: nextTaskTime?.name === 'Milestone Check' ? nextTaskTime.countdown : '12m', status: 'scheduled' },
    { name: 'Content Repurpose', nextRun: '6h 0m', status: 'paused' }
  ];

  // Chart data (7-day trend)
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
      {/* SIDEBAR - 60px wide with working links */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? '60px' : '48px' }}
        className="bg-white/5 backdrop-blur-md border-r border-white/10 flex flex-col items-center py-3 gap-3"
      >
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white text-lg">
          ☰
        </button>
        <div className="flex flex-col gap-2 text-white/60 text-xs">
          <button 
            onClick={() => setCurrentView('overview')} 
            className={`hover:text-white transition ${currentView === 'overview' ? 'text-purple-400' : ''}`}
            title="Overview"
          >
            📊
          </button>
          <Link href="/agents" className="hover:text-white transition" title="AI Agents">
            🤖
          </Link>
          <button 
            onClick={() => setCurrentView('analytics')} 
            className={`hover:text-white transition ${currentView === 'analytics' ? 'text-purple-400' : ''}`}
            title="Analytics"
          >
            💰
          </button>
          <button 
            onClick={() => setCurrentView('automation')} 
            className={`hover:text-white transition ${currentView === 'automation' ? 'text-purple-400' : ''}`}
            title="Automation"
          >
            ⚙️
          </button>
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-4 overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Marketing Empire</h1>
            <p className="text-xs text-gray-400">Real-time Dashboard · Next: {nextTaskTime?.name || 'Loading...'} in {nextTaskTime?.countdown || '...'}</p>
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

        {/* STATS GRID - 6 cards (added system health + next task) */}
        <div className="grid grid-cols-6 gap-3 mb-4">
          {[
            { icon: '📧', label: 'Email Subscribers', value: subscribers, target: '/ 10', color: 'from-blue-500 to-cyan-500' },
            { icon: '💰', label: 'Total Revenue', value: `$${revenue.toFixed(2)}`, target: '/ $1.00', color: 'from-green-500 to-emerald-500' },
            { icon: '💬', label: 'Reddit Comments', value: comments, target: '', color: 'from-purple-500 to-pink-500' },
            { icon: '📊', label: 'Engagement', value: `${engagement}%`, target: '', color: 'from-orange-500 to-red-500' },
            { icon: '🟢', label: 'System Health', value: systemHealth.status === 'operational' ? 'OK' : 'ISSUE', target: `${systemHealth.uptime}%`, color: systemHealth.status === 'operational' ? 'from-green-400 to-green-600' : 'from-red-400 to-red-600' },
            { icon: '⏱️', label: 'Next Task', value: nextTaskTime?.countdown || '...', target: nextTaskTime?.name || '', color: 'from-indigo-500 to-purple-500' }
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
              <div className="flex flex-col">
                <span className={`text-xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </span>
                {stat.target && <span className="text-xs text-gray-500">{stat.target}</span>}
              </div>
            </motion.div>
          ))}
        </div>

        {/* AGENT TASKS GRID */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          {agents.map((agent, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-white">{agent.name}</h4>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  agent.status === 'active' ? 'bg-green-500/20 text-green-300' :
                  agent.status === 'error' ? 'bg-red-500/20 text-red-300' :
                  'bg-gray-500/20 text-gray-300'
                }`}>
                  {agent.status}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-2">{agent.task}</p>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${agent.status === 'active' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-500'}`}
                  style={{ width: `${agent.completion}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* AUTOMATION QUEUE */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-3 mb-4">
          <h3 className="text-sm font-semibold text-white mb-3">Automation Queue</h3>
          <div className="grid grid-cols-4 gap-3">
            {automationQueue.map((auto, i) => (
              <div key={i} className="flex items-center justify-between bg-white/5 rounded p-2">
                <div className="flex-1">
                  <p className="text-xs font-medium text-white">{auto.name}</p>
                  <p className="text-xs text-gray-400">Next: {auto.nextRun}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  auto.status === 'scheduled' ? 'bg-blue-500/20 text-blue-300' :
                  auto.status === 'blocked' ? 'bg-red-500/20 text-red-300' :
                  'bg-yellow-500/20 text-yellow-300'
                }`}>
                  {auto.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CHARTS ROW */}
        <div className="grid grid-cols-2 gap-3 mb-4">
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

        {/* REAL-TIME ACTIVITY FEED from Airtable */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-3">
          <h3 className="text-sm font-semibold text-white mb-2">Recent Activity (Live from Airtable)</h3>
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
              <p className="text-gray-500 text-xs">No recent activity · Monitoring Email Signups, Product Performance, Reddit Comments...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
