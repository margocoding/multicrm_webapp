import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Loading } from '../ui/Loading';
import type { Product, ProductDetails } from '../../api/products.api';
import { productsApi } from '../../api/products.api';
import type { Site } from '../../api/sites.api';
import type { Category } from '../../api/categories.api';
import { ProductForm, type ProductFormData } from '../forms/ProductForm';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  product?: Product | null;
  sites: Site[];
  categories: Category[];
  onSubmit: (data: ProductFormData) => void;
  isSubmitting: boolean;
}

export function ProductModal({
  isOpen,
  onClose,
  mode,
  product,
  sites,
  categories,
  onSubmit,
  isSubmitting,
}: ProductModalProps) {
  const [detailedProduct, setDetailedProduct] = useState<ProductDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const title = mode === 'create' ? 'Создать новый товар' : 'Редактировать товар';
  const submitLabel = isSubmitting
    ? mode === 'create'
      ? 'Создание...'
      : 'Сохранение...'
    : mode === 'create'
    ? 'Создать товар'
    : 'Сохранить изменения';

  useEffect(() => {
    if (isOpen && mode === 'edit' && product?.id) {
      setIsLoadingDetails(true);
      productsApi
        .getById(product.id)
        .then(setDetailedProduct)
        .catch(console.error)
        .finally(() => setIsLoadingDetails(false));
    } else if (!isOpen) {
      setDetailedProduct(null);
    }
  }, [isOpen, mode, product?.id]);

  const initialValues =
    mode === 'edit' && detailedProduct
      ? {
          ...detailedProduct,
          siteIds: detailedProduct.publishedSites?.map((s) => s.id) || [],
        }
      : undefined;

  const showLoading = mode === 'edit' && (isLoadingDetails || !detailedProduct);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isSubmitting && onClose()}
      title={title}
      size="lg"
    >
      <div className="relative">
        {isSubmitting && <Loading variant="overlay" size="md" text={submitLabel} />}
        {showLoading ? (
          <div className="flex justify-center py-12">
            <Loading variant="spinner" size="md" text="Загрузка товара..." />
          </div>
        ) : (
          <ProductForm
            initialValues={initialValues}
            sites={sites}
            categories={categories}
            onSubmit={onSubmit}
            onCancel={onClose}
            submitLabel={submitLabel}
            disabled={isSubmitting}
          />
        )}
      </div>
    </Modal>
  );
}