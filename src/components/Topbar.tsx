import { RefreshCw, LogOut } from "lucide-react";
import { Avatar } from "./ui/Avatar";
import { Badge } from "./ui/Badge";
import { useAuthStore } from "../store/auth.store";

export function Topbar() {
  const logout = useAuthStore((state) => state.logout);

  return (
    <header className="h-16 bg-[#0B1120]/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1"></div>

      <div className="flex items-center gap-3 lg:gap-4">
        <Badge variant="success" size="sm" glow className="hidden sm:flex">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-3 h-3 animate-spin-slow" />
            <span className="hidden md:inline">Все системы работают</span>
          </div>
        </Badge>

        {/* Divider - hidden on mobile */}
        <div className="w-px h-8 bg-white/10 hidden sm:block"></div>

        {/* Profile & Logout */}
        <div className="flex items-center gap-2 lg:gap-3 pl-2 cursor-pointer group">
          <Avatar fallback="A" size="md" />
          <div className="hidden lg:block">
            <p className="text-white font-medium text-sm group-hover:text-red-400 transition-colors">
              Администратор
            </p>
            <p className="text-gray-500 text-xs">admin@vsp.ru</p>
          </div>

          {/* Кнопка выхода */}
          <button
            onClick={logout}
            className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all ml-1"
            title="Выйти из аккаунта"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}