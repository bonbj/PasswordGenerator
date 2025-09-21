# Arquitetura do Projeto PasswordGenerator

## Estrutura de Pastas

```
src/
├── app/                    # Configuração principal do Angular
├── components/             # Componentes reutilizáveis do Angular
│   └── password-generator/ # Componente gerador de senhas
├── pages/                  # Páginas da aplicação
│   ├── home/              # Página inicial (movida de view/pages)
│   └── password-list/     # Página de lista de senhas
├── providers/             # Regras de negócio e lógica
│   ├── password.provider.ts
│   └── validation.provider.ts
├── services/              # Conexões com APIs e serviços externos
│   ├── api.service.ts
│   └── auth.service.ts
├── storage/               # Gerenciamento de estado com MobX
│   ├── app.store.ts       # Store principal da aplicação
│   ├── password.store.ts  # Store para senhas
│   ├── mobx.config.ts     # Configuração do MobX
│   └── stores.config.ts   # Configuração dos stores
└── view/                  # Pasta antiga (pode ser removida)
```

## Padrões Utilizados

### 1. Providers
- Contêm a lógica de negócio da aplicação
- São injetáveis via Angular DI
- Exemplos: `PasswordProvider`, `ValidationProvider`

### 2. Services
- Responsáveis por comunicação com APIs externas
- Gerenciam autenticação e requisições HTTP
- Exemplos: `ApiService`, `AuthService`

### 3. Storage (MobX)
- Substitui o localStorage para gerenciamento de estado
- Stores reativos que observam mudanças
- Persistência automática no localStorage
- Exemplos: `AppStore`, `PasswordStore`

### 4. Components
- Componentes reutilizáveis do Angular
- Podem usar stores do MobX para estado
- Exemplos: `PasswordGeneratorComponent`

### 5. Pages
- Páginas da aplicação Ionic
- Organizadas em módulos separados
- Exemplos: `HomePage`, `PasswordListPage`

## Como Usar

### Usando Stores do MobX

```typescript
import { passwordStore } from '../storage/stores.config';

// Em um componente
export class MyComponent {
  constructor() {
    // Acessar dados reativos
    this.passwords = passwordStore.savedPasswords;
  }

  // Chamar actions
  savePassword(data) {
    passwordStore.savePassword(data);
  }
}
```

### Usando Providers

```typescript
import { PasswordProvider } from '../providers/password.provider';

export class MyComponent {
  constructor(private passwordProvider: PasswordProvider) {}

  generatePassword() {
    const password = this.passwordProvider.generatePassword(options);
  }
}
```

### Usando Services

```typescript
import { ApiService } from '../services/api.service';

export class MyComponent {
  constructor(private apiService: ApiService) {}

  fetchData() {
    this.apiService.get('/endpoint').subscribe(data => {
      // Processar dados
    });
  }
}
```

## Benefícios da Nova Arquitetura

1. **Separação de Responsabilidades**: Cada pasta tem uma responsabilidade específica
2. **Reutilização**: Providers e services podem ser reutilizados em diferentes componentes
3. **Gerenciamento de Estado**: MobX oferece reatividade e persistência automática
4. **Manutenibilidade**: Código mais organizado e fácil de manter
5. **Testabilidade**: Cada camada pode ser testada independentemente
6. **Escalabilidade**: Fácil adicionar novas funcionalidades seguindo os padrões estabelecidos
