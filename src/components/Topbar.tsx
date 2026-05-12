import { Search, Bell, RefreshCw } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Input, Avatar, Badge } from './ui';

export function Topbar() {
  const { searchQuery, setSearchQuery } = useAppStore();

  return (
    <header className="h-16 bg-[#0B1120]/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96">
          <Input
            type="text"
            placeholder="Search products, sites, articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            className="bg-[#0B1120]/50"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Sync Status */}
        <Badge variant="success" size="sm" glow>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-3 h-3 animate-spin-slow" />
            <span>All Systems Operational</span>
          </div>
        </Badge>

        {/* Notifications */}
        <button className="relative p-2.5 hover:bg-white/10 rounded-xl transition-all duration-200 group">
          <Bell className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#0B1120] animate-pulse"></span>
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-white/10"></div>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
          <Avatar fallback="A" size="md" />
          <div className="hidden lg:block">
            <p className="text-white font-medium text-sm group-hover:text-red-400 transition-colors">Admin User</p>
            <p className="text-gray-500 text-xs">admin@nexus.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
