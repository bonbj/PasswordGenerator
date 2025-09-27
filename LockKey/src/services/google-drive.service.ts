import { Injectable } from '@angular/core';
import { GoogleAuthService } from './google-auth.service';
import { SavedPassword } from '../storage/simple-storage.service';

export interface DriveFile {
  id: string;
  name: string;
  createdTime: string;
  modifiedTime: string;
  size: string;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleDriveService {
  private readonly DRIVE_API_URL = 'https://www.googleapis.com/drive/v3';
  private readonly APP_FOLDER_NAME = 'PasswordGenerator';
  private appFolderId: string | null = null;

  constructor(private googleAuth: GoogleAuthService) {}

  /**
   * Inicializa o serviço e cria/encontra a pasta da aplicação
   */
  async initialize(): Promise<void> {
    if (!this.googleAuth.isAuthenticated()) {
      throw new Error('Usuário não autenticado');
    }

    await this.ensureAppFolder();
  }

  /**
   * Salva senhas no Google Drive
   */
  async savePasswords(passwords: SavedPassword[]): Promise<void> {
    try {
      await this.initialize();
      
      const token = await this.googleAuth.refreshTokenIfNeeded();
      if (!token) {
        throw new Error('Token de acesso inválido');
      }

      const fileName = 'passwords.json';
      const fileContent = JSON.stringify(passwords, null, 2);
      const mimeType = 'application/json';

      // Verifica se o arquivo já existe
      const existingFile = await this.findFile(fileName);
      
      if (existingFile) {
        // Atualiza arquivo existente
        await this.updateFile(existingFile.id, fileContent, mimeType, token);
      } else {
        // Cria novo arquivo
        await this.createFile(fileName, fileContent, mimeType, token);
      }
    } catch (error) {
      console.error('Erro ao salvar senhas no Drive:', error);
      throw error;
    }
  }

  /**
   * Carrega senhas do Google Drive
   */
  async loadPasswords(): Promise<SavedPassword[]> {
    try {
      await this.initialize();
      
      const token = await this.googleAuth.refreshTokenIfNeeded();
      if (!token) {
        throw new Error('Token de acesso inválido');
      }

      const fileName = 'passwords.json';
      const file = await this.findFile(fileName);
      
      if (!file) {
        return []; // Arquivo não existe, retorna array vazio
      }

      const content = await this.downloadFile(file.id, token);
      return JSON.parse(content);
    } catch (error) {
      console.error('Erro ao carregar senhas do Drive:', error);
      return [];
    }
  }

  /**
   * Lista arquivos na pasta da aplicação
   */
  async listFiles(): Promise<DriveFile[]> {
    try {
      await this.initialize();
      
      const token = await this.googleAuth.refreshTokenIfNeeded();
      if (!token) {
        throw new Error('Token de acesso inválido');
      }

      const response = await fetch(
        `${this.DRIVE_API_URL}/files?q='${this.appFolderId}' in parents&fields=files(id,name,createdTime,modifiedTime,size)`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Falha ao listar arquivos');
      }

      const data = await response.json();
      return data.files || [];
    } catch (error) {
      console.error('Erro ao listar arquivos:', error);
      return [];
    }
  }

  /**
   * Cria ou encontra a pasta da aplicação
   */
  private async ensureAppFolder(): Promise<void> {
    if (this.appFolderId) return;

    const token = await this.googleAuth.refreshTokenIfNeeded();
    if (!token) {
      throw new Error('Token de acesso inválido');
    }

    // Procura pela pasta existente
    const existingFolder = await this.findFolder(this.APP_FOLDER_NAME, token);
    
    if (existingFolder) {
      this.appFolderId = existingFolder.id;
    } else {
      // Cria nova pasta
      this.appFolderId = await this.createFolder(this.APP_FOLDER_NAME, token);
    }
  }

  /**
   * Procura por uma pasta pelo nome
   */
  private async findFolder(folderName: string, token: string): Promise<DriveFile | null> {
    const response = await fetch(
      `${this.DRIVE_API_URL}/files?q=name='${folderName}' and mimeType='application/vnd.google-apps.folder'&fields=files(id,name)`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Falha ao procurar pasta');
    }

    const data = await response.json();
    return data.files && data.files.length > 0 ? data.files[0] : null;
  }

  /**
   * Cria uma nova pasta
   */
  private async createFolder(folderName: string, token: string): Promise<string> {
    const metadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder'
    };

    const response = await fetch(`${this.DRIVE_API_URL}/files`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(metadata)
    });

    if (!response.ok) {
      throw new Error('Falha ao criar pasta');
    }

    const data = await response.json();
    return data.id;
  }

  /**
   * Procura por um arquivo pelo nome na pasta da aplicação
   */
  private async findFile(fileName: string): Promise<DriveFile | null> {
    const token = await this.googleAuth.refreshTokenIfNeeded();
    if (!token) {
      throw new Error('Token de acesso inválido');
    }

    const response = await fetch(
      `${this.DRIVE_API_URL}/files?q=name='${fileName}' and '${this.appFolderId}' in parents&fields=files(id,name)`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Falha ao procurar arquivo');
    }

    const data = await response.json();
    return data.files && data.files.length > 0 ? data.files[0] : null;
  }

  /**
   * Cria um novo arquivo
   */
  private async createFile(fileName: string, content: string, mimeType: string, token: string): Promise<void> {
    const metadata = {
      name: fileName,
      parents: [this.appFolderId]
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', new Blob([content], { type: mimeType }));

    const response = await fetch(
      `${this.DRIVE_API_URL}/files?uploadType=multipart`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: form
      }
    );

    if (!response.ok) {
      throw new Error('Falha ao criar arquivo');
    }
  }

  /**
   * Atualiza um arquivo existente
   */
  private async updateFile(fileId: string, content: string, mimeType: string, token: string): Promise<void> {
    const form = new FormData();
    form.append('file', new Blob([content], { type: mimeType }));

    const response = await fetch(
      `${this.DRIVE_API_URL}/files/${fileId}?uploadType=media`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: form
      }
    );

    if (!response.ok) {
      throw new Error('Falha ao atualizar arquivo');
    }
  }

  /**
   * Baixa o conteúdo de um arquivo
   */
  private async downloadFile(fileId: string, token: string): Promise<string> {
    const response = await fetch(
      `${this.DRIVE_API_URL}/files/${fileId}?alt=media`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Falha ao baixar arquivo');
    }

    return await response.text();
  }

  /**
   * Exclui um arquivo
   */
  async deleteFile(fileId: string): Promise<void> {
    const token = await this.googleAuth.refreshTokenIfNeeded();
    if (!token) {
      throw new Error('Token de acesso inválido');
    }

    const response = await fetch(
      `${this.DRIVE_API_URL}/files/${fileId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Falha ao excluir arquivo');
    }
  }

  /**
   * Verifica se o serviço está disponível
   */
  isAvailable(): boolean {
    return this.googleAuth.isAuthenticated();
  }
}
