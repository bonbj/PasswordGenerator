import { Component, OnInit } from '@angular/core';
import { PasswordProvider, PasswordOptions } from '../../providers/password.provider';
import { PasswordStore } from '../../storage/password.store';

@Component({
  selector: 'app-password-generator',
  templateUrl: './password-generator.component.html',
  styleUrls: ['./password-generator.component.scss']
})
export class PasswordGeneratorComponent implements OnInit {
  password: string = '';
  showPassword: boolean = false;
  passwordOptions: PasswordOptions = {
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false
  };

  constructor(
    private passwordProvider: PasswordProvider,
    private passwordStore: PasswordStore
  ) {}

  ngOnInit() {
    this.passwordOptions = { ...this.passwordStore.passwordOptions };
  }

  generatePassword() {
    try {
      this.password = this.passwordProvider.generatePassword(this.passwordOptions);
      this.passwordStore.setCurrentPassword(this.password);
    } catch (error) {
      console.error('Erro ao gerar senha:', error);
    }
  }

  updateOption(option: keyof PasswordOptions, value: any) {
    this.passwordOptions[option] = value;
    this.passwordStore.setPasswordOptions(this.passwordOptions);
  }

  copyToClipboard() {
    if (this.password) {
      navigator.clipboard.writeText(this.password).then(() => {
        // Implementar feedback visual
        console.log('Senha copiada para a área de transferência');
      });
    }
  }

  savePassword() {
    if (this.password) {
      const title = prompt('Digite um título para a senha:');
      if (title) {
        this.passwordStore.savePassword({
          title,
          password: this.password,
          tags: [],
          notes: ''
        });
      }
    }
  }

  canGeneratePassword(): boolean {
    return this.passwordOptions.includeUppercase || 
           this.passwordOptions.includeLowercase || 
           this.passwordOptions.includeNumbers || 
           this.passwordOptions.includeSymbols;
  }
}
