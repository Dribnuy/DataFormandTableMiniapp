export type FormData = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  description: string;
};

export type FormState = {
  data: FormData[];
  sortConfig?: {
    key: keyof FormData;
    direction: "asc" | "desc";
  };
  filters?: {
    ageMin?: number;
    ageMax?: number;
    substring?: string;
  };
};
