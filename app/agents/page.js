'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AgentDashboard() {
  const [agents, setAgents] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch agent data from Airtable
    const fetchAgentData = async () => {
      try {
        const res = await fetch('/api/airtable?tableId=agents');
        const data = await res.json();

        // Agent profiles
        const agentProfiles = [
          { 
            id: 1, 
            name: 'Reddit Scout', 
            avatar: '🔍',
            role: 'Community Engagement',
            status: 'active',
            tasksCompleted: 24,
            successRate: 92,
            currentTask: 'Posting value-driven comments in r/SkincareAddiction'
          },
          { 
            id: 2, 
            name: 'Email Nurture', 
            avatar: '📧',
            role: 'Lead Conversion',
            status: 'idle',
            tasksCompleted: 0,
            successRate: 100,
            currentTask: 'Waiting for new subscribers to trigger drip sequence'
          },
          { 
            id: 3, 
            name: 'Content Analyzer', 
            avatar: '🧠',
            role: 'Research & Insights',
            status: 'active',
            tasksCompleted: 15,
            successRate: 88,
            currentTask: 'Analyzing top-performing posts for content strategy'
          },
          { 
            id: 4, 
            name: 'Hyperbrowser Agent', 
            avatar: '🌐',
            role: 'Multi-Platform Q&A',
            status: 'error',
            tasksCompleted: 0,
            successRate: 0,
            currentTask: 'Platform outage - HTTP 500 error (retrying in 2h)'
          },
          { 
            id: 5, 
            name: 'Analytics Bot', 
            avatar: '📊',
            role: 'Data Sync',
            status: 'active',
            tasksCompleted: 48,
            successRate: 98,
            currentTask: 'Syncing metrics to Airtable every 30 minutes'
          }
        ];

        setAgents(agentProfiles);

        // Recent tasks
        const recentTasks = [
          { agent: 'Reddit Scout', task: 'Posted 3 comments in r/30PlusSkinCare', status: 'completed', time: '5 min ago' },
          { agent: 'Analytics Bot', task: 'Updated Email Metrics table', status: 'completed', time: '12 min ago' },
          { agent: 'Content Analyzer', task: 'Extracted insights from 10 trending posts', status: 'completed', time: '18 min ago' },
          { agent: 'Hyperbrowser Agent', task: 'Answer Upwork questions', status: 'failed', time: '25 min ago' },
          { agent: 'Reddit Scout', task: 'Posted 2 comments in r/SkincareAddiction', status: 'completed', time: '1 hour ago' }
        ];

        setTasks(recentTasks);
      } catch (err) {
        console.error('Error fetching agent data:', err);
      }
    };

    fetchAgentData();
    const interval = setInterval(fetchAgentData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Agent Dashboard</h1>
          <p className="text-xs text-gray-400">Real-time agent monitoring · 5 agents deployed</p>
        </div>
        <Link 
          href="/"
          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* AGENT CARDS GRID - 5 agents */}
      <div className="grid grid-cols-5 gap-3 mb-4">
        {agents.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{agent.avatar}</span>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white">{agent.name}</h3>
                <p className="text-xs text-gray-400">{agent.role}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs px-2 py-0.5 rounded ${
                agent.status === 'active' ? 'bg-green-500/20 text-green-300' :
                agent.status === 'error' ? 'bg-red-500/20 text-red-300' :
                'bg-gray-500/20 text-gray-300'
              }`}>
                {agent.status}
              </span>
              <span className="text-xs text-gray-400">{agent.tasksCompleted} tasks</span>
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Success Rate</span>
                <span>{agent.successRate}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div 
                  className="h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ width: `${agent.successRate}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">{agent.currentTask}</p>
          </motion.div>
        ))}
      </div>

      {/* TASK ACTIVITY LOG */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-white mb-3">Recent Agent Activity</h2>
        <div className="space-y-2">
          {tasks.map((task, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between bg-white/5 rounded p-3"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-purple-400">{task.agent}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    task.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {task.status}
                  </span>
                </div>
                <p className="text-sm text-gray-300">{task.task}</p>
              </div>
              <span className="text-xs text-gray-500">{task.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
