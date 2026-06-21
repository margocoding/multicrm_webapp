import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FolderTree, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import type { Category } from '../../api/categories.api';
import { categoriesApi } from '../../api/categories.api';
import { Button } from '../ui/Button';
import { Loading } from '../ui/Loading';
import { Modal } from '../ui/Modal';
import { CategoryModal } from './CategoryModal';

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChanged?: () => void;
}

export function CategoriesModal({ isOpen, onClose, onChanged }: CategoriesModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categoryModal, setCategoryModal] = useState<{
    mode: 'create' | 'edit';
    category?: Category | null;
  } | null>(null);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (error) {
      toast.error('Не удалось загрузить категории');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) loadCategories();
  }, [isOpen]);

  const handleCategorySubmit = async (data: { name: string; parentId?: string | null }) => {
    const isEdit = categoryModal?.mode === 'edit';
    setIsSubmitting(true);
    try {
      if (isEdit && categoryModal?.category) {
        await categoriesApi.update(categoryModal.category.id, {
          name: data.name,
          parentId: data.parentId,
        });
        toast.success('Категория обновлена');
      } else {
        await categoriesApi.create({
          name: data.name,
          parentId: data.parentId,
        });
        toast.success('Категория создана');
      }
      setCategoryModal(null);
      loadCategories();
      onChanged?.();
    } catch (error: any) {
      const msg = error?.response?.data?.message;
      toast.error(
        Array.isArray(msg) ? msg[0] : msg || 'Не удалось сохранить категорию'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    const hasChildren = category.children && category.children.length > 0;
    const hasProducts = category.productsCount > 0;

    if (hasChildren) {
      toast.error('Сначала удалите или перенесите подкатегории');
      return;
    }

    if (hasProducts) {
      const confirmed = window.confirm(
        `В категории "${category.name}" есть товары (${category.productsCount}). Удалить категорию? Товары останутся без категории.`
      );
      if (!confirmed) return;
    } else {
      const confirmed = window.confirm(`Удалить категорию "${category.name}"?`);
      if (!confirmed) return;
    }

    try {
      await categoriesApi.remove(category.id);
      toast.success('Категория удалена');
      loadCategories();
      onChanged?.();
    } catch (error: any) {
      const msg = error?.response?.data?.message;
      toast.error(
        Array.isArray(msg) ? msg[0] : msg || 'Не удалось удалить категорию'
      );
    }
  };

  const rootCategories = categories.filter(c => !c.parentId);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => !isSubmitting && onClose()}
        title="Управление категориями"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Закрыть
            </Button>
            <Button
              onClick={() => setCategoryModal({ mode: 'create' })}
              leftIcon={<Plus className="w-4 h-4" />}
              disabled={isSubmitting}
            >
              Новая категория
            </Button>
          </div>
        }
      >
        <div className="relative">
          {isLoading ? (
            <div className="py-12">
              <Loading variant="spinner" size="md" text="Загрузка категорий..." />
            </div>
          ) : rootCategories.length === 0 ? (
            <div className="text-center py-12">
              <FolderTree className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">Категорий пока нет</p>
              <p className="text-gray-500 text-sm mt-1">Создайте первую категорию</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              <AnimatePresence>
                {rootCategories.map((root) => (
                  <motion.div
                    key={root.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-background-dark border border-white/5 rounded-lg overflow-hidden"
                  >
                    {/* Корневая категория */}
                    <div className="flex items-center justify-between p-3 hover:bg-white/2 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <FolderTree className="w-4 h-4 text-red-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-white font-medium text-sm truncate">
                            {root.name}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {root.productsCount} товаров
                            {root.children && root.children.length > 0 && (
                              <span> • {root.children.length} подкатегорий</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1.5 h-auto"
                          onClick={() => setCategoryModal({ mode: 'edit', category: root })}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1.5 h-auto hover:bg-red-500/10 hover:text-red-500"
                          onClick={() => handleDeleteCategory(root)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Подкатегории */}
                    {root.children && root.children.length > 0 && (
                      <div className="border-t border-white/5 pl-8 pr-3 py-1">
                        {root.children.map((child) => (
                          <div
                            key={child.id}
                            className="flex items-center justify-between p-2 hover:bg-white/2 transition-colors rounded"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-4" />
                              <div className="min-w-0">
                                <p className="text-gray-200 text-sm truncate">
                                  {child.name}
                                </p>
                                <p className="text-gray-500 text-xs">
                                  {child.productsCount} товаров
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-1.5 h-auto"
                                onClick={() =>
                                  setCategoryModal({
                                    mode: 'edit',
                                    category: {
                                      id: child.id,
                                      name: child.name,
                                      parentId: root.id,
                                      productsCount: child.productsCount,
                                      createdAt: '',
                                    },
                                  })
                                }
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-1.5 h-auto hover:bg-red-500/10 hover:text-red-500"
                                onClick={() =>
                                  handleDeleteCategory({
                                    id: child.id,
                                    name: child.name,
                                    parentId: root.id,
                                    productsCount: child.productsCount,
                                    createdAt: '',
                                  })
                                }
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </Modal>

      <CategoryModal
        isOpen={categoryModal !== null}
        onClose={() => setCategoryModal(null)}
        mode={categoryModal?.mode ?? 'create'}
        category={categoryModal?.category}
        categories={categories}
        onSubmit={handleCategorySubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );
}