export interface Site {
  id: string;
  name: string;
  domain: string;
  type: 'product' | 'article';
  status: 'live' | 'draft' | 'archived';
  productsCount: number;
  articlesCount: number;
  createdAt: string;
}

export interface Product {
  id: string;
  externalId: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
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

// Типы для UI компонентов
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';
export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'processing';
export type InputSize = 'sm' | 'md' | 'lg';
