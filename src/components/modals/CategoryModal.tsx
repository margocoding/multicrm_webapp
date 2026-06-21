import { Modal } from '../ui/Modal';
import type { Category } from '../../api/categories.api';
import { CategoryForm, type CategoryFormData } from '../forms/CategoryForm';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  category?: Category | null;
  categories: Category[];
  onSubmit: (data: CategoryFormData) => void;
  isSubmitting: boolean;
}

export function CategoryModal({
  isOpen,
  onClose,
  mode,
  category,
  categories,
  onSubmit,
  isSubmitting,
}: CategoryModalProps) {
  const title = mode === 'create' ? 'Создать категорию' : 'Редактировать категорию';
  const submitLabel = isSubmitting
    ? mode === 'create' ? 'Создание...' : 'Сохранение...'
    : mode === 'create' ? 'Создать' : 'Сохранить';

  // При редактировании корневой — не даём сделать её дочерней
  const isRootBeingEdited = mode === 'edit' && category && !category.parentId;
  const filteredCategories = isRootBeingEdited
    ? categories.filter(c => c.id !== category.id)
    : categories;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isSubmitting && onClose()}
      title={title}
      size="md"
    >
      <CategoryForm
        categories={filteredCategories}
        initialValues={mode === 'edit' ? category ?? undefined : undefined}
        onSubmit={onSubmit}
        onCancel={onClose}
        submitLabel={submitLabel}
        disabled={isSubmitting}
      />
    </Modal>
  );
}