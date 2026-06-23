import { motion } from "framer-motion";
import {
  Activity,
  FileUp,
  Globe,
  Package,
  ShoppingCart,
} from "lucide-react";
import { useEffect, useState } from "react";

import { importsApi, type ImportBatch } from "../api/imports.api"; // <-- Добавили импорт
import { logsApi, type ActivityLog } from "../api/logs.api";
import { ordersApi, type Order } from "../api/orders.api";
import { productsApi } from "../api/products.api";
import { sitesApi } from "../api/sites.api";

// UI Компоненты
import { Badge } from "../components/ui/Badge";
import { Card, CardContent } from "../components/ui/Card";
import { KPICard } from "../components/ui/KPICard";
import { StatusBadge } from "../components/ui/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/Table";
import type { Site } from "../types";

export function Dashboard() {
  const [sites, setSites] = useState<Site[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [imports, setImports] = useState<ImportBatch[]>([]); // <-- Стейт для импортов
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sitesRes, productsRes, ordersRes, importsRes, logsRes] = await Promise.all([
          sitesApi.getAll({ limit: 100 }),
          productsApi.getAll({ limit: 1 }),
          ordersApi.getAll(),
          importsApi.getAll(), // <-- Добавили запрос импортов
          logsApi.getAll(),
        ]);

        setSites(sitesRes.items);
        setTotalProducts(productsRes.total);
        setOrders(ordersRes);
        setImports(importsRes); // <-- Сохраняем импорты
        setActivityLogs(logsRes);
      } catch (error) {
        console.error("Ошибка загрузки дашборда:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  // Счетчики для KPI
  const newOrdersCount = orders.filter((o) => o.status === "NEW").length;
  const activeImportsCount = imports.filter((i) => i.status === "processing").length;
  const completedImportsCount = imports.filter((i) => i.status === "completed").length;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {/* Заголовок страницы */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white">
            Панель управления
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Обзор сети ваших сайтов и заявок
          </p>
        </div>
      </div>

      {/* KPI карточки */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Всего сайтов"
          value={sites.length}
          change="В системе"
          trend="up"
          icon={<Globe className="w-5 h-5" />}
        />
        <KPICard
          title="Всего товаров"
          value={totalProducts}
          change="В каталоге"
          trend="up"
          icon={<Package className="w-5 h-5" />}
        />
        <KPICard
          title="Активные импорты"
          value={activeImportsCount}
          change={`${completedImportsCount} завершено`}
          trend="neutral"
          icon={<FileUp className="w-5 h-5" />}
        />
        <KPICard
          title="Новые заявки"
          value={newOrdersCount}
          change={`${orders.length} всего`}
          trend={newOrdersCount > 0 ? "up" : "neutral"}
          icon={<ShoppingCart className="w-5 h-5" />}
        />
      </div>

      {/* Основная сетка контента */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Последние импорты */}
        <motion.div variants={containerVariants} className="lg:col-span-2">
          <Card>
            <div className="px-4 lg:px-6 py-4 border-b border-white/10 flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-base lg:text-lg font-semibold text-white">
                Последние импорты
              </h2>
              <StatusBadge status="synced" size="sm" />
            </div>
            <CardContent className="p-4 lg:p-6">
              <div className="space-y-3">
                {imports.length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-4">
                    Импорт еще не запускался
                  </p>
                )}
                {imports.slice(0, 5).map((imp) => (
                  <motion.div
                    key={imp.id}
                    whileHover={{ x: 4 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white/2 rounded-lg border border-white/5 gap-3 sm:gap-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${imp.type === "xml" ? "bg-orange-500/10 text-orange-500" : "bg-blue-500/10 text-blue-500"}`}
                      >
                        <FileUp className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">
                          {imp.name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {new Date(imp.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pl-14 sm:pl-0">
                      <span className="text-gray-400 text-sm">
                        {imp.productsCount} тов.
                      </span>
                      <StatusBadge
                        status={
                          imp.status === "completed"
                            ? "synced"
                            : imp.status === "processing"
                              ? "processing"
                              : "failed"
                        }
                        size="sm"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Лента активности */}
        <motion.div variants={containerVariants}>
          <Card>
            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-400" />
              <h2 className="text-lg font-semibold text-white">
                Лента активности
              </h2>
              <span className="ml-auto text-xs text-gray-500">
                {activityLogs.length} событий
              </span>
            </div>
            <CardContent className="p-0">
              <div
                className="relative max-h-100 overflow-y-auto pr-2
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-white/10
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:hover:bg-white/20
      "
              >
                <div className="px-4 pt-4 pb-2 relative">
                  <div className="absolute left-7 top-4 bottom-2 w-px bg-white/10"></div>

                  {activityLogs.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-8 pl-8">
                      Пока нет активности
                    </p>
                  )}

                  <div className="space-y-4 relative">
                    {activityLogs.map((log, index) => (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="relative pl-8"
                      >
                        <div
                          className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center ${
                            log.type === "success"
                              ? "bg-emerald-500/20 text-emerald-500"
                              : log.type === "error"
                                ? "bg-red-500/20 text-red-500"
                                : log.type === "warning"
                                  ? "bg-amber-500/20 text-amber-500"
                                  : "bg-blue-500/20 text-blue-500"
                          }`}
                        >
                          <div className="w-2 h-2 rounded-full bg-current"></div>
                        </div>

                        <div>
                          <p className="text-gray-300 text-sm leading-tight">
                            {log.message}
                          </p>
                          <p className="text-gray-500 text-xs mt-0.5">
                            {new Date(log.timestamp).toLocaleString("ru-RU", {
                              day: "2-digit",
                              month: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Обзор сайтов */}
      <motion.div variants={containerVariants}>
        <Card>
          <div className="px-4 lg:px-6 py-4 border-b border-white/10">
            <h2 className="text-base lg:text-lg font-semibold text-white">
              Обзор сайтов
            </h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell variant="header">Название сайта</TableCell>
                <TableCell variant="header">Домен</TableCell>
                <TableCell variant="header">Тип</TableCell>
                <TableCell variant="header">Статус</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sites.map((site) => (
                <TableRow key={site.id}>
                  <TableCell className="font-medium text-white text-xs lg:text-sm">
                    {site.name}
                  </TableCell>
                  <TableCell className="text-gray-400 text-xs lg:text-sm">
                    {site.domain}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={site.type === "product" ? "info" : "success"}
                      size="sm"
                    >
                      {site.type === "product" ? "Товарный" : "Статейный"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={site.status} size="sm" />
                  </TableCell>
                </TableRow>
              ))}
              {sites.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-gray-500 py-4"
                  >
                    Сайты не найдены
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </motion.div>
    </motion.div>
  );
}