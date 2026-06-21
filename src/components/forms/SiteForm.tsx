import { useForm, Controller } from 'react-hook-form';
import { useEffect } from 'react';
import { Globe } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import type { Site } from '../../types';

export interface SiteFormData {
  name: string;
  domain: string;
  type: 'product' | 'article';
}

interface SiteFormProps {
  initialValues?: Partial<Site>;
  onSubmit: (data: SiteFormData) => void;
  onCancel: () => void;
  submitLabel: string;
  disabled?: boolean;
}

export function SiteForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel,
  disabled = false,
}: SiteFormProps) {
  const { control, handleSubmit, reset } = useForm<SiteFormData>({
    defaultValues: {
      name: '',
      domain: '',
      type: 'product',
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name || '',
        domain: initialValues.domain || '',
        type: initialValues.type || 'product',
      });
    } else {
      reset({
        name: '',
        domain: '',
        type: 'product',
      });
    }
  }, [initialValues, reset]);

  const typeOptions = [
    { value: 'product', label: 'Товары' },
    { value: 'article', label: 'Статьи' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Controller
        name="name"
        control={control}
        rules={{ required: 'Название обязательно' }}
        render={({ field }) => (
          <Input
            label="Название сайта"
            type="text"
            placeholder="Введите название"
            leftIcon={<Globe className="w-4 h-4" />}
            disabled={disabled}
            {...field}
          />
        )}
      />

      <Controller
        name="domain"
        control={control}
        rules={{ required: 'Домен обязателен' }}
        render={({ field }) => (
          <Input
            label="Домен"
            type="text"
            placeholder="example.com"
            disabled={disabled}
            {...field}
          />
        )}
      />

      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <Select
            label="Тип сайта"
            options={typeOptions}
            value={field.value}
            onChange={field.onChange}
            disabled={disabled}
          />
        )}
      />

      <div className="flex gap-3 pt-4 border-t border-white/10 mt-6">
        <Button variant="secondary" type="button" onClick={onCancel} disabled={disabled} className="flex-1">
          Отмена
        </Button>
        <Button type="submit" disabled={disabled} className="flex-1">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}