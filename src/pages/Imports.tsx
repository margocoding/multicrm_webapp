import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Upload, File, CheckCircle, AlertCircle, Globe, Info, Code } from 'lucide-react';
import { importsApi, type ImportBatch } from '../api/imports.api';
import { sitesApi } from '../api/sites.api';
import type { Site } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';

export function Imports() {
  const [imports, setImports] = useState<ImportBatch[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [importPreview, setImportPreview] = useState<{ count: number; categories: string[] } | null>(null);
  const [showFormatInfo, setShowFormatInfo] = useState(false);
  const [activeFormatTab, setActiveFormatTab] = useState<'xml' | 'json'>('xml');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [importsRes, sitesRes] = await Promise.all([
        importsApi.getAll(),
        sitesApi.getAll({ limit: 100 }),
      ]);
      setImports(importsRes);
      setSites(sitesRes.items);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.xml') || file.name.endsWith('.json'))) {
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const analyzeFile = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      const result = await importsApi.analyze(selectedFile);
      setImportPreview({
        count: result.productsCount,
        categories: result.categories,
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      alert(error.response?.data?.message || 'Ошибка анализа файла');
    } finally {
      setIsUploading(false);
    }
  };

  const toggleSiteSelection = (siteId: string) => {
    setSelectedSiteIds(prev =>
      prev.includes(siteId)
        ? prev.filter(id => id !== siteId)
        : [...prev, siteId]
    );
  };

  const handleStartImport = async () => {
    if (!selectedFile || selectedSiteIds.length === 0) return;
    
    setIsUploading(true);
    try {
      await importsApi.create(selectedFile, selectedSiteIds);
      await loadData();
      resetForm();
    } catch (error) {
      console.error('Import error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await importsApi.remove(id);
      await loadData();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setCurrentStep(1);
    setSelectedFile(null);
    setSelectedSiteIds([]);
    setImportPreview(null);
    setIsUploading(false);
  };

  const canProceedToStep2 = selectedFile && !isUploading && importPreview;
  const canProceedToStep3 = selectedSiteIds.length > 0;

  const xmlExample = `<?xml version="1.0" encoding="UTF-8"?>
<yml_catalog date="2026-06-20T08:43">
  <shop>
    <name>Название магазина</name>
    <categories>
      <category id="1">Электроника</category>
      <category id="2" parentId="1">Смартфоны</category>
    </categories>
    <offers>
      <offer id="10529" available="true">
        <name>Колодка тормозная М659</name>
        <price>1600</price>
        <currencyId>RUB</currencyId>
        <categoryId>2</categoryId>
        <picture>https://example.com/image.jpg</picture>
        <description>Описание товара...</description>
        <weight>2.5</weight>
        <length>100</length>
        <standard>ГОСТ</standard>
      </offer>
    </offers>
  </shop>
</yml_catalog>`;

  const jsonExample = `{
  "shop": {
    "name": "Название магазина",
    "categories": [
      { "id": "1", "name": "Электроника" },
      { "id": "2", "name": "Смартфоны", "parentId": "1" }
    ],
    "offers": [
      {
        "id": "10529",
        "name": "Колодка тормозная М659",
        "price": "1600",
        "currencyId": "RUB",
        "categoryId": "2",
        "picture": "https://example.com/image.jpg",
        "description": "Описание товара...",
        "weight": "2.5",
        "length": "100",
        "standard": "ГОСТ"
      }
    ]
  }
}`;

  const requiredFields = [
    { field: 'id', description: 'Уникальный идентификатор товара (используется для предотвращения дубликатов)' },
    { field: 'name', description: 'Название товара (обязательно)' },
    { field: 'price', description: 'Цена товара (обязательно)' },
  ];

  const optionalFields = [
    { field: 'categoryId', description: 'ID категории из секции categories' },
    { field: 'picture', description: 'URL изображения товара (должен начинаться с http/https)' },
    { field: 'description', description: 'Описание товара (используется как подзаголовок)' },
    { field: 'currencyId', description: 'Валюта цены (по умолчанию RUB)' },
    { field: 'weight', description: 'Вес товара' },
    { field: 'length', description: 'Длина товара' },
    { field: 'standard', description: 'Стандарт товара' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white">Импорты</h1>
          <p className="text-gray-400 text-sm mt-1">Управление XML/JSON импортами товаров</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          Новый импорт
        </Button>
      </div>

      {/* Imports Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl border border-white/5"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell variant="header">Название</TableCell>
              <TableCell variant="header">Тип</TableCell>
              <TableCell variant="header">Создан</TableCell>
              <TableCell variant="header">Товаров</TableCell>
              <TableCell variant="header">Сайты</TableCell>
              <TableCell variant="header">Статус</TableCell>
              <TableCell variant="header" className="text-right">Действия</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {imports.map((imp, index) => (
                <motion.tr
                  key={imp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(220, 38, 38, 0.05)' }}
                  className="table-row-hover"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${imp.type === 'xml' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}>
                        <File className="w-4 h-4" />
                      </div>
                      <span className="text-white font-medium">{imp.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${
                      imp.type === 'xml' ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {imp.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-400">{new Date(imp.createdAt).toLocaleDateString('ru-RU')}</TableCell>
                  <TableCell className="text-sm text-white font-medium">{imp.productsCount}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-sm text-gray-300">{imp.targetSiteIds.length} сайтов</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge 
                      status={imp.status === 'completed' ? 'live' : imp.status === 'processing' ? 'processing' : 'failed'} 
                      size="sm" 
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-red-500/10 hover:text-red-500"
                        onClick={() => handleDelete(imp.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </motion.div>

      {/* Import Wizard Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title="Новый импорт"
        size="xl"
      >
        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center gap-4">
            {[1, 2, 3].map(step => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  currentStep >= step
                    ? 'bg-accent text-white'
                    : 'bg-background-dark border border-white/10 text-gray-400'
                }`}>
                  {currentStep > step ? <CheckCircle className="w-4 h-4" /> : step}
                </div>
                <span className={`text-sm ${currentStep >= step ? 'text-white' : 'text-gray-500'}`}>
                  {step === 1 ? 'Файл' : step === 2 ? 'Сайты' : 'Подтверждение'}
                </span>
                {step < 3 && <div className={`w-12 h-px ${currentStep > step ? 'bg-accent' : 'bg-white/10'}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: File Upload */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                  selectedFile
                    ? 'border-accent/50 bg-accent/5'
                    : 'border-white/10 hover:border-accent/30'
                }`}
              >
                {selectedFile ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                      <File className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{selectedFile.name}</p>
                      <p className="text-gray-400 text-sm">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                    {isUploading ? (
                      <div className="space-y-2">
                        <div className="w-48 h-2 bg-background-dark rounded-full mx-auto overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 2 }}
                            className="h-full bg-accent"
                          />
                        </div>
                        <p className="text-accent text-sm">Анализ файла...</p>
                      </div>
                    ) : importPreview ? (
                      <div className="flex items-center gap-2 text-green-500">
                        <CheckCircle className="w-4 h-4" />
                        <span>Готов к импорту</span>
                      </div>
                    ) : (
                      <button
                        onClick={analyzeFile}
                        className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors"
                      >
                        Анализировать файл
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setImportPreview(null);
                      }}
                      className="text-gray-400 hover:text-white text-sm underline"
                    >
                      Выбрать другой файл
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 mx-auto text-gray-400" />
                    <div>
                      <p className="text-white font-medium">Перетащите файл сюда или нажмите для выбора</p>
                      <p className="text-gray-400 text-sm mt-1">Поддерживаются форматы XML и JSON (YML)</p>
                    </div>
                    <label className="inline-block px-4 py-2 bg-background-dark border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors cursor-pointer">
                      Выбрать файл
                      <input
                        type="file"
                        accept=".xml,.json"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Format Info Button */}
              <button
                onClick={() => setShowFormatInfo(!showFormatInfo)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg text-blue-400 transition-colors"
              >
                <Info className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {showFormatInfo ? 'Скрыть' : 'Показать'} требования к формату файла
                </span>
              </button>

              {/* Format Information */}
              <AnimatePresence>
                {showFormatInfo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="glass rounded-lg p-6 space-y-6">
                      {/* Format Tabs */}
                      <div className="flex gap-2 border-b border-white/10 pb-2">
                        <button
                          onClick={() => setActiveFormatTab('xml')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeFormatTab === 'xml'
                              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          XML формат
                        </button>
                        <button
                          onClick={() => setActiveFormatTab('json')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeFormatTab === 'json'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          JSON формат
                        </button>
                      </div>

                      {/* Example Code */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Code className="w-4 h-4 text-gray-400" />
                          <p className="text-sm font-medium text-white">Пример структуры</p>
                        </div>
                        <div className="bg-background-dark rounded-lg p-4 overflow-x-auto">
                          <pre className="text-xs text-gray-300 font-mono whitespace-pre">
                            {activeFormatTab === 'xml' ? xmlExample : jsonExample}
                          </pre>
                        </div>
                      </div>

                      {/* Required Fields */}
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-white flex items-center gap-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          Обязательные поля
                        </p>
                        <div className="space-y-2">
                          {requiredFields.map((item) => (
                            <div key={item.field} className="flex gap-3 text-sm">
                              <code className="text-orange-400 font-mono bg-orange-500/10 px-2 py-0.5 rounded">
                                {item.field}
                              </code>
                              <span className="text-gray-400">{item.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Optional Fields */}
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-white flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          Опциональные поля
                        </p>
                        <div className="space-y-2">
                          {optionalFields.map((item) => (
                            <div key={item.field} className="flex gap-3 text-sm">
                              <code className="text-blue-400 font-mono bg-blue-500/10 px-2 py-0.5 rounded">
                                {item.field}
                              </code>
                              <span className="text-gray-400">{item.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Important Notes */}
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                          <div className="space-y-2">
                            <p className="text-yellow-400 font-medium text-sm">Важные замечания</p>
                            <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
                              <li>XML должен иметь корневой элемент <code className="text-yellow-400">&lt;yml_catalog&gt;</code> с вложенным <code className="text-yellow-400">&lt;shop&gt;</code></li>
                              <li>Категории должны быть определены в секции <code className="text-yellow-400">categories</code> перед использованием</li>
                              <li>Поле <code className="text-yellow-400">picture</code> должно содержать полный URL (начинающийся с http/https)</li>
                              <li>Товары с одинаковым <code className="text-yellow-400">id</code> будут обновлены, а не созданы заново</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {importPreview && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="glass rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Найдено товаров</p>
                    <p className="text-2xl font-bold text-white mt-1">{importPreview.count}</p>
                  </div>
                  <div className="glass rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Категории</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {importPreview.categories.map(cat => (
                        <span key={cat} className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded text-xs">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 2: Select Sites */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <p className="text-gray-400 text-sm">Выберите сайты для публикации импортированных товаров</p>
              <div className="grid grid-cols-2 gap-3">
                {sites.map(site => (
                  <button
                    key={site.id}
                    onClick={() => toggleSiteSelection(site.id)}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      selectedSiteIds.includes(site.id)
                        ? 'border-accent bg-accent/10'
                        : 'border-white/10 bg-background-dark hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{site.name}</p>
                        <p className="text-gray-400 text-sm">{site.domain}</p>
                      </div>
                      {selectedSiteIds.includes(site.id) && (
                        <CheckCircle className="w-5 h-5 text-accent" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Preview & Confirm */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="glass rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <p className="text-white font-medium">Сводка по импорту</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Файл:</span>
                    <span className="text-white ml-2">{selectedFile?.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Тип:</span>
                    <span className="text-white ml-2 uppercase">{selectedFile?.name.endsWith('.xml') ? 'XML' : 'JSON'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Товаров:</span>
                    <span className="text-white ml-2">{importPreview?.count}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Сайтов:</span>
                    <span className="text-white ml-2">{selectedSiteIds.length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-400 font-medium text-sm">Важная информация</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Товары будут импортированы и опубликованы на выбранных сайтах. Дубликаты не создаются — существующие товары будут обновлены.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            {currentStep > 1 ? (
              <button
                onClick={() => setCurrentStep(s => s - 1)}
                className="px-4 py-2 bg-background-dark border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors"
              >
                Назад
              </button>
            ) : (
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-background-dark border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors"
              >
                Отмена
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep(s => s + 1)}
                disabled={(!canProceedToStep2 && currentStep === 1) || (!canProceedToStep3 && currentStep === 2)}
                className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Продолжить
              </button>
            ) : (
              <button
                onClick={handleStartImport}
                disabled={isUploading}
                className="px-6 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors glow-red-hover disabled:opacity-50"
              >
                {isUploading ? 'Запуск...' : 'Начать импорт'}
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}