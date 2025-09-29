import React from 'react';
import type { ButtonPaginationProps, InfiniteScrollTableProps } from '../store/form-service/types';

export const ButtonPagination: React.FC<ButtonPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
  showPageInfo = true,
  maxVisiblePages = 5
}) => {
  const getVisiblePages = (): (number | string)[] => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const delta = Math.floor(maxVisiblePages / 2);
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];


    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (start > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (end < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage && !loading) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
      
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1 || loading}
        className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        aria-label="Previous page"
      >
        ←
      </button>

      
      {visiblePages.map((page, index) => (
        <button
          key={`page-${index}`}
          onClick={() => typeof page === 'number' ? handlePageChange(page) : undefined}
          disabled={loading || page === '...'}
          className={`px-3 py-2 rounded-md border transition-colors duration-200 ${
            page === currentPage
              ? 'bg-blue-500 text-white border-blue-500 shadow-md'
              : page === '...'
              ? 'bg-white border-gray-300 text-gray-400 cursor-default'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label={typeof page === 'number' ? `Go to page ${page}` : 'More pages'}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || loading}
        className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        aria-label="Next page"
      >
        →
      </button>

      
      
    </div>
  );
};


export const InfiniteScrollTable: React.FC<InfiniteScrollTableProps> = ({
  data,
  loading,
  hasMore,
  onLoadMore,
  children,
  loadingThreshold = 1000
}) => {
  const [isNearBottom, setIsNearBottom] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight || window.innerHeight;

      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      const nearBottom = distanceFromBottom <= loadingThreshold;

      setIsNearBottom(nearBottom);

      if (nearBottom && !loading && hasMore) {
        onLoadMore();
      }
    };

    const throttledHandleScroll = throttle(handleScroll, 200);
    
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [loading, hasMore, onLoadMore, loadingThreshold]);


  function throttle<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout | null = null;
    let lastExecTime = 0;

    return (...args: Parameters<T>) => {
      const currentTime = Date.now();

      if (currentTime - lastExecTime > delay) {
        func(...args);
        lastExecTime = currentTime;
      } else {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func(...args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }

  return (
    <div className="w-full">
      {children}
      
      
      {loading && (
        <div className="flex justify-center items-center mt-6 py-4" role="status" aria-label="Loading more data">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Завантаження...</span>
        </div>
      )}

      
      {!hasMore && data.length > 0 && (
        <div className="text-center mt-6 py-4 text-gray-500 border-t border-gray-200">
          Всі дані завантажені
        </div>
      )}

   
      {!hasMore && data.length === 0 && !loading && (
        <div className="text-center mt-6 py-8 text-gray-500">
          Немає даних для відображення
        </div>
      )}

      
      {process.env.NODE_ENV === 'development' && isNearBottom && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
          Near bottom
        </div>
      )}
    </div>
  );
};