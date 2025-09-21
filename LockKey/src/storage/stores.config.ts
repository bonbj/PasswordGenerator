import { AppStore } from './app.store';
import { PasswordStore } from './password.store';

// Instâncias dos stores
export const appStore = new AppStore();
export const passwordStore = new PasswordStore();

// Exportar todos os stores
export const stores = {
  appStore,
  passwordStore
};
