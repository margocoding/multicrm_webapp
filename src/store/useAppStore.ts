import { create } from 'zustand';
import type { Site, Product, ImportBatch, Article, ActivityLog, ProductSite, ArticleSite } from '../types';
import { generateMockData } from '../lib/mockData';

interface AppState {
  // Данные
  sites: Site[];
  products: Product[];
  imports: ImportBatch[];
  articles: Article[];
  activityLogs: ActivityLog[];
  productSites: ProductSite[];
  articleSites: ArticleSite[];
  
  // UI состояние
  sidebarCollapsed: boolean;
  selectedSiteId: string | null;
  searchQuery: string;
  
  // Действия
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSelectedSiteId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  
  // Действия с сайтами
  addSite: (site: Site) => void;
  updateSite: (id: string, updates: Partial<Site>) => void;
  deleteSite: (id: string) => void;
  
  // Действия с товарами
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Действия с импортами
  addImport: (importBatch: ImportBatch) => void;
  updateImport: (id: string, updates: Partial<ImportBatch>) => void;
  deleteImport: (id: string) => void;
  
  // Действия со статьями
  addArticle: (article: Article) => void;
  updateArticle: (id: string, updates: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  
  // Действия с публикациями
  publishProductToSite: (productId: string, siteId: string) => void;
  unpublishProductFromSite: (productId: string, siteId: string) => void;
  publishArticleToSite: (articleId: string, siteId: string) => void;
  unpublishArticleFromSite: (articleId: string, siteId: string) => void;
  
  // Добавить лог активности
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
}

const mockData = generateMockData();

export const useAppStore = create<AppState>((set) => ({
  // Начальное состояние
  sites: mockData.sites,
  products: mockData.products,
  imports: mockData.imports,
  articles: mockData.articles,
  activityLogs: mockData.activityLogs,
  productSites: mockData.sites.flatMap(site => 
    mockData.products.slice(0, 20).map(product => ({
      productId: product.id,
      siteId: site.id,
      isPublished: Math.random() > 0.3,
    }))
  ),
  articleSites: mockData.sites.flatMap(site =>
    mockData.articles.slice(0, 5).map(article => ({
      articleId: article.id,
      siteId: site.id,
    }))
  ),
  
  // UI состояние
  sidebarCollapsed: false,
  selectedSiteId: null,
  searchQuery: '',
  
  // Действия
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setSelectedSiteId: (id) => set({ selectedSiteId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  // Действия с сайтами
  addSite: (site) => set((state) => ({ 
    sites: [...state.sites, site],
    activityLogs: [{
      id: `activity-${Date.now()}`,
      timestamp: new Date().toISOString(),
      message: `Сайт "${site.name}" создан`,
      type: 'success',
    }, ...state.activityLogs]
  })),
  
  updateSite: (id, updates) => set((state) => ({
    sites: state.sites.map(site => site.id === id ? { ...site, ...updates } : site),
  })),
  
  deleteSite: (id) => set((state) => ({
    sites: state.sites.filter(site => site.id !== id),
    productSites: state.productSites.filter(ps => ps.siteId !== id),
    articleSites: state.articleSites.filter(as => as.siteId !== id),
    activityLogs: [{
      id: `activity-${Date.now()}`,
      timestamp: new Date().toISOString(),
      message: `Сайт удалён`,
      type: 'warning',
    }, ...state.activityLogs]
  })),
  
  // Действия с товарами
  addProduct: (product) => set((state) => ({
    products: [...state.products, product],
    activityLogs: [{
      id: `activity-${Date.now()}`,
      timestamp: new Date().toISOString(),
      message: `Товар "${product.title}" создан`,
      type: 'success',
    }, ...state.activityLogs]
  })),
  
  updateProduct: (id, updates) => set((state) => ({
    products: state.products.map(product => product.id === id ? { ...product, ...updates } : product),
  })),
  
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter(product => product.id !== id),
    productSites: state.productSites.filter(ps => ps.productId !== id),
  })),
  
  // Действия с импортами
  addImport: (importBatch) => set((state) => ({
    imports: [...state.imports, importBatch],
    activityLogs: [{
      id: `activity-${Date.now()}`,
      timestamp: new Date().toISOString(),
      message: `Импорт "${importBatch.name}" запущен`,
      type: 'info',
    }, ...state.activityLogs]
  })),
  
  updateImport: (id, updates) => set((state) => ({
    imports: state.imports.map(imp => imp.id === id ? { ...imp, ...updates } : imp),
  })),
  
  deleteImport: (id) => set((state) => ({
    imports: state.imports.filter(imp => imp.id !== id),
    activityLogs: [{
      id: `activity-${Date.now()}`,
      timestamp: new Date().toISOString(),
      message: `Пакет импорта удалён`,
      type: 'warning',
    }, ...state.activityLogs]
  })),
  
  // Действия со статьями
  addArticle: (article) => set((state) => ({
    articles: [...state.articles, article],
    activityLogs: [{
      id: `activity-${Date.now()}`,
      timestamp: new Date().toISOString(),
      message: `Статья "${article.title}" создана`,
      type: 'success',
    }, ...state.activityLogs]
  })),
  
  updateArticle: (id, updates) => set((state) => ({
    articles: state.articles.map(article => article.id === id ? { ...article, ...updates } : article),
  })),
  
  deleteArticle: (id) => set((state) => ({
    articles: state.articles.filter(article => article.id !== id),
    articleSites: state.articleSites.filter(as => as.articleId !== id),
  })),
  
  // Действия с публикациями
  publishProductToSite: (productId, siteId) => set((state) => {
    const exists = state.productSites.find(ps => ps.productId === productId && ps.siteId === siteId);
    if (exists) {
      return {
        productSites: state.productSites.map(ps => 
          ps.productId === productId && ps.siteId === siteId 
            ? { ...ps, isPublished: true } 
            : ps
        ),
      };
    }
    return {
      productSites: [...state.productSites, { productId, siteId, isPublished: true }],
    };
  }),
  
  unpublishProductFromSite: (productId, siteId) => set((state) => ({
    productSites: state.productSites.map(ps =>
      ps.productId === productId && ps.siteId === siteId
        ? { ...ps, isPublished: false }
        : ps
    ),
  })),
  
  publishArticleToSite: (articleId, siteId) => set((state) => {
    const exists = state.articleSites.find(as => as.articleId === articleId && as.siteId === siteId);
    if (!exists) {
      return {
        articleSites: [...state.articleSites, { articleId, siteId }],
      };
    }
    return state;
  }),
  
  unpublishArticleFromSite: (articleId, siteId) => set((state) => ({
    articleSites: state.articleSites.filter(as => 
      !(as.articleId === articleId && as.siteId === siteId)
    ),
  })),
  
  // Добавить лог активности
  addActivityLog: (log) => set((state) => ({
    activityLogs: [{
      id: `activity-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...log,
    }, ...state.activityLogs]
  })),
}));
