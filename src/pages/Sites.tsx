import { AnimatePresence, motion } from 'framer-motion';
import { Globe, Pencil, Plus, Search, Trash2, LayoutGrid, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { sitesApi } from '../api/sites.api';
import type { SiteFormData } from '../components/forms/SiteForm';
import { SiteModal } from '../components/modals/SiteModal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Loading } from '../components/ui/Loading';
import { Pagination } from '../components/ui/Pagination';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../components/ui/Table';
import type { Site } from '../types';

export function Sites() {
  const [sites, setSites] = useState<Site[]>([]);
  const [total, setTotal] = useState(0);

  const [siteModal, setSiteModal] = useState<{
    mode: 'create' | 'edit';
    site?: Site | null;
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemsPerPage = 10;

  const loadSites = async () => {
    setIsLoading(true);
    try {
      const response = await sitesApi.getAll({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery || undefined,
      });
      setSites(response.items);
      setTotal(response.total);
    } catch (error) {
      toast.error('Не удалось загрузить сайты');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSites();
  }, [currentPage, searchQuery]);

  const totalPages = Math.ceil(total / itemsPerPage);

  const handleSiteSubmit = async (data: SiteFormData) => {
    const isEdit = siteModal?.mode === 'edit';
    setIsSubmitting(true);
    try {
      if (isEdit && siteModal?.site) {
        await sitesApi.update(siteModal.site.id, {
          name: data.name,
          domain: data.domain,
          type: data.type,
        });
        toast.success('Сайт успешно обновлен');
      } else {
        await sitesApi.create({
          name: data.name,
          domain: data.domain,
          type: data.type,
        });
        toast.success('Сайт успешно создан');
      }
      setSiteModal(null);
      loadSites();
    } catch (error) {
      toast.error(isEdit ? 'Не удалось обновить сайт' : 'Не удалось создать сайт');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSite = async (id: string) => {
    try {
      await sitesApi.remove(id);
      toast.success('Сайт успешно удален');
      loadSites();
    } catch (error) {
      toast.error('Не удалось удалить сайт');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white">Сайты</h1>
          <p className="text-gray-400 text-sm mt-1">Управление сайтами и доменами</p>
        </div>
        <Button
          onClick={() => setSiteModal({ mode: 'create' })}
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          <span className="hidden sm:inline">Новый сайт</span>
          <span className="sm:hidden">Сайт</span>
        </Button>
      </div>

      <div className="glass rounded-xl border border-white/5 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
          <div className="w-full sm:flex-1 min-w-50 max-w-md">
            <Input
              placeholder="Поиск сайтов..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl border border-white/5 relative overflow-hidden"
      >
        {isLoading ? (
          <Loading variant="overlay" size="lg" text="Загрузка сайтов..." fullHeight />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell variant="header">Название</TableCell>
                  <TableCell variant="header" className="hidden sm:table-cell">Домен</TableCell>
                  <TableCell variant="header" className="hidden md:table-cell">Тип</TableCell>
                  <TableCell variant="header" className="hidden lg:table-cell">Контент</TableCell>
                  <TableCell variant="header">Статус</TableCell>
                  <TableCell variant="header" className="text-right">Действия</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {sites.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2 text-gray-500">
                          <Globe className="w-8 h-8" />
                          <p className="text-sm">Сайты не найдены</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sites.map((site, index) => (
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
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-background-dark shrink-0 flex items-center justify-center">
                              <Globe className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-white font-medium text-sm lg:text-base truncate">
                                {site.name}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {new Date(site.createdAt).toLocaleDateString('ru-RU')}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="text-sm text-gray-300">{site.domain}</span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                            {site.type === 'product' ? (
                              <><LayoutGrid className="w-3 h-3" /> Товары</>
                            ) : (
                              <><FileText className="w-3 h-3" /> Статьи</>
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-3 text-sm text-gray-300">
                            <span>{site.productsCount} товаров</span>
                            <span className="text-gray-600">•</span>
                            <span>{site.articlesCount} статей</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={site.status} size="sm" />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1.5 h-auto"
                              onClick={() => setSiteModal({ mode: 'edit', site })}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1.5 h-auto hover:bg-red-500/10 hover:text-red-500"
                              onClick={() => handleDeleteSite(site.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>

            {/* 1. Используем вынесенный компонент пагинации */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              total={total}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              itemName="сайтов"
            />
          </>
        )}
      </motion.div>

      {/* 3. Модалка создания/редактирования */}
      <SiteModal
        isOpen={siteModal !== null}
        onClose={() => setSiteModal(null)}
        mode={siteModal?.mode ?? 'create'}
        site={siteModal?.site}
        onSubmit={handleSiteSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}