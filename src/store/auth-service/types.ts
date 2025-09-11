export type User = {
  id: string;
  username: string;
  password: string; // need hash coming soon
  email: string;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};