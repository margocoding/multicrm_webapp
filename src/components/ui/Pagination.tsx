import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemName?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  total,
  itemsPerPage,
  onPageChange,
  itemName = 'товаров',
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, total);

  let pages: number[] = [];
  if (totalPages <= 5) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else if (currentPage <= 3) {
    pages = [1, 2, 3, 4, 5];
  } else if (currentPage >= totalPages - 2) {
    pages = [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  } else {
    pages = [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 lg:px-6 py-4 border-t border-white/5 gap-4">
      <p className="text-xs lg:text-sm text-gray-400 text-center sm:text-left">
        Показано {start} - {end} из {total} {itemName}
      </p>
      <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors shrink-0 ${
              currentPage === page
                ? 'bg-accent text-white'
                : 'hover:bg-white/10 text-gray-400'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}