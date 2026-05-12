import { create } from 'zustand';
import type { Site, Product, ImportBatch, Article, ActivityLog, ProductSite, ArticleSite } from '../types';
import { generateMockData } from '../lib/mockData';

interface AppState {
  // Data
  sites: Site[];
  products: Product[];
  imports: ImportBatch[];
  articles: Article[];
  activityLogs: ActivityLog[];
  productSites: ProductSite[];
  articleSites: ArticleSite[];
  
  // UI State
  sidebarCollapsed: boolean;
  selectedSiteId: string | null;
  searchQuery: string;
  
  // Actions
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSelectedSiteId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  
  // Site actions
  addSite: (site: Site) => void;
  updateSite: (id: string, updates: Partial<Site>) => void;
  deleteSite: (id: string) => void;
  
  // Product actions
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Import actions
  addImport: (importBatch: ImportBatch) => void;
  updateImport: (id: string, updates: Partial<ImportBatch>) => void;
  deleteImport: (id: string) => void;
  
  // Article actions
  addArticle: (article: Article) => void;
  updateArticle: (id: string, updates: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  
  // Publication actions
  publishProductToSite: (productId: string, siteId: string) => void;
  unpublishProductFromSite: (productId: string, siteId: string) => void;
  publishArticleToSite: (articleId: string, siteId: string) => void;
  unpublishArticleFromSite: (articleId: string, siteId: string) => void;
  
  // Add activity log
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
}

const mockData = generateMockData();

export const useAppStore = create<AppState>((set) => ({
  // Initial state
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
  
  // UI State
  sidebarCollapsed: false,
  selectedSiteId: null,
  searchQuery: '',
  
  // Actions
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setSelectedSiteId: (id) => set({ selectedSiteId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  // Site actions
  addSite: (site) => set((state) => ({ 
    sites: [...state.sites, site],
    activityLogs: [{
      id: `activity-${Date.now()}`,
      timestamp: new Date().toISOString(),
      message: `Site "${site.name}" created`,
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
      message: `Site deleted`,
      type: 'warning',
    }, ...state.activityLogs]
  })),
  
  // Product actions
  addProduct: (product) => set((state) => ({
    products: [...state.products, product],
    activityLogs: [{
      id: `activity-${Date.now()}`,
      timestamp: new Date().toISOString(),
      message: `Product "${product.title}" created`,
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
  
  // Import actions
  addImport: (importBatch) => set((state) => ({
    imports: [...state.imports, importBatch],
    activityLogs: [{
      id: `activity-${Date.now()}`,
      timestamp: new Date().toISOString(),
      message: `Import "${importBatch.name}" started`,
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
      message: `Import batch deleted`,
      type: 'warning',
    }, ...state.activityLogs]
  })),
  
  // Article actions
  addArticle: (article) => set((state) => ({
    articles: [...state.articles, article],
    activityLogs: [{
      id: `activity-${Date.now()}`,
      timestamp: new Date().toISOString(),
      message: `Article "${article.title}" created`,
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
  
  // Publication actions
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
  
  // Add activity log
  addActivityLog: (log) => set((state) => ({
    activityLogs: [{
      id: `activity-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...log,
    }, ...state.activityLogs]
  })),
}));
