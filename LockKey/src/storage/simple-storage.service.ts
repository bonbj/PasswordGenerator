import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface SavedPassword {
  id: string;
  title: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SimpleStorageService {
  private readonly STORAGE_KEYS = {
    USER: 'app_user',
    PASSWORDS: 'app_passwords',
    SETTINGS: 'app_settings'
  };

  // Observables para reatividade
  private userSubject = new BehaviorSubject<User | null>(null);
  private passwordsSubject = new BehaviorSubject<SavedPassword[]>([]);

  public user$ = this.userSubject.asObservable();
  public passwords$ = this.passwordsSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  // Métodos para usuário
  setUser(user: User | null): void {
    this.userSubject.next(user);
    this.saveToStorage(this.STORAGE_KEYS.USER, user);
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    return this.userSubject.value !== null;
  }

  logout(): void {
    this.setUser(null);
  }

  // Métodos para senhas
  savePassword(passwordData: Omit<SavedPassword, 'id' | 'createdAt' | 'updatedAt'>): void {
    const newPassword: SavedPassword = {
      ...passwordData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const currentPasswords = this.passwordsSubject.value;
    const updatedPasswords = [...currentPasswords, newPassword];
    
    this.passwordsSubject.next(updatedPasswords);
    this.saveToStorage(this.STORAGE_KEYS.PASSWORDS, updatedPasswords);
  }

  updatePassword(id: string, updates: Partial<Omit<SavedPassword, 'id' | 'createdAt'>>): void {
    const currentPasswords = this.passwordsSubject.value;
    const updatedPasswords = currentPasswords.map(p => 
      p.id === id 
        ? { ...p, ...updates, updatedAt: new Date() }
        : p
    );
    
    this.passwordsSubject.next(updatedPasswords);
    this.saveToStorage(this.STORAGE_KEYS.PASSWORDS, updatedPasswords);
  }

  deletePassword(id: string): void {
    const currentPasswords = this.passwordsSubject.value;
    const updatedPasswords = currentPasswords.filter(p => p.id !== id);
    
    this.passwordsSubject.next(updatedPasswords);
    this.saveToStorage(this.STORAGE_KEYS.PASSWORDS, updatedPasswords);
  }

  getPasswordById(id: string): SavedPassword | undefined {
    return this.passwordsSubject.value.find(p => p.id === id);
  }

  searchPasswords(query: string): SavedPassword[] {
    const lowerQuery = query.toLowerCase();
    return this.passwordsSubject.value.filter(p => 
      p.title.toLowerCase().includes(lowerQuery) ||
      p.notes?.toLowerCase().includes(lowerQuery) ||
      p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  clearAllPasswords(): void {
    this.passwordsSubject.next([]);
    this.saveToStorage(this.STORAGE_KEYS.PASSWORDS, []);
  }

  // Métodos para configurações
  setSetting(key: string, value: any): void {
    const settings = this.getSettings();
    settings[key] = value;
    this.saveToStorage(this.STORAGE_KEYS.SETTINGS, settings);
  }

  getSetting(key: string, defaultValue?: any): any {
    const settings = this.getSettings();
    return settings[key] !== undefined ? settings[key] : defaultValue;
  }

  private getSettings(): any {
    const settings = localStorage.getItem(this.STORAGE_KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : {};
  }

  // Utilitários
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private saveToStorage(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      // Carregar usuário
      const userData = localStorage.getItem(this.STORAGE_KEYS.USER);
      if (userData) {
        this.userSubject.next(JSON.parse(userData));
      }

      // Carregar senhas
      const passwordsData = localStorage.getItem(this.STORAGE_KEYS.PASSWORDS);
      if (passwordsData) {
        const passwords = JSON.parse(passwordsData).map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt)
        }));
        this.passwordsSubject.next(passwords);
      }
    } catch (error) {
      console.error('Erro ao carregar do localStorage:', error);
    }
  }
}
