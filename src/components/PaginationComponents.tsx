import React from "react";
import type { ButtonPaginationProps, InfiniteScrollTableProps } from "../store/form-service/types";

import {
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const PaginationContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 2,
  marginTop: theme.spacing(6),
  flexWrap: "wrap",
}));

export const ButtonPagination: React.FC<ButtonPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
  showPageInfo = true,
  maxVisiblePages = 5,
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
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (end < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
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
    <PaginationContainer>
      <Button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1 || loading}
        sx={{
          px: 1.5,
          py: 1,
          borderRadius: 1,
          backgroundColor: "white",
          border: "1px solid #d1d5db",
          color: "#374151",
          "&:hover": {
            backgroundColor: "#f9fafb",
          },
          "&.Mui-disabled": {
            opacity: 0.5,
            cursor: "not-allowed",
          },
        }}
        aria-label="Previous page"
      >
        ←
      </Button>

      {visiblePages.map((page, index) => (
        <Button
          key={`page-${index}`}
          onClick={() => typeof page === "number" ? handlePageChange(page) : undefined}
          disabled={loading || page === "..."}
          sx={{
            px: 1.5,
            py: 1,
            borderRadius: 1,
            border: "1px solid #d1d5db",
            transition: "all 0.2s ease",
            ...(page === currentPage
              ? {
                  backgroundColor: "#3b82f6",
                  color: "white",
                  borderColor: "#3b82f6",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }
              : page === "..."
              ? {
                  backgroundColor: "white",
                  color: "#9ca3af",
                  cursor: "default",
                }
              : {
                  backgroundColor: "white",
                  color: "#374151",
                  "&:hover": {
                    backgroundColor: "#f9fafb",
                    borderColor: "#a0aec0",
                  },
                }),
            "&.Mui-disabled": {
              opacity: 0.5,
              cursor: "not-allowed",
            },
          }}
          aria-label={typeof page === "number" ? `Go to page ${page}` : "More pages"}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </Button>
      ))}

      <Button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || loading}
        sx={{
          px: 1.5,
          py: 1,
          borderRadius: 1,
          backgroundColor: "white",
          border: "1px solid #d1d5db",
          color: "#374151",
          "&:hover": {
            backgroundColor: "#f9fafb",
          },
          "&.Mui-disabled": {
            opacity: 0.5,
            cursor: "not-allowed",
          },
        }}
        aria-label="Next page"
      >
        →
      </Button>
    </PaginationContainer>
  );
};

const TableContainerStyled = styled(Box)(({ theme }) => ({
  width: "100%",
}));

export const InfiniteScrollTable: React.FC<InfiniteScrollTableProps> = ({
  data,
  loading,
  hasMore,
  onLoadMore,
  children,
  loadingThreshold = 1000,
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

    window.addEventListener("scroll", throttledHandleScroll, { passive: true });

    return () => window.removeEventListener("scroll", throttledHandleScroll);
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
    <TableContainerStyled>
      {children}

      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 6,
            paddingY: 4,
          }}
          role="status"
          aria-label="Loading more data"
        >
          <CircularProgress size={32} sx={{ color: "#3b82f6" }} />
          <Typography sx={{ marginLeft: 2, color: "#6b7280" }}>Завантаження...</Typography>
        </Box>
      )}

      {!hasMore && data.length > 0 && (
        <Box
          sx={{
            textAlign: "center",
            marginTop: 6,
            paddingY: 4,
            borderTop: "1px solid #e5e7eb",
            color: "#a0aec0",
          }}
        >
          Всі дані завантажені
        </Box>
      )}

      {!hasMore && data.length === 0 && !loading && (
        <Box
          sx={{
            textAlign: "center",
            marginTop: 6,
            paddingY: 8,
            color: "#a0aec0",
          }}
        >
          Немає даних для відображення
        </Box>
      )}

      {process.env.NODE_ENV === "development" && isNearBottom && (
        <Box
          sx={{
            position: "fixed",
            bottom: 4,
            right: 4,
            backgroundColor: "#fefcbf",
            color: "#975a16",
            paddingX: 1,
            paddingY: 0.5,
            borderRadius: 1,
            fontSize: "0.75rem",
          }}
        >
          Near bottom
        </Box>
      )}
    </TableContainerStyled>
  );
};