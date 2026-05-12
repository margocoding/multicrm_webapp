import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Globe, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { Site } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';

type SiteType = 'product' | 'article';

export function Sites() {
  const { sites, addSite, deleteSite } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [newSite, setNewSite] = useState<Partial<Site>>({
    name: '',
    domain: '',
    type: 'product',
  });

  const filteredSites = sites.filter(site =>
    site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSites.length / itemsPerPage);
  const paginatedSites = filteredSites.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreateSite = () => {
    if (newSite.name && newSite.domain) {
      addSite({
        id: `site-${Date.now()}`,
        name: newSite.name,
        domain: newSite.domain,
        type: newSite.type as SiteType,
      });
      setNewSite({ name: '', domain: '', type: 'product' });
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок страницы */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Сайты</h1>
          <p className="text-gray-400 text-sm mt-1">Управление сетью ваших сайтов</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors glow-red-hover"
        >
          <Plus className="w-4 h-4" />
          Новый сайт
        </button>
      </div>

      {/* Фильтры */}
      <div className="glass rounded-xl border border-white/5 p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Поиск сайтов..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-background-dark border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Таблица */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl border border-white/5 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-background-dark/50">
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Название</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Домен</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Тип</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Товары</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Статьи</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Статус</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {paginatedSites.map((site, index) => (
                  <motion.tr
                    key={site.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ backgroundColor: 'rgba(220, 38, 38, 0.05)' }}
                    className="table-row-hover"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent/10 rounded-lg">
                          <Globe className="w-4 h-4 text-accent" />
                        </div>
                        <span className="text-white font-medium">{site.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{site.domain}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        site.type === 'product' ? 'bg-purple-500/10 text-purple-500' : 'bg-cyan-500/10 text-cyan-500'
                      }`}>
                        {site.type === 'product' ? 'Товарный' : 'Статейный'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{Math.floor(Math.random() * 500)}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{Math.floor(Math.random() * 50)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status="live" size="sm" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteSite(site.id)}
                          className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
            <p className="text-sm text-gray-400">
              Показано {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredSites.length)} из {filteredSites.length} сайтов
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-accent text-white'
                      : 'hover:bg-white/10 text-gray-400'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Модальное окно создания сайта */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Создание нового сайта"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Название сайта</label>
            <input
              type="text"
              value={newSite.name}
              onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
              placeholder="Введите название сайта"
              className="w-full px-4 py-2 bg-background-dark border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Домен</label>
            <input
              type="text"
              value={newSite.domain}
              onChange={(e) => setNewSite({ ...newSite, domain: e.target.value })}
              placeholder="example.com"
              className="w-full px-4 py-2 bg-background-dark border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Тип сайта</label>
            <div className="flex gap-3">
              <button
                onClick={() => setNewSite({ ...newSite, type: 'product' })}
                className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                  newSite.type === 'product'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                    : 'bg-background-dark border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                Товарный сайт
              </button>
              <button
                onClick={() => setNewSite({ ...newSite, type: 'article' })}
                className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                  newSite.type === 'article'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                    : 'bg-background-dark border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                Статейный сайт
              </button>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 bg-background-dark border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleCreateSite}
              className="flex-1 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors"
            >
              Создать сайт
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
