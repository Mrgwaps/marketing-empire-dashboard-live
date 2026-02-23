"use client";

import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Settings, TrendingUp, Mail, DollarSign, Activity, Brain, Clock, Package, Zap, Video, Target, Calendar } from 'lucide-react';

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
      const interval = setInterval(fetchDashboardData, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      const [emailRes, productRes, socialRes] = await Promise.all([
        fetch('/api/airtable?tableId=tblkXDs74AhSD4N4T'),
        fetch('/api/airtable?tableId=tblshfGxKJYZEWyU6'),
        fetch('/api/airtable?tableId=tblcyuxtdueFDnSjJ')
      ]);

      const emailData = await emailRes.json();
      const productData = await productRes.json();
      const socialData = await socialRes.json();

      setDashboardData({
        emailSignups: emailData?.records?.[0]?.fields?.['Email Signups'] || 0,
        totalRevenue: productData?.records?.reduce((sum, r) => sum + (r.fields?.Revenue || 0), 0) || 0,
        products: productData?.records || [],
        platforms: socialData?.records || []
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setDashboardData({ emailSignups: 0, totalRevenue: 0, products: [], platforms: [] });
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'cptdigitals@gmail.com' && password === 'admin456!') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-purple-500/20">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">Marketing Empire</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500 focus:outline-none"
            />
            {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded font-semibold transition">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Sidebar */}
      <div className="w-16 bg-slate-800/50 backdrop-blur-sm border-r border-purple-500/20 flex flex-col items-center py-6 space-y-6">
        <button
          onClick={() => setCurrentPage('dashboard')}
          className={`p-3 rounded-lg transition ${
            currentPage === 'dashboard'
              ? 'bg-purple-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          <LayoutDashboard size={24} />
        </button>
        <button
          onClick={() => setCurrentPage('agents')}
          className={`p-3 rounded-lg transition ${
            currentPage === 'agents'
              ? 'bg-purple-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          <Users size={24} />
        </button>
        <button
          onClick={() => setCurrentPage('settings')}
          className={`p-3 rounded-lg transition ${
            currentPage === 'settings'
              ? 'bg-purple-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          <Settings size={24} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {currentPage === 'dashboard' && (
              <div>
                <h1 className="text-3xl font-bold text-white mb-6">Marketing Empire Dashboard</h1>

                {/* NEW: Performance Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-purple-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">Email Subscribers</span>
                      <Mail className="text-purple-400" size={20} />
                    </div>
                    <div className="text-2xl font-bold text-white">{dashboardData?.emailSignups || 0}</div>
                    <div className="text-xs text-green-400 mt-1">+0 this week</div>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-purple-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">Total Revenue</span>
                      <DollarSign className="text-green-400" size={20} />
                    </div>
                    <div className="text-2xl font-bold text-white">${(dashboardData?.totalRevenue || 0).toFixed(2)}</div>
                    <div className="text-xs text-green-400 mt-1">+$0 this month</div>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-purple-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">Reddit Karma</span>
                      <TrendingUp className="text-orange-400" size={20} />
                    </div>
                    <div className="text-2xl font-bold text-white">0</div>
                    <div className="text-xs text-gray-400 mt-1">+0 this week</div>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-purple-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">Email Open Rate</span>
                      <Activity className="text-blue-400" size={20} />
                    </div>
                    <div className="text-2xl font-bold text-white">0%</div>
                    <div className="text-xs text-gray-400 mt-1">Industry avg: 21%</div>
                  </div>
                </div>

                {/* NEW: Scheduled Automations */}
                <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-purple-500/20 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Clock className="text-purple-400" size={24} />
                      Scheduled Automations
                    </h2>
                    <span className="text-sm text-gray-400">Next: 🎯 Milestone Alerts in 1h 20m</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded border border-slate-600">
                      <div>
                        <div className="font-semibold text-white">🤖 Reddit Post Auto-Tracker</div>
                        <div className="text-sm text-gray-400">Daily at 8:00 AM PST</div>
                      </div>
                      <div className="text-right">
                        <div className="text-purple-400 font-semibold">22h 20m</div>
                        <div className="text-xs text-gray-500">Next run: Tue, Feb 24, 12:00 AM PST</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded border border-slate-600">
                      <div>
                        <div className="font-semibold text-white">📧 Brevo Email Metrics Sync</div>
                        <div className="text-sm text-gray-400">Weekly Monday 9:00 AM PST</div>
                      </div>
                      <div className="text-right">
                        <div className="text-purple-400 font-semibold">23h 20m</div>
                        <div className="text-xs text-gray-500">Next run: Tue, Feb 24, 1:00 AM PST</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded border border-slate-600">
                      <div>
                        <div className="font-semibold text-white">🔍 Weekly Competitive Research</div>
                        <div className="text-sm text-gray-400">Weekly Friday 11:00 AM PST</div>
                      </div>
                      <div className="text-right">
                        <div className="text-purple-400 font-semibold">5d 1h</div>
                        <div className="text-xs text-gray-500">Next run: Sat, Feb 28, 3:00 AM PST</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded border border-slate-600">
                      <div>
                        <div className="font-semibold text-white">🎯 Milestone Alerts</div>
                        <div className="text-sm text-gray-400">Every 30 minutes</div>
                      </div>
                      <div className="text-right">
                        <div className="text-purple-400 font-semibold">1h 20m</div>
                        <div className="text-xs text-gray-500">Next run: Mon, Feb 23, 3:00 AM PST</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* NEW: Income Streams */}
                <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-purple-500/20 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <DollarSign className="text-green-400" size={24} />
                      Income Streams
                    </h2>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded">All</button>
                      <button className="px-3 py-1 bg-slate-700 text-gray-400 text-sm rounded">Active Only</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-700/50 rounded border border-slate-600">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="text-orange-400" size={20} />
                        <span className="font-semibold text-white">Amazon Associates</span>
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">$0.00</div>
                      <div className="text-sm text-gray-400">↑ Commission: 10% on luxury items</div>
                      <div className="text-sm text-purple-400 mt-2">Products tracked: 5</div>
                    </div>

                    <div className="p-4 bg-slate-700/50 rounded border border-slate-600">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="text-blue-400" size={20} />
                        <span className="font-semibold text-white">Payhip Digital Products</span>
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">$0.00</div>
                      <div className="text-sm text-gray-400">Ready to launch</div>
                      <div className="text-sm text-green-400 mt-2">Status: ✅ Connected</div>
                    </div>

                    <div className="p-4 bg-slate-700/50 rounded border border-slate-600">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="text-yellow-400" size={20} />
                        <span className="font-semibold text-white">AgentMail Automation</span>
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">$0.00</div>
                      <div className="text-sm text-gray-400">Autonomous email ops</div>
                      <div className="text-sm text-green-400 mt-2">Status: ✅ Connected</div>
                    </div>

                    <div className="p-4 bg-slate-700/50 rounded border border-slate-600">
                      <div className="flex items-center gap-2 mb-2">
                        <Video className="text-red-400" size={20} />
                        <span className="font-semibold text-white">KIE AI Video Creation</span>
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">$0.00</div>
                      <div className="text-sm text-gray-400">Video marketing pipeline</div>
                      <div className="text-sm text-green-400 mt-2">Status: ✅ Connected</div>
                    </div>
                  </div>
                </div>

                {/* FIXED: Platform Performance - Bulletproof Rendering */}
                <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-purple-500/20 mb-6">
                  <h2 className="text-xl font-bold text-white mb-4">Platform Performance</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {loading ? (
                      // Loading state
                      Array(5).fill(0).map((_, i) => (
                        <div key={i} className="p-4 bg-slate-700/50 rounded border border-slate-600 animate-pulse">
                          <div className="h-4 bg-slate-600 rounded mb-2"></div>
                          <div className="h-8 bg-slate-600 rounded mb-2"></div>
                          <div className="h-3 bg-slate-600 rounded"></div>
                        </div>
                      ))
                    ) : dashboardData?.platforms?.length > 0 ? (
                      // Real data
                      ['Facebook', 'Twitter/X', 'LinkedIn', 'Instagram', 'Reddit'].map((platform) => {
                        const platformData = dashboardData.platforms.find(p => 
                          p.fields?.Platform?.toLowerCase() === platform.toLowerCase().replace('/x', '')
                        );
                        const posts = platformData?.fields?.['Posts Published'] || 0;
                        const followers = platformData?.fields?.['Follower Count'] || 0;
                        
                        return (
                          <div key={platform} className="p-4 bg-slate-700/50 rounded border border-slate-600">
                            <div className="font-semibold text-white mb-2">{platform}</div>
                            <div className="text-2xl font-bold text-purple-400 mb-1">{posts}</div>
                            <div className="text-sm text-gray-400">posts</div>
                            <div className="text-xs text-gray-500 mt-2">{followers} followers</div>
                            <div className={`text-xs mt-2 ${posts > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                              {posts > 0 ? '✓ Active' : '○ Pending'}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      // Fallback placeholder cards
                      ['Facebook', 'Twitter/X', 'LinkedIn', 'Instagram', 'Reddit'].map((platform) => (
                        <div key={platform} className="p-4 bg-slate-700/50 rounded border border-slate-600">
                          <div className="font-semibold text-white mb-2">{platform}</div>
                          <div className="text-2xl font-bold text-gray-500 mb-1">0</div>
                          <div className="text-sm text-gray-400">posts</div>
                          <div className="text-xs text-gray-500 mt-2">0 followers</div>
                          <div className="text-xs text-gray-400 mt-2">○ Pending</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Existing sections... */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-purple-500/20">
                    <h2 className="text-xl font-bold text-white mb-4">Top Products</h2>
                    <div className="space-y-3">
                      {dashboardData?.products?.slice(0, 5).map((product, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <span className="text-gray-300">{product.fields?.['Product Name'] || 'Unknown'}</span>
                          <span className="text-green-400 font-semibold">${(product.fields?.Revenue || 0).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-purple-500/20">
                    <h2 className="text-xl font-bold text-white mb-4">Quick Stats</h2>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email Signups</span>
                        <span className="text-white font-semibold">{dashboardData?.emailSignups || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Products Tracked</span>
                        <span className="text-white font-semibold">{dashboardData?.products?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Revenue</span>
                        <span className="text-white font-semibold">${(dashboardData?.totalRevenue || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentPage === 'agents' && (
              <div>
                <h1 className="text-3xl font-bold text-white mb-6">AI Agent Team</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: 'Reddit Scout', role: 'Content Discovery', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', status: 'Active', brain: 'GPT-4o' },
                    { name: 'Email Composer', role: 'Nurture Automation', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', status: 'Active', brain: 'Claude 3.7' },
                    { name: 'Data Analyst', role: 'Performance Tracking', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', status: 'Active', brain: 'GPT-4o' },
                    { name: 'Content Writer', role: 'Post Generation', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', status: 'Idle', brain: 'Claude 3.7' },
                    { name: 'SEO Optimizer', role: 'Search Strategy', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', status: 'Active', brain: 'GPT-4o' },
                    { name: 'Social Manager', role: 'Multi-Platform Posting', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', status: 'Active', brain: 'Gemini Pro' },
                    { name: 'Revenue Tracker', role: 'Financial Intelligence', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', status: 'Active', brain: 'Claude 3.7' }
                  ].map((agent, i) => (
                    <div key={i} className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-purple-500/20">
                      <img src={agent.avatar} alt={agent.name} className="w-20 h-20 rounded-full mb-4 object-cover" />
                      <h3 className="text-xl font-bold text-white mb-2">{agent.name}</h3>
                      <p className="text-gray-400 text-sm mb-3">{agent.role}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <Brain size={16} className="text-purple-400" />
                        <span className="text-sm text-gray-400">{agent.brain}</span>
                      </div>
                      <div className={`inline-block px-3 py-1 rounded text-xs ${
                        agent.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {agent.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentPage === 'settings' && (
              <div>
                <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>
                <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-purple-500/20">
                  <h2 className="text-xl font-bold text-white mb-4">Account Settings</h2>
                  <p className="text-gray-400">Configure your marketing automation preferences here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}