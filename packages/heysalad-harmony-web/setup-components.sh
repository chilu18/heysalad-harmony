#!/bin/bash

# Run this script from your heysalad-agents directory
# bash setup-components.sh

cd ~/heysalad-agents

echo "🔧 Setting up HeySalad Agents Components"
echo "======================================"
echo ""

# Create directories
echo "📁 Creating directories..."
mkdir -p src/components/layout
mkdir -p src/components/dashboard
echo "✅ Directories created"
echo ""

# Create Sidebar
echo "📝 Creating Sidebar.tsx..."
cat > src/components/layout/Sidebar.tsx << 'EOF'
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Phone,
  Settings,
  BarChart3,
  Users,
  Zap,
  LogOut,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    {
      label: 'Operations',
      icon: <LayoutDashboard className="w-5 h-5" />,
      href: '/',
      highlight: true,
    },
    {
      label: 'Calls',
      icon: <Phone className="w-5 h-5" />,
      href: '/calls',
    },
    {
      label: 'Agents',
      icon: <Zap className="w-5 h-5" />,
      href: '/agents',
    },
    {
      label: 'Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      href: '/analytics',
    },
    {
      label: 'Team',
      icon: <Users className="w-5 h-5" />,
      href: '/team',
    },
    {
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      href: '/settings',
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="https://heysalad.app/HeySalad%20Logo%20Black.png"
            alt="HeySalad"
            className="w-8 h-8"
          />
          <span className="font-bold text-lg text-gray-900">HeySalad</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              isActive(item.href)
                ? item.highlight
                  ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-600 border-l-4 border-red-600'
                  : 'bg-gray-100 text-gray-900 border-l-4 border-gray-900'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            {item.icon}
            <span className="font-medium text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 space-y-2">
        <p className="text-xs text-gray-600 text-center">
          Managed by HeySalad® Ops Team
        </p>
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
EOF
echo "✅ Sidebar.tsx created"
echo ""

# Create Header
echo "📝 Creating Header.tsx..."
cat > src/components/layout/Header.tsx << 'EOF'
export function Header() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Operations</h1>
            <p className="text-gray-600 text-sm mt-1">
              Live heartbeat of agents, calls, and orders
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Status</p>
            <div className="text-lg font-semibold text-green-600 flex items-center justify-end gap-2 mt-1">
              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
              Online
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF
echo "✅ Header.tsx created"
echo ""

# Create MainLayout
echo "📝 Creating MainLayout.tsx..."
cat > src/components/layout/MainLayout.tsx << 'EOF'
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
EOF
echo "✅ MainLayout.tsx created"
echo ""

# Create CallsManagement
echo "📝 Creating CallsManagement.tsx..."
cat > src/components/dashboard/CallsManagement.tsx << 'EOF'
'use client';

import { useState, useEffect } from 'react';
import { Phone, PhoneOff, Clock, Users, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface Call {
  id: string;
  from: string;
  to: string;
  duration: number;
  status: 'active' | 'ringing' | 'completed';
  agentType: 'ai' | 'human';
  startTime: string;
  transcript?: string;
}

interface Stats {
  activeCallsAI: number;
  activeCallsHuman: number;
  totalCallsToday: number;
  averageWaitTime: number;
  callSuccessRate: number;
}

export function CallsManagement() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [stats, setStats] = useState<Stats>({
    activeCallsAI: 0,
    activeCallsHuman: 0,
    totalCallsToday: 0,
    averageWaitTime: 0,
    callSuccessRate: 0,
  });
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalls();
    const interval = setInterval(fetchCalls, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchCalls = async () => {
    try {
      const response = await fetch('/api/calls');
      const data = await response.json();
      setCalls(data.calls || []);
      
      const aiCalls = (data.calls || []).filter((c: Call) => c.agentType === 'ai' && c.status === 'active').length;
      const humanCalls = (data.calls || []).filter((c: Call) => c.agentType === 'human' && c.status === 'active').length;
      
      setStats({
        activeCallsAI: aiCalls,
        activeCallsHuman: humanCalls,
        totalCallsToday: data.calls?.length || 0,
        averageWaitTime: 45,
        callSuccessRate: 92,
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch calls:', error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calls Management</h1>
          <p className="text-gray-600 mt-1">Live heartbeat of AI and human agents</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          icon={<Phone className="w-6 h-6 text-purple-600" />}
          label="AI Active"
          value={stats.activeCallsAI}
          subtext="Autonomous"
        />
        <StatCard
          icon={<Users className="w-6 h-6 text-blue-600" />}
          label="Human Active"
          value={stats.activeCallsHuman}
          subtext="Available"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          label="Success Rate"
          value={`${stats.callSuccessRate}%`}
          subtext="Today"
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-orange-600" />}
          label="Avg Wait"
          value={`${stats.averageWaitTime}s`}
          subtext="Response time"
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6 text-gray-600" />}
          label="Total Calls"
          value={stats.totalCallsToday}
          subtext="This session"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Active Calls</h2>
              <p className="text-sm text-gray-600 mt-1">
                {calls.length} call{calls.length !== 1 ? 's' : ''} in progress
              </p>
            </div>

            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-600">Loading calls...</div>
              ) : calls.length === 0 ? (
                <div className="p-12 text-center">
                  <Phone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">No active calls</p>
                  <p className="text-sm text-gray-500 mt-1">Calls will appear here when customers call</p>
                </div>
              ) : (
                calls.map((call) => (
                  <div
                    key={call.id}
                    onClick={() => setSelectedCall(call)}
                    className={`p-4 cursor-pointer transition hover:bg-gray-50 border-l-4 ${
                      call.agentType === 'ai'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-blue-500 bg-blue-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Phone className="w-4 h-4 text-gray-600" />
                          <span className="font-mono font-semibold text-gray-900">{call.from}</span>
                          {call.agentType === 'ai' ? (
                            <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                              AI
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                              Human
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">Calling {call.to}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-2 text-gray-700 font-mono">
                          <Clock className="w-4 h-4" />
                          <span>{formatDuration(call.duration)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-fit">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Call Details</h3>
          </div>

          {selectedCall ? (
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-gray-600">From</label>
                <p className="text-lg font-mono font-semibold text-gray-900 mt-1">{selectedCall.from}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">To</label>
                <p className="text-lg font-mono font-semibold text-gray-900 mt-1">{selectedCall.to}</p>
              </div>
              <div className="pt-4 border-t border-gray-200 flex gap-2">
                <button className="flex-1 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition text-sm font-medium">
                  Transfer
                </button>
                <button className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm font-medium">
                  End Call
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">Select a call to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subtext }: any) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtext}</p>
        </div>
        <div className="p-2 bg-gray-50 rounded">{icon}</div>
      </div>
    </div>
  );
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}
EOF
echo "✅ CallsManagement.tsx created"
echo ""

# Update page.tsx
echo "📝 Updating src/app/page.tsx..."
cat > src/app/page.tsx << 'EOF'
import { MainLayout } from '@/components/layout/MainLayout';
import { CallsManagement } from '@/components/dashboard/CallsManagement';

export default function Home() {
  return (
    <MainLayout>
      <CallsManagement />
    </MainLayout>
  );
}
EOF
echo "✅ page.tsx updated"
echo ""

echo "=========================================="
echo "✅ All components created successfully!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Restart your dev server: npm run dev"
echo "2. Visit http://localhost:3000"
echo "3. You should see the professional dashboard!"
echo ""
