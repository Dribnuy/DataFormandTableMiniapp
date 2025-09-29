import 'react-i18next';
import { resources } from './config';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: typeof resources.en;
  }
}



export type LanguageCode = 'en' | 'uk' | 'pl' | 'de' | 'es' | 'fr';

export interface Language {
  code: LanguageCode;
  name: string;
  flag: string;
}