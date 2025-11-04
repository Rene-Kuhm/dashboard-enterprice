'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import {
  LayoutDashboard,
  Users,
  Shield,
  BarChart3,
  Bell,
  FileText,
  Settings,
  User,
  Sparkles,
} from 'lucide-react';

const menuItems = [
  { href: '/dashboard-temp', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard-temp/users', label: 'Users', icon: Users },
  { href: '/dashboard-temp/roles', label: 'Roles', icon: Shield },
  { href: '/dashboard-temp/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard-temp/notifications', label: 'Notifications', icon: Bell },
  { href: '/dashboard-temp/files', label: 'Files', icon: FileText },
  { href: '/dashboard-temp/settings', label: 'Settings', icon: Settings },
  { href: '/dashboard-temp/profile', label: 'Profile', icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-72 md:flex-col relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950" />

      {/* Animated Gradient Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 backdrop-blur-3xl bg-white/5" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex h-20 items-center px-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur-lg opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Enterprise
              </h1>
              <p className="text-xs text-gray-400">Dashboard Pro</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300',
                  isActive
                    ? 'text-white'
                    : 'text-gray-300 hover:text-white'
                )}
              >
                {/* Active Indicator */}
                {isActive && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 rounded-xl" />
                    <div className="absolute inset-0 bg-white/10 rounded-xl backdrop-blur-sm" />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-500 via-blue-500 to-pink-500 rounded-r-full" />
                  </>
                )}

                {/* Hover Effect */}
                {!isActive && (
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-xl transition-all duration-300" />
                )}

                {/* Icon with Gradient on Active */}
                <div className={cn(
                  "relative z-10 transition-transform duration-300 group-hover:scale-110",
                  isActive && "drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                )}>
                  <Icon className={cn(
                    "h-5 w-5 transition-colors",
                    isActive
                      ? "text-white"
                      : "text-gray-400 group-hover:text-white"
                  )} />
                </div>

                {/* Label */}
                <span className="relative z-10">{item.label}</span>

                {/* Shine Effect on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section - Upgrade Card */}
        <div className="p-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-pink-500/20 p-4 backdrop-blur-sm border border-white/10">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <h3 className="text-sm font-semibold text-white">Upgrade to Pro</h3>
              </div>
              <p className="text-xs text-gray-300 mb-3">
                Unlock advanced features and analytics
              </p>
              <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white text-xs font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
