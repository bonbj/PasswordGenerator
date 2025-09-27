import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAuthService } from '../../services/google-auth.service';
import { GoogleDriveService } from '../../services/google-drive.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isLoading = false;

  constructor(
    private router: Router,
    private googleAuth: GoogleAuthService,
    private googleDrive: GoogleDriveService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    // Verifica se já está autenticado
    if (this.googleAuth.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

  async signInWithGoogle() {
    this.isLoading = true;
    
    try {
      const user = await this.googleAuth.signIn();
      
      if (user) {
        // Inicializa o Google Drive
        await this.googleDrive.initialize();
        
        // Mostra mensagem de sucesso
        const toast = await this.toastController.create({
          message: `Bem-vindo, ${user.name}!`,
          duration: 2000,
          color: 'success'
        });
        await toast.present();

        // Navega para a página inicial
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.error('Erro no login:', error);
      
      const toast = await this.toastController.create({
        message: 'Erro ao fazer login. Tente novamente.',
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
    } finally {
      this.isLoading = false;
    }
  }

  continueWithoutLogin() {
    this.router.navigate(['/home']);
  }
}
