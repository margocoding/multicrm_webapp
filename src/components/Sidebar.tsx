import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Globe,
  Package,
  FileUp,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { NavLink } from 'react-router-dom';
import { Tooltip } from './ui/Tooltip';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Главная' },
  { path: '/sites', icon: Globe, label: 'Сайты' },
  { path: '/products', icon: Package, label: 'Товары' },
  { path: '/imports', icon: FileUp, label: 'Импорт' },
  { path: '/articles', icon: FileText, label: 'Статьи' },
  { path: '/settings', icon: Settings, label: 'Настройки' },
];

export function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 80 : 260 }}
      className="fixed left-0 top-0 h-full bg-[#111827]/95 backdrop-blur-xl border-r border-white/10 z-50 shadow-2xl"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 bg-gradient-to-r from-[#0B1120] to-[#111827]">
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
              <span className="text-white text-sm font-bold">N</span>
            </div>
            <span className="text-lg font-bold text-white tracking-wide">
              NEXUS<span className="text-red-500">CMS</span>
            </span>
          </motion.div>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 group"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r from-red-600/20 to-red-600/5 text-red-400 border border-red-500/30'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <div className={`relative z-10 p-2 rounded-lg transition-all duration-200 ${
                  isActive ? 'bg-red-500/20 text-red-400' : 'group-hover:bg-white/10'
                }`}>
                  {sidebarCollapsed ? (
                    <Tooltip content={item.label} position="right">
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                    </Tooltip>
                  ) : (
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                  )}
                </div>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative z-10 text-sm font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-gradient-to-t from-[#0B1120] to-transparent">
        <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center ring-2 ring-red-500/30">
            <span className="text-white text-sm font-bold">A</span>
          </div>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="overflow-hidden"
            >
              <p className="text-white font-medium text-sm truncate">Admin User</p>
              <p className="text-gray-500 text-xs truncate">admin@nexus.com</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
