import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Globe, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { Site } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';

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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white">Сайты</h1>
          <p className="text-gray-400 text-sm mt-1">Управление сетью ваших сайтов</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          <span className="hidden sm:inline">Новый сайт</span>
          <span className="sm:hidden">Сайт</span>
        </Button>
      </div>

      {/* Фильтры */}
      <div className="glass rounded-xl border border-white/5 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative w-full sm:flex-1 sm:max-w-md">
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
        className="glass rounded-xl border border-white/5"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell variant="header">Название</TableCell>
              <TableCell variant="header">Домен</TableCell>
              <TableCell variant="header">Тип</TableCell>
              <TableCell variant="header" className="hidden sm:table-cell">Товары</TableCell>
              <TableCell variant="header" className="hidden sm:table-cell">Статьи</TableCell>
              <TableCell variant="header">Статус</TableCell>
              <TableCell variant="header" className="text-right">Действия</TableCell>
            </TableRow>
            </TableHeader>
            <TableBody>
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
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent/10 rounded-lg flex-shrink-0">
                          <Globe className="w-4 h-4 text-accent" />
                        </div>
                        <span className="text-white font-medium text-sm lg:text-base">{site.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs lg:text-sm text-gray-400">{site.domain}</TableCell>
                    <TableCell>
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        site.type === 'product' ? 'bg-purple-500/10 text-purple-500' : 'bg-cyan-500/10 text-cyan-500'
                      }`}>
                        {site.type === 'product' ? 'Товарный' : 'Статейный'}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs lg:text-sm text-gray-400 hidden sm:table-cell">{Math.floor(Math.random() * 500)}</TableCell>
                    <TableCell className="text-xs lg:text-sm text-gray-400 hidden sm:table-cell">{Math.floor(Math.random() * 50)}</TableCell>
                    <TableCell>
                      <StatusBadge status="live" size="sm" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="p-1.5 h-auto">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-1.5 h-auto hover:bg-red-500/10 hover:text-red-500"
                          onClick={() => deleteSite(site.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>

        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 lg:px-6 py-4 border-t border-white/5 gap-4">
            <p className="text-xs lg:text-sm text-gray-400 text-center sm:text-left">
              Показано {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredSites.length)} из {filteredSites.length} сайтов
            </p>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${
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
                className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
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
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
              Отмена
            </Button>
            <Button onClick={handleCreateSite} className="flex-1">
              Создать сайт
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
