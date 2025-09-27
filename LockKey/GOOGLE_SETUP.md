# Configuração do Google OAuth e Drive API

Este documento explica como configurar a autenticação Google e integração com Google Drive para o PasswordGenerator.

## 📋 Pré-requisitos

1. Conta Google
2. Acesso ao Google Cloud Console
3. Projeto Ionic/Angular configurado

## 🔧 Configuração Passo a Passo

### 1. Criar Projeto no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Clique em "Selecionar projeto" > "Novo projeto"
3. Digite o nome: `PasswordGenerator`
4. Clique em "Criar"

### 2. Ativar APIs Necessárias

1. No menu lateral, vá para "APIs e serviços" > "Biblioteca"
2. Procure e ative as seguintes APIs:
   - **Google Drive API**
   - **Google+ API** (para informações do usuário)

### 3. Configurar OAuth 2.0

1. Vá para "APIs e serviços" > "Credenciais"
2. Clique em "Criar credenciais" > "ID do cliente OAuth 2.0"
3. Selecione "Aplicativo da Web"
4. Configure as URLs de redirecionamento:
   - `http://localhost:4200` (desenvolvimento)
   - `http://localhost:8100` (Ionic serve)
   - `https://seudominio.com` (produção)

### 4. Configurar o Client ID

1. Copie o **Client ID** gerado
2. Abra o arquivo `src/environments/google-config.ts`
3. Substitua `YOUR_GOOGLE_CLIENT_ID_HERE` pelo seu Client ID

```typescript
export const GOOGLE_CONFIG = {
  CLIENT_ID: '123456789-abcdefghijklmnop.apps.googleusercontent.com',
  // ... resto da configuração
};
```

### 5. Configurar Domínios Autorizados

1. No Google Cloud Console, vá para "APIs e serviços" > "Tela de consentimento OAuth"
2. Adicione os domínios que usarão a aplicação:
   - `localhost` (desenvolvimento)
   - `seudominio.com` (produção)

## 🔐 Permissões Necessárias

A aplicação solicita as seguintes permissões:

- **Google Drive**: Acesso para criar/editar arquivos na pasta do usuário
- **Perfil do usuário**: Nome e email para identificação
- **Email**: Para associar senhas à conta

## 📁 Estrutura de Arquivos no Drive

As senhas são salvas em uma pasta chamada `PasswordGenerator` no Google Drive do usuário, contendo:

- `passwords.json` - Arquivo principal com todas as senhas
- Backup automático no localStorage

## 🚀 Testando a Integração

1. Execute o projeto: `npm run start:no-csp`
2. Acesse `http://localhost:4200`
3. Clique em "Entrar com Google"
4. Autorize as permissões
5. Verifique se a pasta `PasswordGenerator` foi criada no seu Drive

## ⚠️ Troubleshooting

### Erro: "This app isn't verified"

- **Solução**: Adicione seu email como usuário de teste no Google Cloud Console
- Vá para "Tela de consentimento OAuth" > "Usuários de teste"

### Erro: "redirect_uri_mismatch"

- **Solução**: Verifique se as URLs de redirecionamento estão corretas
- Adicione `http://localhost:4200` e `http://localhost:8100`

### Erro: "access_denied"

- **Solução**: Verifique se as APIs estão ativadas
- Confirme se o Client ID está correto

## 🔒 Segurança

- As senhas são salvas apenas no Google Drive pessoal do usuário
- Não há servidor intermediário
- Todas as comunicações usam HTTPS
- Tokens de acesso são armazenados localmente de forma segura

## 📱 Produção

Para usar em produção:

1. Configure um domínio personalizado
2. Adicione o domínio nas URLs de redirecionamento
3. Configure a tela de consentimento OAuth
4. Publique a aplicação

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do console do navegador
2. Confirme se todas as APIs estão ativadas
3. Teste com uma conta Google diferente
4. Verifique se o Client ID está correto
