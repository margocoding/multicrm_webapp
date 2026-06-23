import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  Lock,
  Settings as SettingsIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/Button";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";

export function Settings() {
  const { user } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Пароли не совпадают" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Пароль должен содержать минимум 6 символов",
      });
      return;
    }

    setIsLoading(true);
    try {
      await authApi.changePassword(currentPassword, newPassword);
      setMessage({ type: "success", text: "Пароль успешно изменен" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Ошибка при изменении пароля",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Настройки</h1>
        <p className="text-gray-400 text-sm mt-1">
          Настройка параметров системы
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Смена пароля */}
        <div className="glass rounded-xl border border-white/5 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-white">Безопасность</h2>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-lg p-4 flex items-start gap-3 ${
                  message.type === "success"
                    ? "bg-green-500/10 border border-green-500/20"
                    : "bg-red-500/10 border border-red-500/20"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                )}
                <p
                  className={`text-sm ${message.type === "success" ? "text-green-400" : "text-red-400"}`}
                >
                  {message.text}
                </p>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Текущий пароль
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 bg-background-dark border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
                placeholder="Введите текущий пароль"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Новый пароль
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-background-dark border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
                placeholder="Минимум 6 символов"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Подтвердите новый пароль
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-background-dark border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
                placeholder="Повторите новый пароль"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Изменение..." : "Изменить пароль"}
            </Button>
          </form>
        </div>

        {/* Информация о пользователе */}
        <div className="glass rounded-xl border border-white/5 p-6">
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-white">
              Профиль пользователя
            </h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Имя пользователя</span>
              <span className="text-white">{user?.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">ID</span>
              <span className="text-white font-mono text-xs">{user?.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Дата создания</span>
              <span className="text-white">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("ru-RU")
                  : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Управление данными */}
        {/* <div className="glass rounded-xl border border-white/5 p-6">
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
        </div> */}
      </div>
    </div>
  );
}
