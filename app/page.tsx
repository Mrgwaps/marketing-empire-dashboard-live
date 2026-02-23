'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Activity, Mail, MessageSquare, Globe, CheckCircle2, AlertCircle } from 'lucide-react';

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
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ icon: Icon, title, value, change, gradient }: any) => (
    <div className="bg-[#1a1d29] rounded-2xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-green-400 text-sm font-medium flex items-center">
          <TrendingUp className="w-4 h-4 mr-1" />
          {change}
        </span>
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );

  const SystemStatus = ({ name, status }: {name: string, status: string}) => (
    <div className="flex items-center justify-between p-4 bg-[#1a1d29] rounded-xl border border-gray-800 hover:border-purple-500/30 transition-all">
      <div className="flex items-center gap-3">
        {status === 'active' ? (
          <CheckCircle2 className="w-5 h-5 text-green-400" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-400" />
        )}
        <span className="text-gray-300 font-medium">{name}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
        <span className="text-sm text-gray-500 capitalize">{status}</span>
      </div>
    </div>
  );

  const ActivityItem = ({ icon: Icon, title, time, status }: any) => {
    const statusColors = {
      success: 'bg-green-500/20 border-green-500/30 text-green-400',
      warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
      error: 'bg-red-500/20 border-red-500/30 text-red-400'
    };

    return (
      <div className="flex items-center gap-4 p-4 rounded-xl bg-[#13151f] border border-gray-800 hover:border-purple-500/30 transition-all">
        <div className={`p-3 rounded-xl border ${statusColors[status as keyof typeof statusColors]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-white font-medium">{title}</p>
          <p className="text-sm text-gray-500">{time}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[#13151f] border-r border-gray-800 p-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Marketing Empire</h1>
              <p className="text-xs text-gray-500">v2.0</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-white">
            <Activity className="w-5 h-5" />
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800/50 text-gray-400 hover:text-white transition-all">
            <Mail className="w-5 h-5" />
            <span>Email Campaigns</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800/50 text-gray-400 hover:text-white transition-all">
            <MessageSquare className="w-5 h-5" />
            <span>Reddit Automation</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800/50 text-gray-400 hover:text-white transition-all">
            <Globe className="w-5 h-5" />
            <span>Craigslist Leads</span>
          </a>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
            <p className="text-sm text-gray-400 mb-2">System Health</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm font-medium">All Systems Online</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="ml-64 p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back 👋</h2>
          <p className="text-gray-400">Here's what's happening with your marketing empire today</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={DollarSign}
            title="Total Revenue"
            value={`$${stats.revenue.toFixed(2)}`}
            change="+12.5%"
            gradient="from-green-500 to-emerald-600"
          />
          <StatCard 
            icon={Users}
            title="Email Subscribers"
            value={stats.subscribers}
            change="+8.2%"
            gradient="from-blue-500 to-cyan-600"
          />
          <StatCard 
            icon={TrendingUp}
            title="Conversions"
            value={stats.conversions}
            change="+23.1%"
            gradient="from-purple-500 to-pink-600"
          />
          <StatCard 
            icon={Activity}
            title="Engagement Rate"
            value={`${stats.engagement}%`}
            change="+5.4%"
            gradient="from-orange-500 to-red-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-[#1a1d29] rounded-2xl p-6 border border-gray-800">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              System Health
            </h3>
            <div className="space-y-3">
              <SystemStatus name="Airtable Sync" status={systemHealth.airtable} />
              <SystemStatus name="Reddit Bot" status={systemHealth.reddit} />
              <SystemStatus name="Email Automation" status={systemHealth.email} />
              <SystemStatus name="Craigslist Posting" status={systemHealth.craigslist} />
            </div>
          </div>

          <div className="lg:col-span-2 bg-[#1a1d29] rounded-2xl p-6 border border-gray-800">
            <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
            <div className="space-y-4">
              <ActivityItem 
                icon={MessageSquare}
                title="Reddit comment posted"
                time="2 minutes ago"
                status="success"
              />
              <ActivityItem 
                icon={Mail}
                title="Email sequence sent to 45 subscribers"
                time="15 minutes ago"
                status="success"
              />
              <ActivityItem 
                icon={Globe}
                title="Craigslist post created in LA"
                time="1 hour ago"
                status="warning"
              />
              <ActivityItem 
                icon={TrendingUp}
                title="New conversion: $127.50"
                time="2 hours ago"
                status="success"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
