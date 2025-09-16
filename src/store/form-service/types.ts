export type FormData = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  description: string;
};

export type FormState = {
  data: FormData[]; 
  userData: FormData[]; 
  sortConfig?: {
    key: keyof FormData;
    direction: "asc" | "desc";
  };
  filters?: {
    ageMin?: number;
    ageMax?: number;
    substring?: string;
  };
  pagination: {
    page: number;
    limit: number;
  };
  loading: boolean;
  error: string | null;
  total: number;
};

export interface ButtonPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  showPageInfo?: boolean;
  maxVisiblePages?: number;
}

export interface InfiniteScrollTableProps {
  data: any[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  children: React.ReactNode;
  loadingThreshold?: number;
}

// Розширені типи пагінації для API
export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Тип для параметрів пагінації у запитах
export interface PaginationParams {
  page: number;
  limit: number;
}

// Універсальний тип для відповіді з пагінацією
export interface PaginatedApiResponse<T> {
  data: T[];
  pagination: PaginationResponse;
}

// Оновлений FormState з більш детальною пагінацією
export type EnhancedFormState = {
  data: FormData[];
  userData: FormData[];
  sortConfig?: {
    key: keyof FormData;
    direction: "asc" | "desc";
  };
  filters?: {
    ageMin?: number;
    ageMax?: number;
    substring?: string;
  };
  pagination: PaginationParams & {
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  loading: boolean;
  error: string | null;
};