import {
  Package,
  RussianRubleIcon,
  Ruler,
  Scale,
  Tag,
  FolderTree,
  Box,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { Product } from '../../api/products.api';
import type { Site } from '../../api/sites.api';
import type { Category } from '../../api/categories.api';
import { Button } from '../ui/Button';
import { ImageUploader } from '../ui/ImageUploader';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { getImageUrl } from '../../lib/utils';

export interface ProductFormData {
  name: string;
  subtitle?: string;
  standard?: string;
  length?: string;
  weight?: string;
  price: string;
  priceUnit: string;
  quantity: number;
  categoryId?: string | null;
  siteIds?: string[];
  image?: File | null;
}

interface ProductFormProps {
  initialValues?: Partial<Product> & { siteIds?: string[] };
  sites: Site[];
  categories: Category[];
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  submitLabel: string;
  disabled?: boolean;
}

const PRICE_UNIT_OPTIONS = [
  { value: 'RUB', label: '₽ RUB' },
  { value: 'USD', label: '$ USD' },
  { value: 'EUR', label: '€ EUR' },
];

export function ProductForm({
  initialValues,
  sites,
  categories,
  onSubmit,
  onCancel,
  submitLabel,
  disabled = false,
}: ProductFormProps) {
  const { control, handleSubmit, reset, setValue } = useForm<ProductFormData>({
    defaultValues: {
      name: '',
      subtitle: '',
      standard: '',
      length: '',
      weight: '',
      price: '',
      priceUnit: 'RUB',
      quantity: 0,
      categoryId: null,
      siteIds: [],
      image: null,
    },
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    getImageUrl(initialValues?.image as string) || null,
  );

  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name || '',
        subtitle: initialValues.subtitle || '',
        standard: initialValues.standard || '',
        length: initialValues.length || '',
        weight: initialValues.weight || '',
        price: initialValues.price || '',
        priceUnit: initialValues.priceUnit || 'RUB',
        quantity: initialValues.quantity ?? 0,
        categoryId: initialValues.categoryId || null,
        siteIds: (initialValues.siteIds as string[]) || [],
        image: null,
      });
      setImagePreview(getImageUrl(initialValues.image as string) || null);
    } else {
      reset({
        name: '',
        subtitle: '',
        standard: '',
        length: '',
        weight: '',
        price: '',
        priceUnit: 'RUB',
        quantity: 0,
        categoryId: null,
        siteIds: [],
        image: null,
      });
      setImagePreview(null);
    }
    setImageFile(null);
  }, [initialValues, reset]);

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    setValue('image', file);
  };

  const siteOptions = sites.map((s) => ({ value: s.id, label: s.name }));

  const categoryOptions = [
    { value: '__none__', label: '— Без категории —' },
    ...categories.flatMap((cat) => [
      { value: cat.id, label: cat.name },
      ...(cat.children || []).map((child) => ({
        value: child.id,
        label: `↳ ${child.name}`,
      })),
    ]),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <ImageUploader
        file={imageFile}
        initialPreviewUrl={imagePreview}
        onChange={handleImageChange}
        disabled={disabled}
      />

      <Controller
        name="name"
        control={control}
        rules={{ required: 'Название обязательно' }}
        render={({ field }) => (
          <Input
            label="Название товара"
            type="text"
            placeholder="Введите название товара"
            leftIcon={<Package className="w-4 h-4" />}
            disabled={disabled}
            {...field}
          />
        )}
      />

      <Controller
        name="subtitle"
        control={control}
        render={({ field }) => (
          <Textarea
            label="Подзаголовок / Краткое описание"
            placeholder="Краткое описание товара"
            rows={2}
            disabled={disabled}
            {...field}
          />
        )}
      />

      <Controller
        name="categoryId"
        control={control}
        render={({ field }) => (
          <Select
            label="Категория"
            options={categoryOptions}
            value={field.value ?? '__none__'}
            onChange={(v) => field.onChange(v === '__none__' ? null : v)}
            placeholder="Выберите категорию"
            leftIcon={<FolderTree className="w-4 h-4" />}
            disabled={disabled}
          />
        )}
      />

      <div className="grid grid-cols-3 gap-4">
        <Controller
          name="standard"
          control={control}
          render={({ field }) => (
            <Input
              label="Стандарт"
              type="text"
              placeholder="Например, VESA"
              leftIcon={<Tag className="w-4 h-4" />}
              disabled={disabled}
              {...field}
            />
          )}
        />
        <Controller
          name="length"
          control={control}
          render={({ field }) => (
            <Input
              label="Длина"
              type="text"
              placeholder="Например, 1000 мм"
              leftIcon={<Ruler className="w-4 h-4" />}
              disabled={disabled}
              {...field}
            />
          )}
        />
        <Controller
          name="weight"
          control={control}
          render={({ field }) => (
            <Input
              label="Вес"
              type="text"
              placeholder="Например, 2.5 кг"
              leftIcon={<Scale className="w-4 h-4" />}
              disabled={disabled}
              {...field}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Controller
          name="price"
          control={control}
          rules={{ required: 'Цена обязательна' }}
          render={({ field }) => (
            <Input
              label="Цена"
              type="text"
              placeholder="1500"
              rightIcon={<RussianRubleIcon className="w-4 h-4" />}
              disabled={disabled}
              {...field}
            />
          )}
        />
        <Controller
          name="priceUnit"
          control={control}
          rules={{ required: 'Единица обязательна' }}
          render={({ field }) => (
            <Select
              label="Валюта"
              options={PRICE_UNIT_OPTIONS}
              value={field.value}
              onChange={(v) => field.onChange(v)}
              placeholder="Выберите валюту"
              disabled={disabled}
            />
          )}
        />
        <Controller
          name="quantity"
          control={control}
          rules={{
            required: 'Количество обязательно',
            min: { value: 0, message: 'Не может быть меньше 0' },
          }}
          render={({ field, fieldState }) => (
            <Input
              label="Количество на складе"
              type="number"
              placeholder="0"
              leftIcon={<Box className="w-4 h-4" />}
              disabled={disabled}
              error={fieldState.error?.message}
              value={field.value}
              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
          )}
        />
      </div>

      <Controller
        name="siteIds"
        control={control}
        render={({ field }) => (
          <Select
            label="Сайты для публикации"
            options={siteOptions}
            value={field.value || []}
            onChange={(v) => field.onChange(v as string[])}
            placeholder="Выберите сайты"
            multiple
            disabled={disabled}
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