import { AnimatePresence, motion } from "framer-motion";
import {
  FolderTree,
  Gauge,
  Globe,
  ImageOff,
  Package,
  Pencil,
  Plus,
  Search,
  Tag,
  Trash2,
  Wrench
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { Category } from "../api/categories.api";
import { categoriesApi } from "../api/categories.api";
import type {
  Characteristic,
  Product,
  ProductCondition,
} from "../api/products.api";
import { productsApi } from "../api/products.api";
import { sitesApi } from "../api/sites.api";
import type { ProductFormData } from "../components/forms/ProductForm";
import { CategoriesModal } from "../components/modals/AllCategoriesModal";
import { ProductModal } from "../components/modals/ProductModal";
import { Button } from "../components/ui/Button";
import { Loading } from "../components/ui/Loading";
import { Modal } from "../components/ui/Modal";
import { Pagination } from "../components/ui/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/Table";
import { getImageUrl } from "../lib/utils";
import type { Site } from "../types";

const PRICE_UNIT_SYMBOLS: Record<string, string> = {
  RUB: "₽",
  USD: "$",
  EUR: "€",
};

const CONDITION_CONFIG: Record<
  ProductCondition,
  { label: string; classes: string }
> = {
  NEW: { label: "Новый", classes: "bg-emerald-500/10 text-emerald-400" },
  USED: { label: "Б/У", classes: "bg-amber-500/10 text-amber-400" },
  REFURBISHED: {
    label: "Восстановленный",
    classes: "bg-blue-500/10 text-blue-400",
  },
  RESERVED: { label: "Резерв", classes: "bg-purple-500/10 text-purple-400" },
};

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);

  const [productModal, setProductModal] = useState<{
    mode: "create" | "edit";
    product?: Product | null;
  } | null>(null);

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSites, setIsLoadingSites] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const itemsPerPage = 10;

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const response = await productsApi.getAll({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery || undefined,
      });
      setProducts(response.items);
      setTotal(response.total);
    } catch (error) {
      toast.error("Не удалось загрузить товары");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSites = async () => {
    setIsLoadingSites(true);
    try {
      const response = await sitesApi.getAll({ limit: 100 });
      setSites(response.items);
    } catch (error) {
      toast.error("Не удалось загрузить сайты");
    } finally {
      setIsLoadingSites(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (error) {
      toast.error("Не удалось загрузить категории");
    }
  };

  useEffect(() => {
    loadProducts();
  }, [currentPage, searchQuery]);

  useEffect(() => {
    loadSites();
    loadCategories();
  }, []);

  const totalPages = Math.ceil(total / itemsPerPage);

  const getCategoryDisplay = (categoryId?: string | null) => {
    if (!categoryId) return null;

    for (const root of categories) {
      if (root.id === categoryId) {
        return { name: root.name, isChild: false };
      }
      if (root.children) {
        const child = root.children.find((c) => c.id === categoryId);
        if (child) {
          return { name: `${root.name} / ${child.name}`, isChild: true };
        }
      }
    }

    return null;
  };

  const formatCharacteristics = (chars: Characteristic[], maxLength = 40) => {
    if (!chars || chars.length === 0) return "—";

    const preview = chars
      .slice(0, 3)
      .map((c) => `${c.title}: ${c.value}`)
      .join(" • ");

    if (preview.length <= maxLength || chars.length <= 3) {
      return preview;
    }

    return preview.slice(0, maxLength - 3) + "...";
  };

  const handleProductSubmit = async (data: ProductFormData) => {
    const isEdit = productModal?.mode === "edit";
    setIsSubmitting(true);
    try {
      const payload = {
        name: data.name,
        subtitle: data.subtitle,
        price: data.price,
        priceUnit: data.priceUnit,
        quantity: data.quantity,
        unit: data.unit,
        condition: data.condition,
        categoryId: data.categoryId ?? null,
        siteIds: data.siteIds,
        image: data.image,
        characteristics: data.characteristics,
      };

      if (isEdit && productModal?.product) {
        await productsApi.update(productModal.product.id, payload);
        toast.success("Товар успешно обновлен");
      } else {
        await productsApi.create(payload);
        toast.success("Товар успешно создан");
      }
      setProductModal(null);
      loadProducts();
    } catch (error) {
      toast.error(
        isEdit ? "Не удалось обновить товар" : "Не удалось создать товар",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (idOrSlug: string) => {
    try {
      await productsApi.remove(idOrSlug);
      toast.success("Товар успешно удален");
      loadProducts();
    } catch (error) {
      toast.error("Не удалось удалить товар");
    }
  };

  const handlePublishToSite = async (siteId: string) => {
    if (!selectedProduct) return;
    setIsPublishing(true);
    try {
      await productsApi.publishToSite({
        productId: selectedProduct.id,
        siteId,
        isPublished: true,
      });
      toast.success("Товар опубликован на сайте");
      setIsPublishModalOpen(false);
      loadProducts();
    } catch (error) {
      toast.error("Не удалось опубликовать товар");
    } finally {
      setIsPublishing(false);
    }
  };

  const formatPrice = (price: string, unit: string) => {
    const symbol = PRICE_UNIT_SYMBOLS[unit] || unit;
    return `${price} ${symbol}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white">Товары</h1>
          <p className="text-gray-400 text-sm mt-1">
            Управление каталогом товаров
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsCategoriesModalOpen(true)}
            size="sm"
            variant="secondary"
            leftIcon={<FolderTree className="w-4 h-4" />}
          >
            <span className="hidden sm:inline">Категории</span>
          </Button>
          <Button
            onClick={() => setProductModal({ mode: "create" })}
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            <span className="hidden sm:inline">Новый товар</span>
            <span className="sm:hidden">Товар</span>
          </Button>
        </div>
      </div>

      <div className="glass rounded-xl border border-white/5 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
          <div className="relative w-full sm:flex-1 min-w-50 max-w-md">
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
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl border border-white/5 relative overflow-hidden"
      >
        {isLoading ? (
          <Loading
            variant="overlay"
            size="lg"
            text="Загрузка товаров..."
            fullHeight
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell variant="header">Товар</TableCell>
                  <TableCell variant="header" className="hidden md:table-cell">
                    Категория
                  </TableCell>
                  <TableCell variant="header">Цена</TableCell>
                  <TableCell variant="header" className="hidden md:table-cell">
                    Состояние
                  </TableCell>
                  <TableCell variant="header" className="hidden lg:table-cell">
                    Опубликовано
                  </TableCell>
                  <TableCell variant="header" className="text-right">
                    Действия
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell className="text-center py-12" colSpan={6}>
                        <div className="flex flex-col items-center gap-2 text-gray-500">
                          <Package className="w-8 h-8" />
                          <p className="text-sm">Товары не найдены</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product, index) => {
                      const categoryDisplay = getCategoryDisplay(
                        product.categoryId,
                      );
                      const conditionCfg = CONDITION_CONFIG[product.condition];

                      return (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{
                            backgroundColor: "rgba(220, 38, 38, 0.05)",
                          }}
                          className="table-row-hover"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-background-dark shrink-0">
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-background-dark shrink-0 flex items-center justify-center">
                                  {product.image ? (
                                    <img
                                      src={getImageUrl(product.image)}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <ImageOff
                                      className="w-5 h-5 text-gray-600"
                                      strokeWidth={1.5}
                                    />
                                  )}
                                </div>
                              </div>
                              <div className="min-w-0">
                                <p className="text-white font-medium text-sm lg:text-base truncate">
                                  {product.name}
                                </p>
                                <p className="text-gray-500 text-xs truncate max-w-37.5 lg:max-w-55">
                                  {product.subtitle ||
                                    formatCharacteristics(
                                      product.characteristics,
                                    )}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/5 text-gray-400">
                                    <Gauge className="w-3 h-3" />
                                    {product.unit}
                                  </span>
                                  {product.characteristics.length > 0 && (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/5 text-gray-400">
                                      <Tag className="w-3 h-3" />
                                      {product.characteristics.length} хар.
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell max-w-50">
                            {categoryDisplay ? (
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap overflow-hidden max-w-full ${
                                  categoryDisplay.isChild
                                    ? "bg-purple-500/10 text-purple-400"
                                    : "bg-indigo-500/10 text-indigo-400"
                                }`}
                                title={categoryDisplay.name}
                              >
                                <FolderTree className="w-3 h-3 shrink-0" />
                                <span className="truncate">
                                  {categoryDisplay.name}
                                </span>
                              </span>
                            ) : (
                              <span className="text-xs text-gray-500">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-xs lg:text-sm text-white font-medium whitespace-nowrap">
                            {formatPrice(product.price, product.priceUnit)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${conditionCfg.classes}`}
                            >
                              <Wrench className="w-3 h-3" />
                              {conditionCfg.label}
                            </span>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-300">
                                {product.publishedSitesCount}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-2">
                              {product.publishedSitesCount === 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-1.5 h-auto"
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setIsPublishModalOpen(true);
                                  }}
                                  title="Опубликовать на сайте"
                                >
                                  <Globe className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-1.5 h-auto"
                                onClick={() =>
                                  setProductModal({ mode: "edit", product })
                                }
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-1.5 h-auto hover:bg-red-500/10 hover:text-red-500"
                                onClick={() =>
                                  handleDeleteProduct(product.slug)
                                }
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      );
                    })
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              total={total}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              itemName="товаров"
            />
          </>
        )}
      </motion.div>

      <ProductModal
        isOpen={productModal !== null}
        onClose={() => setProductModal(null)}
        mode={productModal?.mode ?? "create"}
        product={productModal?.product}
        sites={sites}
        categories={categories}
        onSubmit={handleProductSubmit}
        isSubmitting={isSubmitting}
      />

      <Modal
        isOpen={isPublishModalOpen}
        onClose={() => !isPublishing && setIsPublishModalOpen(false)}
        title="Опубликовать на сайте"
        size="md"
      >
        <div className="space-y-4 relative">
          {isPublishing && (
            <Loading variant="overlay" size="md" text="Публикация..." />
          )}
          <p className="text-sm text-gray-400">
            Выберите сайт, на котором хотите опубликовать товар "
            {selectedProduct?.name}"
          </p>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {isLoadingSites ? (
              <div className="py-8 flex justify-center">
                <Loading
                  variant="spinner"
                  size="md"
                  text="Загрузка сайтов..."
                />
              </div>
            ) : sites.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Нет доступных сайтов
              </p>
            ) : (
              sites.map((site) => (
                <button
                  key={site.id}
                  onClick={() => handlePublishToSite(site.id)}
                  disabled={isPublishing}
                  className="w-full p-4 bg-background-dark border border-white/10 rounded-lg hover:border-red-500/50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{site.name}</p>
                      <p className="text-gray-400 text-sm">{site.domain}</p>
                    </div>
                    <Globe className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
              ))
            )}
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setIsPublishModalOpen(false)}
              disabled={isPublishing}
              className="flex-1"
            >
              Отмена
            </Button>
          </div>
        </div>
      </Modal>

      <CategoriesModal
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
        onChanged={loadCategories}
      />
    </div>
  );
}
