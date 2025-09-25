export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORM: '/form',
  TABLE: '/table',
} as const;

export const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
export const PASSWORD_MIN_LENGTH = 6;
export const AGE_MIN = 1;
