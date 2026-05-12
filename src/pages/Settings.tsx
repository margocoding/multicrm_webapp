import { Settings as SettingsIcon, Moon, Bell, Database } from 'lucide-react';

export function Settings() {
  return (
    <div className="space-y-6">
      {/* Заголовок страницы */}
      <div>
        <h1 className="text-2xl font-bold text-white">Настройки</h1>
        <p className="text-gray-400 text-sm mt-1">Настройка параметров системы</p>
      </div>

      {/* Секции настроек */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Внешний вид */}
        <div className="glass rounded-xl border border-white/5 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Moon className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-white">Внешний вид</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Тёмная тема</p>
                <p className="text-gray-400 text-sm">Использовать тёмный интерфейс</p>
              </div>
              <button className="w-12 h-6 bg-accent rounded-full relative">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Компактный режим</p>
                <p className="text-gray-400 text-sm">Уменьшить отступы в таблицах</p>
              </div>
              <button className="w-12 h-6 bg-background-dark border border-white/20 rounded-full relative">
                <span className="absolute left-1 top-1 w-4 h-4 bg-gray-400 rounded-full transition-all"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Уведомления */}
        <div className="glass rounded-xl border border-white/5 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-white">Уведомления</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Завершение импорта</p>
                <p className="text-gray-400 text-sm">Уведомлять по завершении импорта</p>
              </div>
              <button className="w-12 h-6 bg-accent rounded-full relative">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Ошибки синхронизации</p>
                <p className="text-gray-400 text-sm">Оповещать об ошибках синхронизации</p>
              </div>
              <button className="w-12 h-6 bg-accent rounded-full relative">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Управление данными */}
        <div className="glass rounded-xl border border-white/5 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-white">Управление данными</h2>
          </div>
          <div className="space-y-4">
            <button className="w-full px-4 py-3 bg-background-dark border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors text-left">
              <p className="font-medium">Экспорт всех данных</p>
              <p className="text-gray-400 text-sm mt-1">Скачать полную резервную копию</p>
            </button>
            <button className="w-full px-4 py-3 bg-background-dark border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors text-left">
              <p className="font-medium">Очистить кэш</p>
              <p className="text-gray-400 text-sm mt-1">Удалить временные файлы</p>
            </button>
          </div>
        </div>

        {/* Информация о системе */}
        <div className="glass rounded-xl border border-white/5 p-6">
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-white">Информация о системе</h2>
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
