import { Component, OnInit } from '@angular/core';
import { PasswordProvider, PasswordOptions } from '../../providers/password.provider';
import { SimpleStorageService } from '../../storage/simple-storage.service';

@Component({
  selector: 'app-generate-password',
  templateUrl: './generate-password.page.html',
  styleUrls: ['./generate-password.page.scss']
})
export class GeneratePasswordPage implements OnInit {
  password: string = '';
  showPassword: boolean = false;
  passwordOptions: PasswordOptions = {
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    includeSpaces: false,
    excludeSimilar: false,
    excludeAmbiguous: false
  };

  constructor(
    private passwordProvider: PasswordProvider,
    private storageService: SimpleStorageService
  ) {}

  ngOnInit() {
    this.loadSavedOptions();
  }

  generatePassword() {
    try {
      this.password = this.passwordProvider.generatePassword(this.passwordOptions);
      this.saveOptions();
    } catch (error) {
      console.error('Erro ao gerar senha:', error);
    }
  }

  generateSpacesOnly() {
    try {
      // Gerar senha apenas com espaços
      const spacesOnlyOptions: PasswordOptions = {
        length: this.passwordOptions.length,
        includeUppercase: false,
        includeLowercase: false,
        includeNumbers: false,
        includeSymbols: false,
        includeSpaces: true,
        excludeSimilar: false,
        excludeAmbiguous: false
      };
      
      this.password = this.passwordProvider.generatePassword(spacesOnlyOptions);
    } catch (error) {
      console.error('Erro ao gerar senha com espaços:', error);
    }
  }

  getMaskedPassword(): string {
    if (!this.password) {
      return '';
    }
    return '•'.repeat(this.password.length);
  }

  onLengthChange(event: any) {
    const value = event.detail.value;
    if (typeof value === 'number') {
      this.passwordOptions.length = value;
      this.saveOptions();
    }
  }

  updateOption(option: keyof PasswordOptions, value: boolean) {
    (this.passwordOptions as any)[option] = value;
    this.saveOptions();
  }

  copyToClipboard() {
    if (this.password) {
      navigator.clipboard.writeText(this.password).then(() => {
        // Implementar feedback visual com toast
        console.log('Senha copiada para a área de transferência');
      });
    }
  }

  savePassword() {
    if (this.password) {
      const title = prompt('Digite um título para a senha:');
      if (title) {
        this.storageService.savePassword({
          title,
          password: this.password,
          tags: [],
          notes: ''
        });
        alert('Senha salva com sucesso!');
      }
    }
  }

  canGeneratePassword(): boolean {
    return this.passwordOptions.includeUppercase || 
           this.passwordOptions.includeLowercase || 
           this.passwordOptions.includeNumbers || 
           this.passwordOptions.includeSymbols ||
           this.passwordOptions.includeSpaces;
  }

  private loadSavedOptions() {
    const savedOptions = this.storageService.getSetting('passwordOptions');
    if (savedOptions) {
      this.passwordOptions = { ...this.passwordOptions, ...savedOptions };
    }
  }

  private saveOptions() {
    this.storageService.setSetting('passwordOptions', this.passwordOptions);
  }
}
