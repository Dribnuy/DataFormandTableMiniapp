export type FormData = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  description: string;
};

export type FormState = {
  data: FormData[]; // Мокові дані
  userData: FormData[]; // Користувацькі дані
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