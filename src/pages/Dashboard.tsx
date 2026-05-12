import { motion } from 'framer-motion';
import { Globe, Package, FileUp, FileText, Activity } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { KPICard } from '../components/KPICard';
import { StatusBadge } from '../components/StatusBadge';

export function Dashboard() {
  const { sites, products, imports, articles, activityLogs } = useAppStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Overview of your multi-site network</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Active Sites"
          value={sites.length}
          change="+2 this month"
          trend="up"
          icon={<Globe className="w-5 h-5" />}
        />
        <KPICard
          title="Total Products"
          value={products.length}
          change="+124 this week"
          trend="up"
          icon={<Package className="w-5 h-5" />}
        />
        <KPICard
          title="Active Imports"
          value={imports.filter(i => i.status === 'processing').length}
          change={`${imports.filter(i => i.status === 'completed').length} completed`}
          trend="neutral"
          icon={<FileUp className="w-5 h-5" />}
        />
        <KPICard
          title="Published Articles"
          value={articles.length}
          change="+5 today"
          trend="up"
          icon={<FileText className="w-5 h-5" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Imports */}
        <motion.div
          variants={containerVariants}
          className="lg:col-span-2 glass rounded-xl border border-white/5 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Latest Imports</h2>
            <StatusBadge status="synced" size="sm" />
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {imports.slice(0, 5).map((imp) => (
                <motion.div
                  key={imp.id}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-3 bg-background-dark/50 rounded-lg border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${imp.type === 'xml' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}>
                      <FileUp className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{imp.name}</p>
                      <p className="text-gray-500 text-xs">{new Date(imp.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 text-sm">{imp.productsCount} products</span>
                    <StatusBadge 
                      status={imp.status === 'completed' ? 'synced' : imp.status === 'processing' ? 'processing' : 'failed'} 
                      size="sm" 
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          variants={containerVariants}
          className="glass rounded-xl border border-white/5 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
            <Activity className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-white">Activity Feed</h2>
          </div>
          <div className="p-6">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10"></div>
              
              <div className="space-y-4">
                {activityLogs.slice(0, 8).map((log, index) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative pl-8"
                  >
                    {/* Timeline dot */}
                    <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center ${
                      log.type === 'success' ? 'bg-green-500/20 text-green-500' :
                      log.type === 'error' ? 'bg-red-500/20 text-red-500' :
                      log.type === 'warning' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-blue-500/20 text-blue-500'
                    }`}>
                      <div className="w-2 h-2 rounded-full bg-current"></div>
                    </div>
                    
                    <div>
                      <p className="text-gray-300 text-sm">{log.message}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sites Overview */}
      <motion.div
        variants={containerVariants}
        className="glass rounded-xl border border-white/5 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">Sites Overview</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Site Name</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Domain</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sites.map((site) => (
                <motion.tr
                  key={site.id}
                  whileHover={{ backgroundColor: 'rgba(220, 38, 38, 0.05)' }}
                  className="table-row-hover"
                >
                  <td className="px-6 py-4 text-sm text-white font-medium">{site.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{site.domain}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      site.type === 'product' ? 'bg-purple-500/10 text-purple-500' : 'bg-cyan-500/10 text-cyan-500'
                    }`}>
                      {site.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status="live" size="sm" />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
