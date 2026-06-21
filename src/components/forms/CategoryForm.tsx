import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Tag } from 'lucide-react';
import type { Category } from '../../api/categories.api';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

export interface CategoryFormData {
  name: string;
  parentId?: string | null;
}

interface CategoryFormProps {
  categories: Category[];
  initialValues?: Partial<Category>;
  onSubmit: (data: CategoryFormData) => void;
  onCancel: () => void;
  submitLabel: string;
  disabled?: boolean;
}

export function CategoryForm({
  categories,
  initialValues,
  onSubmit,
  onCancel,
  submitLabel,
  disabled = false,
}: CategoryFormProps) {
  const { control, handleSubmit, reset } = useForm<CategoryFormData>({
    defaultValues: {
      name: '',
      parentId: null,
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name || '',
        parentId: initialValues.parentId || null,
      });
    } else {
      reset({ name: '', parentId: null });
    }
  }, [initialValues, reset]);

  // Только корневые категории могут быть родителями (2 уровня)
  const rootCategories = categories.filter((c) => !c.parentId);
  const parentOptions = [
    { value: '__root__', label: '— Корневая категория —' },
    ...rootCategories.map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Controller
        name="name"
        control={control}
        rules={{ required: 'Название обязательно' }}
        render={({ field, fieldState }) => (
          <Input
            label="Название категории"
            type="text"
            placeholder="Например, Рельсы"
            leftIcon={<Tag className="w-4 h-4" />}
            disabled={disabled}
            error={fieldState.error?.message}
            {...field}
          />
        )}
      />

      <Controller
        name="parentId"
        control={control}
        render={({ field }) => (
          <Select
            label="Родительская категория"
            options={parentOptions}
            value={field.value ?? '__root__'}
            onChange={(v) => field.onChange(v === '__root__' ? null : v)}
            placeholder="Выберите родителя"
            disabled={disabled || initialValues?.id !== undefined && !initialValues.parentId && rootCategories.some(c => c.id === initialValues.id)}
          />
        )}
      />

      <div className="flex gap-3 pt-4 border-t border-white/10 mt-6">
        <Button
          variant="secondary"
          type="button"
          onClick={onCancel}
          disabled={disabled}
          className="flex-1"
        >
          Отмена
        </Button>
        <Button type="submit" disabled={disabled} className="flex-1">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}