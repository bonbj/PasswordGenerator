// Configuração do Google OAuth
// Substitua pelo seu Client ID do Google Cloud Console

export const GOOGLE_CONFIG = {
  // Obtenha seu Client ID em: https://console.cloud.google.com/
  CLIENT_ID: '',
  
  // Scopes necessários para a aplicação
  SCOPES: [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ],
  
  // URLs de redirecionamento (configure no Google Cloud Console)
  REDIRECT_URIS: [
    'http://localhost:4200',
    'http://localhost:8100',
    'https://yourdomain.com'
  ]
};

// Instruções para configurar:
// 1. Acesse https://console.cloud.google.com/
// 2. Crie um novo projeto ou selecione um existente
// 3. Ative a Google Drive API
// 4. Vá para "Credenciais" > "Criar credenciais" > "ID do cliente OAuth 2.0"
// 5. Configure as URLs de redirecionamento
// 6. Copie o Client ID e substitua 'YOUR_GOOGLE_CLIENT_ID_HERE' acima
