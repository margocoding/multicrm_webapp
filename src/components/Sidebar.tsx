import { NavLink } from 'react-router-dom';
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

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/sites', icon: Globe, label: 'Sites' },
  { path: '/products', icon: Package, label: 'Products' },
  { path: '/imports', icon: FileUp, label: 'Imports' },
  { path: '/articles', icon: FileText, label: 'Articles' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 80 : 260 }}
      className="fixed left-0 top-0 h-full bg-background-light border-r border-white/5 z-50"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
        {!sidebarCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-bold text-white"
          >
            NEXUS<span className="text-accent">CMS</span>
          </motion.span>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-accent/20 text-accent glow-red'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-medium"
              >
                {item.label}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
        <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-accent text-sm font-bold">A</span>
          </div>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm"
            >
              <p className="text-white font-medium">Admin User</p>
              <p className="text-gray-500 text-xs">admin@nexus.com</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
