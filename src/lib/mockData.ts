import { faker } from '@faker-js/faker';
import type { Site, Product, ImportBatch, Article, ActivityLog } from '../types';

export function generateMockData() {
  // Генерация 5 сайтов
  const sites: Site[] = Array.from({ length: 5 }, (_, i) => ({
    id: `site-${i + 1}`,
    name: faker.company.name(),
    domain: faker.internet.domainName(),
    type: faker.helpers.arrayElement(['product', 'article'] as const),
  }));

  // Генерация 100 товаров
  const products: Product[] = Array.from({ length: 100 }, (_, i) => ({
    id: `product-${i + 1}`,
    externalId: faker.string.alphanumeric(12).toUpperCase(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    image: faker.image.urlLoremFlickr({ category: 'product' }),
    category: faker.commerce.department(),
  }));

  // Генерация 5 импортов
  const imports: ImportBatch[] = Array.from({ length: 5 }, (_, i) => ({
    id: `import-${i + 1}`,
    name: `Импорт ${i + 1} - ${faker.date.past().toLocaleDateString('ru-RU')}`,
    type: faker.helpers.arrayElement(['xml', 'json'] as const),
    createdAt: faker.date.past().toISOString(),
    productsCount: faker.number.int({ min: 50, max: 500 }),
    targetSiteIds: faker.helpers.arrayElements(sites.map(s => s.id), faker.number.int({ min: 1, max: 3 })),
    status: faker.helpers.arrayElement(['processing', 'completed', 'failed'] as const),
  }));

  // Генерация 20 статей
  const articles: Article[] = Array.from({ length: 20 }, (_, i) => ({
    id: `article-${i + 1}`,
    title: faker.lorem.sentence({ min: 5, max: 10 }),
    content: faker.lorem.paragraphs({ min: 3, max: 6 }),
    createdAt: faker.date.past().toISOString(),
  }));

  // Генерация логов активности
  const activityLogs: ActivityLog[] = Array.from({ length: 15 }, (_, i) => ({
    id: `activity-${i + 1}`,
    timestamp: faker.date.recent({ days: 7 }).toISOString(),
    message: faker.helpers.arrayElement([
      'XML импорт завершён',
      'JSON импорт запущен',
      'Товары успешно синхронизированы',
      'Статья опубликована на сайте',
      'Синхронизация не удалась — запланирована повторная попытка',
      'Новая партия товаров импортирована',
      'Конфигурация сайта обновлена',
      'Валидация импорта пройдена',
    ]),
    type: faker.helpers.arrayElement(['info', 'success', 'warning', 'error'] as const),
  })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return { sites, products, imports, articles, activityLogs };
}
