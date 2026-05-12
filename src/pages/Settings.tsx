import { Database, Settings as SettingsIcon } from "lucide-react";

export function Settings() {
  return (
    <div className="space-y-6">
      {/* Заголовок страницы */}
      <div>
        <h1 className="text-2xl font-bold text-white">Настройки</h1>
        <p className="text-gray-400 text-sm mt-1">
          Настройка параметров системы
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Управление данными */}
        <div className="glass rounded-xl border border-white/5 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-white">
              Управление данными
            </h2>
          </div>
          <div className="space-y-4">
            <button className="w-full px-4 py-3 bg-background-dark border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors text-left">
              <p className="font-medium">Экспорт всех данных</p>
              <p className="text-gray-400 text-sm mt-1">
                Скачать полную резервную копию
              </p>
            </button>
            <button className="w-full px-4 py-3 bg-background-dark border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors text-left">
              <p className="font-medium">Очистить кэш</p>
              <p className="text-gray-400 text-sm mt-1">
                Удалить временные файлы
              </p>
            </button>
          </div>
        </div>

        {/* Информация о системе */}
        <div className="glass rounded-xl border border-white/5 p-6">
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-white">
              Информация о системе
            </h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Версия</span>
              <span className="text-white">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Сборка</span>
              <span className="text-white">2024.01.15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Окружение</span>
              <span className="text-green-500">Production</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Последняя синхронизация</span>
              <span className="text-white">Только что</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
