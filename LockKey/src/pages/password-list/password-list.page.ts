import { Component, OnInit } from '@angular/core';
import { PasswordStore, SavedPassword } from '../../storage/password.store';

@Component({
  selector: 'app-password-list',
  templateUrl: './password-list.page.html',
  styleUrls: ['./password-list.page.scss']
})
export class PasswordListPage implements OnInit {
  passwords: SavedPassword[] = [];
  searchQuery: string = '';

  constructor(private passwordStore: PasswordStore) {}

  ngOnInit() {
    this.loadPasswords();
  }

  loadPasswords() {
    this.passwords = this.passwordStore.savedPasswords;
  }

  searchPasswords() {
    if (this.searchQuery.trim()) {
      this.passwords = this.passwordStore.searchPasswords(this.searchQuery);
    } else {
      this.loadPasswords();
    }
  }

  deletePassword(id: string) {
    if (confirm('Tem certeza que deseja excluir esta senha?')) {
      this.passwordStore.deletePassword(id);
      this.loadPasswords();
    }
  }

  copyPassword(password: string) {
    navigator.clipboard.writeText(password).then(() => {
      // Implementar feedback visual
      console.log('Senha copiada para a área de transferência');
    });
  }
}
