import { FileImage, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ImageUploaderProps {
  file: File | null;
  initialPreviewUrl?: string | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

const MAX_SIZE_MB = 15;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];

export function ImageUploader({ file, initialPreviewUrl, onChange, disabled }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(initialPreviewUrl || null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Очистка URL объекта при размонтировании или смене файла для избежания утечек памяти
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileSelect = (selectedFile: File) => {
    setError(null);

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError('Недопустимый формат. Используйте JPG, PNG, GIF или WEBP.');
      return;
    }

    if (selectedFile.size > MAX_SIZE_BYTES) {
      setError(`Файл слишком большой. Максимальный размер: ${MAX_SIZE_MB} МБ.`);
      return;
    }

    onChange(selectedFile);
    
    // Создаем превью для нового файла
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        Изображение товара
      </label>
      
      <div
        onClick={handleClick}
        className={`
          relative group flex flex-col items-center justify-center w-full h-48 
          border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed border-white/10 bg-background-dark/50' : ''}
          ${!disabled && !preview ? 'border-white/20 bg-background-dark hover:border-accent/50 hover:bg-white/5' : ''}
          ${!disabled && preview ? 'border-accent/30 bg-background-dark hover:border-accent/60' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        {preview ? (
          <>
            <img 
              src={preview} 
              alt="Preview" 
              className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-60 group-hover:opacity-40 transition-opacity" 
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <FileImage className="w-10 h-10 text-white mb-2 drop-shadow-md" />
              <span className="text-sm font-medium text-white drop-shadow-md">
                {file ? file.name : 'Текущее изображение'}
              </span>
              {file && (
                <span className="text-xs text-gray-300 mt-1 drop-shadow-md">
                  {(file.size / 1024 / 1024).toFixed(2)} МБ
                </span>
              )}
            </div>
            
            {/* Кнопка удаления */}
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="absolute top-2 right-2 z-20 p-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
              title="Удалить изображение"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-gray-200 transition-colors">
            <div className="p-3 bg-white/5 rounded-full mb-3 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium">Нажмите или перетащите изображение</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, WEBP до {MAX_SIZE_MB} МБ</p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <X className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}