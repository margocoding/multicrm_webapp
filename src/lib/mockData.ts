import { faker } from '@faker-js/faker';
import type { Site, Product, ImportBatch, Article, ActivityLog } from '../types';

export function generateMockData() {
  // Generate 5 sites
  const sites: Site[] = Array.from({ length: 5 }, (_, i) => ({
    id: `site-${i + 1}`,
    name: faker.company.name(),
    domain: faker.internet.domainName(),
    type: faker.helpers.arrayElement(['product', 'article'] as const),
  }));

  // Generate 100 products
  const products: Product[] = Array.from({ length: 100 }, (_, i) => ({
    id: `product-${i + 1}`,
    externalId: faker.string.alphanumeric(12).toUpperCase(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    image: faker.image.urlLoremFlickr({ category: 'product' }),
    category: faker.commerce.department(),
  }));

  // Generate 5 import batches
  const imports: ImportBatch[] = Array.from({ length: 5 }, (_, i) => ({
    id: `import-${i + 1}`,
    name: `Import Batch ${i + 1} - ${faker.date.past().toLocaleDateString()}`,
    type: faker.helpers.arrayElement(['xml', 'json'] as const),
    createdAt: faker.date.past().toISOString(),
    productsCount: faker.number.int({ min: 50, max: 500 }),
    targetSiteIds: faker.helpers.arrayElements(sites.map(s => s.id), faker.number.int({ min: 1, max: 3 })),
    status: faker.helpers.arrayElement(['processing', 'completed', 'failed'] as const),
  }));

  // Generate 20 articles
  const articles: Article[] = Array.from({ length: 20 }, (_, i) => ({
    id: `article-${i + 1}`,
    title: faker.lorem.sentence({ min: 5, max: 10 }),
    content: faker.lorem.paragraphs({ min: 3, max: 6 }),
    createdAt: faker.date.past().toISOString(),
  }));

  // Generate activity logs
  const activityLogs: ActivityLog[] = Array.from({ length: 15 }, (_, i) => ({
    id: `activity-${i + 1}`,
    timestamp: faker.date.recent({ days: 7 }).toISOString(),
    message: faker.helpers.arrayElement([
      'XML import completed',
      'JSON import started',
      'Products synced successfully',
      'Article published to site',
      'Sync failed - retry scheduled',
      'New product batch imported',
      'Site configuration updated',
      'Import validation passed',
    ]),
    type: faker.helpers.arrayElement(['info', 'success', 'warning', 'error'] as const),
  })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return { sites, products, imports, articles, activityLogs };
}
