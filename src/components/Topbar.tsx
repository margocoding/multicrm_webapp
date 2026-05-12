import { Search, Bell, RefreshCw } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export function Topbar() {
  const { searchQuery, setSearchQuery } = useAppStore();

  return (
    <header className="h-16 glass border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search products, sites, articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background-dark border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 transition-colors"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Sync Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
          <RefreshCw className="w-3.5 h-3.5 text-green-500 animate-spin-slow" />
          <span className="text-xs text-green-500 font-medium">Synced</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
        </button>

        {/* Profile */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center cursor-pointer">
          <span className="text-white text-sm font-bold">A</span>
        </div>
      </div>
    </header>
  );
}
