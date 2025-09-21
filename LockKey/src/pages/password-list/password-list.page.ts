import { Component, OnInit } from '@angular/core';
import { SimpleStorageService, SavedPassword } from '../../storage/simple-storage.service';

@Component({
  selector: 'app-password-list',
  templateUrl: './password-list.page.html',
  styleUrls: ['./password-list.page.scss']
})
export class PasswordListPage implements OnInit {
  passwords: SavedPassword[] = [];
  searchQuery: string = '';

  constructor(private storageService: SimpleStorageService) {}

  ngOnInit() {
    this.loadPasswords();
  }

  loadPasswords() {
    this.storageService.passwords$.subscribe(passwords => {
      this.passwords = passwords;
    });
  }

  searchPasswords() {
    if (this.searchQuery.trim()) {
      this.passwords = this.storageService.searchPasswords(this.searchQuery);
    } else {
      this.loadPasswords();
    }
  }

  deletePassword(id: string) {
    if (confirm('Tem certeza que deseja excluir esta senha?')) {
      this.storageService.deletePassword(id);
    }
  }

  copyPassword(password: string) {
    navigator.clipboard.writeText(password).then(() => {
      // Implementar feedback visual
      console.log('Senha copiada para a área de transferência');
    });
  }
}
