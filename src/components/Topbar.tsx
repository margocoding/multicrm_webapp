import { RefreshCw } from "lucide-react";
import { Avatar } from "./ui/Avatar";
import { Badge } from "./ui/Badge";

export function Topbar() {
  return (
    <header className="h-16 bg-[#0B1120]/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1"></div>

      {/* Right side */}
      <div className="flex items-center gap-3 lg:gap-4">
        {/* Sync Status - hidden on mobile */}
        <Badge variant="success" size="sm" glow className="hidden sm:flex">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-3 h-3 animate-spin-slow" />
            <span className="hidden md:inline">Все системы работают</span>
          </div>
        </Badge>

        {/* Divider - hidden on mobile */}
        <div className="w-px h-8 bg-white/10 hidden sm:block"></div>

        {/* Profile */}
        <div className="flex items-center gap-2 lg:gap-3 pl-2 cursor-pointer group">
          <Avatar fallback="A" size="md" />
          <div className="hidden lg:block">
            <p className="text-white font-medium text-sm group-hover:text-red-400 transition-colors">
              Администратор
            </p>
            <p className="text-gray-500 text-xs">admin@vsp.ru</p>
          </div>
        </div>
      </div>
    </header>
  );
}
