import 'react-i18next';
import { resources } from './config';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: typeof resources.en;
  }
}

export type TranslationKey = 
  | 'app.title'
  | 'app.menu'
  | 'app.language'
  | 'navigation.mainMenu'
  | 'navigation.form'
  | 'navigation.table'
  | 'navigation.login'
  | 'navigation.register'
  | 'navigation.logout'
  | 'auth.username'
  | 'auth.password'
  | 'auth.email'
  | 'auth.loginTitle'
  | 'auth.registerTitle'
  | 'auth.loginButton'
  | 'auth.registerButton'
  | 'auth.noAccount'
  | 'auth.hasAccount'
  | 'auth.invalidCredentials'
  | 'auth.noRegisteredUsers'
  | 'auth.validation.usernameRequired'
  | 'auth.validation.passwordRequired'
  | 'auth.validation.passwordMinLength'
  | 'auth.validation.emailRequired'
  | 'auth.validation.emailInvalid'
  | 'form.title'
  | 'form.firstName'
  | 'form.lastName'
  | 'form.age'
  | 'form.description'
  | 'form.submit'
  | 'form.backToTable'
  | 'form.validation.firstNameRequired'
  | 'form.validation.lastNameRequired'
  | 'form.validation.ageRequired'
  | 'form.validation.ageMin'
  | 'table.title'
  | 'table.name'
  | 'table.surname'
  | 'table.age'
  | 'table.description'
  | 'table.actions'
  | 'table.edit'
  | 'table.delete'
  | 'table.save'
  | 'table.cancel'
  | 'table.editEntry'
  | 'table.filters.ageMin'
  | 'table.filters.ageMax'
  | 'table.filters.searchSubstring'
  | 'table.filters.apply'
  | 'table.filters.clear'
  | 'table.filters.itemsPerPage'
  | 'table.pagination.buttonPagination'
  | 'table.pagination.infiniteScroll'
  | 'table.pagination.noMoreData'
  | 'table.pagination.showing'
  | 'table.pagination.noData'
  | 'table.pagination.noDataHint'
  | 'placeholders.firstName'
  | 'placeholders.lastName'
  | 'placeholders.age'
  | 'placeholders.description'
  | 'placeholders.username'
  | 'placeholders.password'
  | 'placeholders.email';

export type LanguageCode = 'en' | 'uk' | 'pl' | 'de' | 'es' | 'fr';

export interface Language {
  code: LanguageCode;
  name: string;
  flag: string;
}