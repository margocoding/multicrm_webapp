import {
  Package,
  RussianRubleIcon,
  FolderTree,
  Box,
  Plus,
  Trash2,
  Gauge,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import type { Product, Characteristic, ProductCondition } from "../../api/products.api";
import type { Category } from "../../api/categories.api";
import { Button } from "../ui/Button";
import { ImageUploader } from "../ui/ImageUploader";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { getImageUrl } from "../../lib/utils";
import type { Site } from "../../types";

export interface ProductFormData {
  name: string;
  subtitle?: string;
  price: string;
  priceUnit: string;
  quantity: number;
  unit: string;
  condition: ProductCondition;
  categoryId?: string | null;
  siteIds?: string[];
  image?: File | null;
  characteristics: Characteristic[];
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
  { value: "RUB", label: "₽ RUB" },
  { value: "USD", label: "$ USD" },
  { value: "EUR", label: "€ EUR" },
];

const CONDITION_OPTIONS = [
  { value: "NEW", label: "Новый" },
  { value: "USED", label: "Б/У" },
  { value: "REFURBISHED", label: "Восстановленный" },
  { value: "RESERVED", label: "Резерв" },
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
      name: "",
      subtitle: "",
      price: "",
      priceUnit: "RUB",
      quantity: 0,
      unit: "шт",
      condition: "NEW",
      categoryId: null,
      siteIds: [],
      image: null,
      characteristics: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "characteristics",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    getImageUrl(initialValues?.image as string) || null,
  );

  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name || "",
        subtitle: initialValues.subtitle || "",
        price: initialValues.price || "",
        priceUnit: initialValues.priceUnit || "RUB",
        quantity: initialValues.quantity ?? 0,
        unit: initialValues.unit || "шт",
        condition: initialValues.condition || "NEW",
        categoryId: initialValues.categoryId || null,
        siteIds: (initialValues.siteIds as string[]) || [],
        image: null,
        characteristics: initialValues.characteristics || [],
      });
      setImagePreview(getImageUrl(initialValues.image as string) || null);
    } else {
      reset({
        name: "",
        subtitle: "",
        price: "",
        priceUnit: "RUB",
        quantity: 0,
        unit: "шт",
        condition: "NEW",
        categoryId: null,
        siteIds: [],
        image: null,
        characteristics: [],
      });
      setImagePreview(null);
    }
    setImageFile(null);
  }, [initialValues, reset]);

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    setValue("image", file);
  };

  const siteOptions = sites.map((s) => ({ value: s.id, label: s.name }));

  const categoryOptions = [
    { value: "__none__", label: "— Без категории —" },
    ...categories.flatMap((cat) => [
      { value: cat.id, label: cat.name },
      ...(cat.children || []).map((child) => ({
        value: child.id,
        label: `↳ ${child.name}`,
      })),
    ]),
  ];

  const handleAddCharacteristic = () => {
    append({ title: "", value: "" });
  };

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
        rules={{ required: "Название обязательно" }}
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
            value={field.value ?? "__none__"}
            onChange={(v) => field.onChange(v === "__none__" ? null : v)}
            placeholder="Выберите категорию"
            leftIcon={<FolderTree className="w-4 h-4" />}
            disabled={disabled}
          />
        )}
      />

      <div className="grid grid-cols-3 gap-4">
        <Controller
          name="price"
          control={control}
          rules={{ required: "Цена обязательна" }}
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
          rules={{ required: "Валюта обязательна" }}
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
            required: "Количество обязательно",
            min: { value: 0, message: "Не может быть меньше 0" },
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

      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="unit"
          control={control}
          rules={{ required: "Единица измерения обязательна" }}
          render={({ field }) => (
            <Input
              label="Единица измерения"
              type="text"
              placeholder="шт, т, кг, пог.м"
              leftIcon={<Gauge className="w-4 h-4" />}
              disabled={disabled}
              {...field}
            />
          )}
        />
        <Controller
          name="condition"
          control={control}
          rules={{ required: "Состояние обязательно" }}
          render={({ field }) => (
            <Select
              label="Состояние товара"
              options={CONDITION_OPTIONS}
              value={field.value}
              onChange={(v) => field.onChange(v)}
              leftIcon={<Wrench className="w-4 h-4" />}
              disabled={disabled}
            />
          )}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">
            Характеристики
          </label>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAddCharacteristic}
            disabled={disabled}
          >
            <Plus className="w-4 h-4" />
            <span>Добавить</span>
          </Button>
        </div>

        {fields.length === 0 && (
          <p className="text-sm text-gray-500 italic py-3 text-center border border-dashed border-white/10 rounded-lg">
            Характеристики не добавлены
          </p>
        )}

        <div className="space-y-2">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-start gap-3 glass rounded-lg border border-white/10 p-3"
            >
              <Controller
                name={`characteristics.${index}.title`}
                control={control}
                rules={{ required: "Название обязательно" }}
                render={({ field: f, fieldState }) => (
                  <Input
                    placeholder="Например, Вес"
                    disabled={disabled}
                    error={fieldState.error?.message}
                    className="flex-1"
                    {...f}
                  />
                )}
              />
              <Controller
                name={`characteristics.${index}.value`}
                control={control}
                rules={{ required: "Значение обязательно" }}
                render={({ field: f, fieldState }) => (
                  <Input
                    placeholder="Например, 2.5 кг"
                    disabled={disabled}
                    error={fieldState.error?.message}
                    className="flex-1"
                    {...f}
                  />
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="p-2 h-auto shrink-0 hover:bg-red-500/10 hover:text-red-500"
                onClick={() => remove(index)}
                disabled={disabled}
                title="Удалить характеристику"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
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