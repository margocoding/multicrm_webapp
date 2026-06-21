import { motion } from 'framer-motion';
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  Image as ImageIcon,
  Mail,
  MessageSquare,
  Package,
  Ruler,
  Scale,
  Tag,
  Trash2,
  XCircle,
} from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import type { Order } from '../api/orders.api';
import { ordersApi } from '../api/orders.api';
import { Button } from '../components/ui/Button';
import { Loading } from '../components/ui/Loading';
import { Select } from '../components/ui/Select';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../components/ui/Table';
import { getImageUrl } from '../lib/utils';

const STATUS_OPTIONS = [
  { value: 'NEW', label: 'Новый' },
  { value: 'PROCESSED', label: 'Обработан' },
  { value: 'CANCELLED', label: 'Отменён' },
];

const STATUS_CONFIG = {
  NEW: {
    label: 'Новый',
    icon: Clock,
    classes: 'bg-blue-500/10 text-blue-400',
  },
  PROCESSED: {
    label: 'Обработан',
    icon: CheckCircle2,
    classes: 'bg-green-500/10 text-green-400',
  },
  CANCELLED: {
    label: 'Отменён',
    icon: XCircle,
    classes: 'bg-red-500/10 text-red-400',
  },
};

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [detailsCache, setDetailsCache] = useState<Record<string, Order>>({});
  const [loadingDetails, setLoadingDetails] = useState<string | null>(null);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await ordersApi.getAll();
      setOrders(data);
    } catch (error) {
      toast.error('Не удалось загрузить заказы');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleToggleDetails = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }

    setExpandedId(id);

    if (detailsCache[id]) return;

    setLoadingDetails(id);
    try {
      const details = await ordersApi.getById(id);
      setDetailsCache((prev) => ({ ...prev, [id]: details }));
    } catch (error) {
      toast.error('Не удалось загрузить детали заказа');
      setExpandedId(null);
    } finally {
      setLoadingDetails(null);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await ordersApi.updateStatus(
        id,
        status as 'NEW' | 'PROCESSED' | 'CANCELLED',
      );
      toast.success('Статус заказа обновлён');
      loadOrders();
    } catch (error: any) {
      const msg = error?.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg[0] : msg || 'Ошибка обновления');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Удалить заказ? Это действие необратимо.')) return;
    try {
      await ordersApi.remove(id);
      toast.success('Заказ удалён');
      if (expandedId === id) setExpandedId(null);
      setDetailsCache((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      loadOrders();
    } catch (error) {
      toast.error('Не удалось удалить заказ');
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: string, currency: string) => {
    const symbol = currency === 'RUB' ? '₽' : currency;
    return `${price} ${symbol}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-white">Заявки</h1>
        <p className="text-gray-400 text-sm mt-1">
          Управление входящими заявками от клиентов
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl border border-white/5 relative overflow-hidden"
      >
        {isLoading ? (
          <Loading variant="overlay" size="lg" text="Загрузка заявок..." fullHeight />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell variant="header" className="w-8"/>
                <TableCell variant="header">Заявка</TableCell>
                <TableCell variant="header" className="hidden md:table-cell">
                  Клиент
                </TableCell>
                <TableCell variant="header" className="hidden lg:table-cell">
                  Товары
                </TableCell>
                <TableCell variant="header">Сумма</TableCell>
                <TableCell variant="header" className="hidden md:table-cell">
                  Статус
                </TableCell>
                <TableCell variant="header" className="hidden lg:table-cell">
                  Дата
                </TableCell>
                <TableCell variant="header" className="text-right">
                  Действия
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-12" colSpan={8}>
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <FileText className="w-8 h-8" />
                      <p className="text-sm">Заявок пока нет</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => {
                  const statusCfg = STATUS_CONFIG[order.status];
                  const StatusIcon = statusCfg.icon;
                  const isExpanded = expandedId === order.id;
                  const details = detailsCache[order.id];
                  const isLoadingDetails = loadingDetails === order.id;

                  return (
                    <Fragment key={order.id}>
                      <TableRow
                        onClick={() => handleToggleDetails(order.id)}
                        className={isExpanded ? 'bg-white/3' : ''}
                      >
                        <TableCell className="w-8">
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          </motion.div>
                        </TableCell>

                        <TableCell>
                          <div className="min-w-0">
                            <p className="text-white font-medium text-sm">
                              #{order.id.slice(-8).toUpperCase()}
                            </p>
                            {order.comment && (
                              <div className="flex items-center gap-1 mt-1 text-gray-500 text-xs max-w-50">
                                <MessageSquare className="w-3 h-3 shrink-0" />
                                <span className="truncate">{order.comment}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2 min-w-0">
                            <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                            <span className="text-sm text-gray-300 truncate max-w-50">
                              {order.email}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-300">
                              {order.items.length}{' '}
                              {order.items.length === 1
                                ? 'позиция'
                                : order.items.length < 5
                                ? 'позиции'
                                : 'позиций'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 max-w-50 truncate">
                            {order.items.map((i) => i.name).join(', ')}
                          </div>
                        </TableCell>

                        <TableCell>
                          <p className="text-white font-medium text-sm whitespace-nowrap">
                            {formatPrice(order.totalPrice, order.currency)}
                          </p>
                        </TableCell>

                        <TableCell className="hidden md:table-cell">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusCfg.classes}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusCfg.label}
                          </span>
                        </TableCell>

                        <TableCell className="hidden lg:table-cell">
                          <span className="text-sm text-gray-400 whitespace-nowrap">
                            {formatDate(order.createdAt)}
                          </span>
                        </TableCell>

                        <TableCell>
                          <div
                            className="flex items-center justify-end gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Select
                              options={STATUS_OPTIONS}
                              value={order.status}
                              onChange={(v) =>
                                handleStatusChange(order.id, v as string)
                              }
                              disabled={
                                updatingId === order.id ||
                                order.status === 'CANCELLED'
                              }
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1.5 h-auto hover:bg-red-500/10 hover:text-red-500"
                              onClick={() => handleDelete(order.id)}
                              title="Удалить заказ"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Раскрывающаяся строка с деталями */}
                      {isExpanded && (
                        <TableRow className="bg-black/20">
                          <TableCell colSpan={8} className="p-0">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className="p-6">
                                {isLoadingDetails || !details ? (
                                  <div className="flex justify-center py-8">
                                    <Loading
                                      variant="spinner"
                                      size="md"
                                      text="Загрузка деталей..."
                                    />
                                  </div>
                                ) : (
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-4">
                                      <h3 className="text-white font-semibold text-sm tracking-wide uppercase">
                                        Состав заказа
                                      </h3>
                                      <p className="text-xs text-gray-500">
                                        Всего:{' '}
                                        <span className="text-white font-medium">
                                          {formatPrice(
                                            details.totalPrice,
                                            details.currency,
                                          )}
                                        </span>
                                      </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                      {details.items.map((item) => (
                                        <div
                                          key={item.id}
                                          className="glass rounded-lg border border-white/10 p-4 flex gap-4 hover:border-white/20 transition-colors"
                                        >
                                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-background-dark border border-white/10 shrink-0">
                                            {item.image ? (
                                              <img
                                                src={getImageUrl(item.image)}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                              />
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                <ImageIcon className="w-6 h-6" />
                                              </div>
                                            )}
                                          </div>

                                          <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium text-sm truncate">
                                              {item.name}
                                            </p>
                                            {item.subtitle && (
                                              <p className="text-red-500/70 text-[10px] tracking-widest mt-0.5 uppercase">
                                                {item.subtitle}
                                              </p>
                                            )}

                                            <div className="mt-2 space-y-1">
                                              {item.standard && (
                                                <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                                                  <Tag className="w-3 h-3 shrink-0" />
                                                  <span className="truncate">
                                                    {item.standard}
                                                  </span>
                                                </div>
                                              )}
                                              {item.length && (
                                                <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                                                  <Ruler className="w-3 h-3 shrink-0" />
                                                  <span>{item.length}</span>
                                                </div>
                                              )}
                                              {item.weight && (
                                                <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                                                  <Scale className="w-3 h-3 shrink-0" />
                                                  <span>{item.weight}</span>
                                                </div>
                                              )}
                                            </div>

                                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                                              <span className="text-xs text-gray-400">
                                                {item.quantity} шт ×{' '}
                                                {item.price}{' '}
                                                {details.currency === 'RUB'
                                                  ? '₽'
                                                  : details.currency}
                                              </span>
                                              <span className="text-white font-semibold text-sm">
                                                {(
                                                  parseFloat(item.price) *
                                                  item.quantity
                                                ).toLocaleString('ru-RU')}{' '}
                                                {details.currency === 'RUB'
                                                  ? '₽'
                                                  : details.currency}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
      </motion.div>
    </div>
  );
}