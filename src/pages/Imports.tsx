import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Upload, File, CheckCircle, AlertCircle, Globe } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { ImportBatch } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';

export function Imports() {
  const { imports, sites, addImport, deleteImport, addActivityLog } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [importPreview, setImportPreview] = useState<{ count: number; categories: string[] } | null>(null);

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

  const simulateUpload = () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setImportPreview({
        count: Math.floor(Math.random() * 450) + 50,
        categories: ['Electronics', 'Clothing', 'Home', 'Sports', 'Books'].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 2),
      });
    }, 2000);
  };

  const toggleSiteSelection = (siteId: string) => {
    setSelectedSiteIds(prev =>
      prev.includes(siteId)
        ? prev.filter(id => id !== siteId)
        : [...prev, siteId]
    );
  };

  const handleStartImport = () => {
    if (selectedFile && selectedSiteIds.length > 0 && importPreview) {
      const newImport: ImportBatch = {
        id: `import-${Date.now()}`,
        name: `${selectedFile.name} - ${new Date().toLocaleDateString()}`,
        type: selectedFile.name.endsWith('.xml') ? 'xml' : 'json',
        createdAt: new Date().toISOString(),
        productsCount: importPreview.count,
        targetSiteIds: selectedSiteIds,
        status: 'processing',
      };
      addImport(newImport);
      addActivityLog({
        message: `Import "${newImport.name}" started`,
        type: 'info',
      });
      
      // Simulate import completion
      setTimeout(() => {
        // In real app would update via API
      }, 3000);
      
      resetForm();
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white">Imports</h1>
          <p className="text-gray-400 text-sm mt-1">Manage XML/JSON product imports</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          New Import
        </Button>
      </div>

      {/* Imports Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl border border-white/5 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell variant="header">Import Name</TableCell>
                <TableCell variant="header">Type</TableCell>
                <TableCell variant="header">Created</TableCell>
                <TableCell variant="header">Products</TableCell>
                <TableCell variant="header">Target Sites</TableCell>
                <TableCell variant="header">Status</TableCell>
                <TableCell variant="header" className="text-right">Actions</TableCell>
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
                    <TableCell className="text-sm text-gray-400">{new Date(imp.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-sm text-white font-medium">{imp.productsCount}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm text-gray-300">{imp.targetSiteIds.length} sites</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge 
                        status={imp.status === 'completed' ? 'synced' : imp.status === 'processing' ? 'processing' : 'failed'} 
                        size="sm" 
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            addActivityLog({
                              message: `Publishing import "${imp.name}" to additional sites`,
                              type: 'info',
                            });
                          }}
                        >
                          Publish
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-red-500/10 hover:text-red-500"
                          onClick={() => deleteImport(imp.id)}
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
        title="New Import"
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
                  {step === 1 ? 'Upload' : step === 2 ? 'Sites' : 'Preview'}
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
                        <p className="text-accent text-sm">Parsing file...</p>
                      </div>
                    ) : importPreview ? (
                      <div className="flex items-center gap-2 text-green-500">
                        <CheckCircle className="w-4 h-4" />
                        <span>Ready to import</span>
                      </div>
                    ) : (
                      <button
                        onClick={simulateUpload}
                        className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors"
                      >
                        Parse File
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setImportPreview(null);
                      }}
                      className="text-gray-400 hover:text-white text-sm underline"
                    >
                      Choose different file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 mx-auto text-gray-400" />
                    <div>
                      <p className="text-white font-medium">Drop your file here or click to browse</p>
                      <p className="text-gray-400 text-sm mt-1">Supports XML and JSON formats</p>
                    </div>
                    <label className="inline-block px-4 py-2 bg-background-dark border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors cursor-pointer">
                      Browse Files
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

              {importPreview && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="glass rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Products Found</p>
                    <p className="text-2xl font-bold text-white mt-1">{importPreview.count}</p>
                  </div>
                  <div className="glass rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Categories</p>
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
              <p className="text-gray-400 text-sm">Select target sites for this import</p>
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
                  <p className="text-white font-medium">Import Summary</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">File:</span>
                    <span className="text-white ml-2">{selectedFile?.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Type:</span>
                    <span className="text-white ml-2 uppercase">{selectedFile?.name.endsWith('.xml') ? 'XML' : 'JSON'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Products:</span>
                    <span className="text-white ml-2">{importPreview?.count}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Target Sites:</span>
                    <span className="text-white ml-2">{selectedSiteIds.length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-400 font-medium text-sm">Important Note</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Products will be imported globally and published to selected sites. No duplicate products will be created.
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
                Back
              </button>
            ) : (
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-background-dark border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep(s => s + 1)}
                disabled={!canProceedToStep2 && currentStep === 1 || !canProceedToStep3 && currentStep === 2}
                className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleStartImport}
                className="px-6 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors glow-red-hover"
              >
                Start Import
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
