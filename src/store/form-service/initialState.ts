import type { FormState } from "./types";

export const initialState: FormState = {
  data: [], // Мокові дані
  userData: [], // Користувацькі дані
  sortConfig: undefined,
  filters: undefined,
  pagination: { page: 1, limit: 10 },
  loading: false,
  error: null,
  total: 0,
};