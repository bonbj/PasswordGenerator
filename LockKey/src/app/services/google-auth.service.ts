import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GOOGLE_CONFIG } from '../../environments/google-config';

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  accessToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  private readonly CLIENT_ID = GOOGLE_CONFIG.CLIENT_ID;
  private readonly SCOPES = GOOGLE_CONFIG.SCOPES.join(' ');

  private userSubject = new BehaviorSubject<GoogleUser | null>(null);
  public user$ = this.userSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.loadStoredUser();
  }

  /**
   * Inicia o processo de login com Google
   */
  async signIn(): Promise<GoogleUser | null> {
    try {
      // Verifica se a API do Google está disponível
      if (!window.google || !window.google.accounts) {
        await this.loadGoogleAPI();
      }

      return new Promise((resolve, reject) => {
        window.google.accounts.oauth2.initTokenClient({
          client_id: this.CLIENT_ID,
          scope: this.SCOPES,
          callback: (response: any) => {
            if (response.error) {
              console.error('Erro na autenticação:', response.error);
              reject(response.error);
              return;
            }
            this.handleAuthResponse(response.access_token);
            resolve(this.userSubject.value);
          }
        }).requestAccessToken();
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  }

  /**
   * Faz logout do usuário
   */
  signOut(): void {
    this.userSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    localStorage.removeItem('google_user');
    localStorage.removeItem('google_access_token');
  }

  /**
   * Obtém o usuário atual
   */
  getCurrentUser(): GoogleUser | null {
    return this.userSubject.value;
  }

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Obtém o token de acesso atual
   */
  getAccessToken(): string | null {
    return localStorage.getItem('google_access_token');
  }

  /**
   * Carrega a API do Google
   */
  private async loadGoogleAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.accounts) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Falha ao carregar Google API'));
      document.head.appendChild(script);
    });
  }

  /**
   * Processa a resposta de autenticação
   */
  private async handleAuthResponse(accessToken: string): Promise<void> {
    try {
      // Salva o token
      localStorage.setItem('google_access_token', accessToken);

      // Obtém informações do usuário
      const userInfo = await this.getUserInfo(accessToken);
      
      const user: GoogleUser = {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        accessToken: accessToken
      };

      // Salva o usuário
      this.userSubject.next(user);
      this.isAuthenticatedSubject.next(true);
      localStorage.setItem('google_user', JSON.stringify(user));
    } catch (error) {
      console.error('Erro ao processar autenticação:', error);
      throw error;
    }
  }

  /**
   * Obtém informações do usuário do Google
   */
  private async getUserInfo(accessToken: string): Promise<any> {
    const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
    if (!response.ok) {
      throw new Error('Falha ao obter informações do usuário');
    }
    return await response.json();
  }

  /**
   * Carrega usuário salvo do localStorage
   */
  private loadStoredUser(): void {
    const storedUser = localStorage.getItem('google_user');
    const storedToken = localStorage.getItem('google_access_token');

    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser);
        // Verifica se o token ainda é válido
        this.verifyToken(storedToken).then(isValid => {
          if (isValid) {
            this.userSubject.next(user);
            this.isAuthenticatedSubject.next(true);
          } else {
            this.signOut();
          }
        });
      } catch (error) {
        console.error('Erro ao carregar usuário salvo:', error);
        this.signOut();
      }
    }
  }

  /**
   * Verifica se o token ainda é válido
   */
  private async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Renova o token se necessário
   */
  async refreshTokenIfNeeded(): Promise<string | null> {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const isValid = await this.verifyToken(token);
      if (isValid) {
        return token;
      } else {
        // Token expirado, precisa fazer login novamente
        this.signOut();
        return null;
      }
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      this.signOut();
      return null;
    }
  }
}

// Declaração global para TypeScript
declare global {
  interface Window {
    google: any;
  }
}
