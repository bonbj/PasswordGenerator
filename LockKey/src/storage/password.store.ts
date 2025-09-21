import { makeAutoObservable } from 'mobx';
import { PasswordOptions } from '../providers/password.provider';

export interface SavedPassword {
  id: string;
  title: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  notes?: string;
}

export class PasswordStore {
  // Estado
  savedPasswords: SavedPassword[] = [];
  currentPassword: string = '';
  passwordOptions: PasswordOptions = {
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false
  };

  constructor() {
    makeAutoObservable(this);
    this.loadFromStorage();
  }

  // Actions
  setCurrentPassword(password: string) {
    this.currentPassword = password;
  }

  setPasswordOptions(options: Partial<PasswordOptions>) {
    this.passwordOptions = { ...this.passwordOptions, ...options };
    this.saveToStorage();
  }

  savePassword(passwordData: Omit<SavedPassword, 'id' | 'createdAt' | 'updatedAt'>) {
    const newPassword: SavedPassword = {
      ...passwordData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.savedPasswords.push(newPassword);
    this.saveToStorage();
  }

  updatePassword(id: string, updates: Partial<Omit<SavedPassword, 'id' | 'createdAt'>>) {
    const index = this.savedPasswords.findIndex(p => p.id === id);
    if (index !== -1) {
      this.savedPasswords[index] = {
        ...this.savedPasswords[index],
        ...updates,
        updatedAt: new Date()
      };
      this.saveToStorage();
    }
  }

  deletePassword(id: string) {
    this.savedPasswords = this.savedPasswords.filter(p => p.id !== id);
    this.saveToStorage();
  }

  clearAllPasswords() {
    this.savedPasswords = [];
    this.saveToStorage();
  }

  // Getters
  get passwordsCount() {
    return this.savedPasswords.length;
  }

  getPasswordById(id: string): SavedPassword | undefined {
    return this.savedPasswords.find(p => p.id === id);
  }

  getPasswordsByTag(tag: string): SavedPassword[] {
    return this.savedPasswords.filter(p => p.tags.includes(tag));
  }

  searchPasswords(query: string): SavedPassword[] {
    const lowerQuery = query.toLowerCase();
    return this.savedPasswords.filter(p => 
      p.title.toLowerCase().includes(lowerQuery) ||
      p.notes?.toLowerCase().includes(lowerQuery) ||
      p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // Utilitários
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Persistência
  private saveToStorage() {
    try {
      const data = {
        savedPasswords: this.savedPasswords,
        passwordOptions: this.passwordOptions
      };
      localStorage.setItem('password_store', JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar passwords no localStorage:', error);
    }
  }

  private loadFromStorage() {
    try {
      const savedData = localStorage.getItem('password_store');
      if (savedData) {
        const data = JSON.parse(savedData);
        
        if (data.savedPasswords) {
          this.savedPasswords = data.savedPasswords.map((p: any) => ({
            ...p,
            createdAt: new Date(p.createdAt),
            updatedAt: new Date(p.updatedAt)
          }));
        }
        
        if (data.passwordOptions) {
          this.passwordOptions = data.passwordOptions;
        }
      }
    } catch (error) {
      console.error('Erro ao carregar passwords do localStorage:', error);
    }
  }
}
