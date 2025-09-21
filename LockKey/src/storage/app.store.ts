import { makeAutoObservable } from 'mobx';
import { User } from '../services/auth.service';

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  language: string;
}

export class AppStore {
  // Estado da aplicação
  user: User | null = null;
  isAuthenticated: boolean = false;
  theme: 'light' | 'dark' = 'light';
  language: string = 'pt-BR';

  constructor() {
    makeAutoObservable(this);
    this.loadFromStorage();
  }

  // Actions
  setUser(user: User | null) {
    this.user = user;
    this.isAuthenticated = user !== null;
    this.saveToStorage();
  }

  setTheme(theme: 'light' | 'dark') {
    this.theme = theme;
    this.saveToStorage();
  }

  setLanguage(language: string) {
    this.language = language;
    this.saveToStorage();
  }

  logout() {
    this.user = null;
    this.isAuthenticated = false;
    this.saveToStorage();
  }

  // Getters
  get isLoggedIn() {
    return this.isAuthenticated;
  }

  get currentUser() {
    return this.user;
  }

  get currentTheme() {
    return this.theme;
  }

  get currentLanguage() {
    return this.language;
  }

  // Persistência
  private saveToStorage() {
    const state: Partial<AppState> = {
      user: this.user,
      isAuthenticated: this.isAuthenticated,
      theme: this.theme,
      language: this.language
    };

    try {
      localStorage.setItem('app_state', JSON.stringify(state));
    } catch (error) {
      console.error('Erro ao salvar estado no localStorage:', error);
    }
  }

  private loadFromStorage() {
    try {
      const savedState = localStorage.getItem('app_state');
      if (savedState) {
        const state: Partial<AppState> = JSON.parse(savedState);
        
        if (state.user) {
          this.user = state.user;
        }
        if (typeof state.isAuthenticated === 'boolean') {
          this.isAuthenticated = state.isAuthenticated;
        }
        if (state.theme) {
          this.theme = state.theme;
        }
        if (state.language) {
          this.language = state.language;
        }
      }
    } catch (error) {
      console.error('Erro ao carregar estado do localStorage:', error);
    }
  }
}
