import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAuthService, GoogleUser } from './services/google-auth.service';
import { SimpleStorageService } from '../storage/simple-storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  currentUser: GoogleUser | null = null;
  private authSubscription?: Subscription;

  constructor(
    private googleAuth: GoogleAuthService,
    private storage: SimpleStorageService,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscrever às mudanças de autenticação
    this.authSubscription = this.googleAuth.user$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.currentUser = user;
      
      if (user) {
        // Converte GoogleUser para User do storage
        this.storage.setUser({
          id: user.id,
          email: user.email,
          name: user.name
        });
        
        // Habilita sincronização com Google Drive
        this.storage.enableGoogleDriveSync().catch(error => {
          console.error('Erro ao habilitar sincronização:', error);
        });
        
        // Redireciona para home se estiver na página de login
        if (this.router.url === '/login') {
          this.router.navigate(['/home']);
        }
      } else {
        // Limpa dados do storage
        this.storage.setUser(null);
        this.storage.disableGoogleDriveSync();
        
        // Redireciona para login se não estiver na página de login
        if (this.router.url !== '/login') {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  logout() {
    this.googleAuth.signOut();
  }
}
