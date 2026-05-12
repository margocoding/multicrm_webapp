export interface Site {
  id: string;
  name: string;
  domain: string;
  type: 'product' | 'article';
}

export interface Product {
  id: string;
  externalId: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface ImportBatch {
  id: string;
  name: string;
  type: 'xml' | 'json';
  createdAt: string;
  productsCount: number;
  targetSiteIds: string[];
  status: 'processing' | 'completed' | 'failed';
}

export interface ProductSite {
  productId: string;
  siteId: string;
  isPublished: boolean;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface ArticleSite {
  articleId: string;
  siteId: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}
