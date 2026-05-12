import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, Package, ExternalLink } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { Product } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';

export function Products() {
  const { products, productSites, addProduct, deleteProduct } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const itemsPerPage = 10;

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    title: '',
    description: '',
    price: 0,
    category: '',
  });

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPublishedSitesCount = (productId: string) => {
    return productSites.filter(ps => ps.productId === productId && ps.isPublished).length;
  };

  const handleCreateProduct = () => {
    if (newProduct.title && newProduct.price) {
      addProduct({
        id: `product-${Date.now()}`,
        externalId: Math.random().toString(36).substring(2, 14).toUpperCase(),
        title: newProduct.title,
        description: newProduct.description || '',
        price: newProduct.price,
        image: `https://picsum.photos/seed/${Date.now()}/200/200`,
        category: newProduct.category || 'General',
      });
      setNewProduct({ title: '', description: '', price: 0, category: '' });
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Товары</h1>
          <p className="text-gray-400 text-sm mt-1">Управление каталогом товаров</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors glow-red-hover"
        >
          <Plus className="w-4 h-4" />
          Новый товар
        </button>
      </div>

      {/* Filters */}
      <div className="glass rounded-xl border border-white/5 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-background-dark border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-background-dark border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-accent/50 transition-colors"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'Все категории' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl border border-white/5 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-background-dark/50">
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Товар</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Категория</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Цена</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Внешний ID</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Опубликовано на сайтах</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Статус</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {paginatedProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ backgroundColor: 'rgba(220, 38, 38, 0.05)' }}
                    className="table-row-hover"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-background-dark">
                          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{product.title}</p>
                          <p className="text-gray-500 text-xs truncate max-w-[200px]">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white font-medium">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs font-mono">
                        <ExternalLink className="w-3 h-3" />
                        {product.externalId}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">{getPublishedSitesCount(product.id)} сайтов</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={getPublishedSitesCount(product.id) > 0 ? 'published' : 'draft'} size="sm" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
            <p className="text-sm text-gray-400">
              Показано {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)} из {filteredProducts.length} товаров
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                return (
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
                );
              })}
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

      {/* Create Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Создать новый товар"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Название товара</label>
            <input
              type="text"
              value={newProduct.title}
              onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
              placeholder="Введите название товара"
              className="w-full px-4 py-2 bg-background-dark border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Описание</label>
            <textarea
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              placeholder="Введите описание товара"
              rows={3}
              className="w-full px-4 py-2 bg-background-dark border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 transition-colors resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Цена</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                step="0.01"
                className="w-full px-4 py-2 bg-background-dark border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Категория</label>
              <input
                type="text"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                placeholder="Введите категорию"
                className="w-full px-4 py-2 bg-background-dark border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 transition-colors"
              />
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
              onClick={handleCreateProduct}
              className="flex-1 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors"
            >
              Создать товар
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
