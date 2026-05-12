import { Settings as SettingsIcon, Moon, Bell, Database } from 'lucide-react';

export function Settings() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Configure your system preferences</p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance */}
        <div className="glass rounded-xl border border-white/5 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Moon className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-white">Appearance</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Dark Theme</p>
                <p className="text-gray-400 text-sm">Use dark mode interface</p>
              </div>
              <button className="w-12 h-6 bg-accent rounded-full relative">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Compact Mode</p>
                <p className="text-gray-400 text-sm">Reduce spacing in tables</p>
              </div>
              <button className="w-12 h-6 bg-background-dark border border-white/20 rounded-full relative">
                <span className="absolute left-1 top-1 w-4 h-4 bg-gray-400 rounded-full transition-all"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass rounded-xl border border-white/5 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-white">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Import Complete</p>
                <p className="text-gray-400 text-sm">Notify when imports finish</p>
              </div>
              <button className="w-12 h-6 bg-accent rounded-full relative">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Sync Errors</p>
                <p className="text-gray-400 text-sm">Alert on sync failures</p>
              </div>
              <button className="w-12 h-6 bg-accent rounded-full relative">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="glass rounded-xl border border-white/5 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-white">Data Management</h2>
          </div>
          <div className="space-y-4">
            <button className="w-full px-4 py-3 bg-background-dark border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors text-left">
              <p className="font-medium">Export All Data</p>
              <p className="text-gray-400 text-sm mt-1">Download complete data backup</p>
            </button>
            <button className="w-full px-4 py-3 bg-background-dark border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors text-left">
              <p className="font-medium">Clear Cache</p>
              <p className="text-gray-400 text-sm mt-1">Remove temporary files</p>
            </button>
          </div>
        </div>

        {/* System Info */}
        <div className="glass rounded-xl border border-white/5 p-6">
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-white">System Information</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Version</span>
              <span className="text-white">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Build</span>
              <span className="text-white">2024.01.15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Environment</span>
              <span className="text-green-500">Production</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Last Sync</span>
              <span className="text-white">Just now</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
