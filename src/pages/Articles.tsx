import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { Article } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';


export function Articles() {
  const { articles, articleSites, addArticle, deleteArticle } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [newArticle, setNewArticle] = useState<Partial<Article>>({
    title: '',
    content: '',
  });

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPublishedSitesCount = (articleId: string) => {
    return articleSites.filter(as => as.articleId === articleId).length;
  };

  const handleCreateArticle = () => {
    if (newArticle.title) {
      addArticle({
        id: `article-${Date.now()}`,
        title: newArticle.title,
        content: newArticle.content || '',
        createdAt: new Date().toISOString(),
      });
      setNewArticle({ title: '', content: '' });
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок страницы */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white">Статьи</h1>
          <p className="text-gray-400 text-sm mt-1">Управление контентными статьями</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          <span className="hidden sm:inline">Новая статья</span>
          <span className="sm:hidden">Статья</span>
        </Button>
      </div>

      {/* Фильтры */}
      <div className="glass rounded-xl border border-white/5 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative w-full sm:flex-1 sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Поиск статей..."
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell variant="header">Заголовок</TableCell>
                <TableCell variant="header" className="hidden sm:table-cell">Создана</TableCell>
                <TableCell variant="header">Опубликовано на сайтах</TableCell>
                <TableCell variant="header">Статус</TableCell>
                <TableCell variant="header" className="text-right">Действия</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {paginatedArticles.map((article, index) => (
                      <motion.tr
                        key={article.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ backgroundColor: 'rgba(220, 38, 38, 0.05)' }}
                        className="table-row-hover"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-cyan-500/10 rounded-lg flex-shrink-0">
                              <FileText className="w-4 h-4 text-cyan-500" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-white font-medium text-sm lg:text-base truncate">{article.title}</p>
                              <p className="text-gray-500 text-xs truncate max-w-[200px] lg:max-w-[400px]">{article.content.substring(0, 100)}...</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs lg:text-sm text-gray-400 hidden sm:table-cell">{new Date(article.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className="text-xs lg:text-sm text-gray-300">{getPublishedSitesCount(article.id)} сайт.</span>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={getPublishedSitesCount(article.id) > 0 ? 'published' : 'draft'} size="sm" />
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
                              onClick={() => deleteArticle(article.id)}
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
            </div>

        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 lg:px-6 py-4 border-t border-white/5 gap-4">
            <p className="text-xs lg:text-sm text-gray-400 text-center sm:text-left">
              Показано {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredArticles.length)} из {filteredArticles.length} статей
            </p>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(page => (
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

      {/* Модальное окно создания статьи */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Создание новой статьи"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Заголовок</label>
            <input
              type="text"
              value={newArticle.title}
              onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
              placeholder="Введите заголовок статьи"
              className="w-full px-4 py-2 bg-background-dark border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Содержание</label>
            <textarea
              value={newArticle.content}
              onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
              placeholder="Напишите содержание статьи..."
              rows={8}
              className="w-full px-4 py-2 bg-background-dark border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 transition-colors resize-none font-mono text-sm"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
              Отмена
            </Button>
            <Button onClick={handleCreateArticle} className="flex-1">
              Создать статью
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
