import { motion } from 'framer-motion';
import { Globe, Package, FileUp, FileText, Activity } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { KPICard } from '../components/ui/KPICard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Card, CardContent } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';

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
      {/* Заголовок страницы */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white">Панель управления</h1>
          <p className="text-gray-400 text-sm mt-1">Обзор сети ваших сайтов</p>
        </div>
      </div>

      {/* KPI карточки */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Активные сайты"
          value={sites.length}
          change="+2 за месяц"
          trend="up"
          icon={<Globe className="w-5 h-5" />}
        />
        <KPICard
          title="Всего товаров"
          value={products.length}
          change="+124 за неделю"
          trend="up"
          icon={<Package className="w-5 h-5" />}
        />
        <KPICard
          title="Активные импорты"
          value={imports.filter(i => i.status === 'processing').length}
          change={`${imports.filter(i => i.status === 'completed').length} завершено`}
          trend="neutral"
          icon={<FileUp className="w-5 h-5" />}
        />
        <KPICard
          title="Опубликовано статей"
          value={articles.length}
          change="+5 сегодня"
          trend="up"
          icon={<FileText className="w-5 h-5" />}
        />
      </div>

      {/* Основная сетка контента */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Последние импорты */}
        <motion.div variants={containerVariants} className="lg:col-span-2">
          <Card>
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Последние импорты</h2>
              <StatusBadge status="synced" size="sm" />
            </div>
            <CardContent>
              <div className="space-y-3">
                {imports.slice(0, 5).map((imp) => (
                  <motion.div
                    key={imp.id}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg border border-white/5"
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
                      <span className="text-gray-400 text-sm">{imp.productsCount} тов.</span>
                      <StatusBadge 
                        status={imp.status === 'completed' ? 'synced' : imp.status === 'processing' ? 'processing' : 'failed'} 
                        size="sm" 
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Лента активности */}
        <motion.div variants={containerVariants}>
          <Card>
            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-400" />
              <h2 className="text-lg font-semibold text-white">Лента активности</h2>
            </div>
            <CardContent>
              <div className="relative">
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
                      <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center ${
                        log.type === 'success' ? 'bg-emerald-500/20 text-emerald-500' :
                        log.type === 'error' ? 'bg-red-500/20 text-red-500' :
                        log.type === 'warning' ? 'bg-amber-500/20 text-amber-500' :
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
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Обзор сайтов */}
      <motion.div variants={containerVariants}>
        <Card>
          <div className="px-4 lg:px-6 py-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">Обзор сайтов</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell variant="header">Название сайта</TableCell>
                  <TableCell variant="header">Домен</TableCell>
                  <TableCell variant="header">Тип</TableCell>
                  <TableCell variant="header">Статус</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sites.map((site) => (
                  <TableRow key={site.id}>
                    <TableCell className="font-medium text-white">{site.name}</TableCell>
                    <TableCell className="text-gray-400">{site.domain}</TableCell>
                    <TableCell>
                      <Badge variant={site.type === 'product' ? 'info' : 'neutral'} size="sm">
                        {site.type === 'product' ? 'Товарный' : 'Статейный'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status="live" size="sm" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
