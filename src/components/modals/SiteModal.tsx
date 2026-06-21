import { Modal } from '../ui/Modal';
import { Loading } from '../ui/Loading';
import { SiteForm, type SiteFormData } from '../forms/SiteForm';
import type { Site } from '../../types';

interface SiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  site?: Site | null;
  onSubmit: (data: SiteFormData) => void;
  isSubmitting: boolean;
}

export function SiteModal({
  isOpen,
  onClose,
  mode,
  site,
  onSubmit,
  isSubmitting,
}: SiteModalProps) {
  const title = mode === 'create' ? 'Создать новый сайт' : 'Редактировать сайт';
  const submitLabel = isSubmitting
    ? mode === 'create'
      ? 'Создание...'
      : 'Сохранение...'
    : mode === 'create'
    ? 'Создать сайт'
    : 'Сохранить изменения';

  const initialValues = mode === 'edit' && site ? site : undefined;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isSubmitting && onClose()}
      title={title}
      size="lg"
    >
      <div className="relative">
        {isSubmitting && <Loading variant="overlay" size="md" text={submitLabel} />}
        <SiteForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          onCancel={onClose}
          submitLabel={submitLabel}
          disabled={isSubmitting}
        />
      </div>
    </Modal>
  );
}