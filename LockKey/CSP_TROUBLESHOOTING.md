# Solução de Problemas - Content Security Policy (CSP)

## Problema: Erro de CSP com Chrome DevTools

### Erro Comum
```
Refused to connect to 'http://localhost:8100/.well-known/appspecific/com.chrome.devtools.json' because it violates the following Content Security Policy directive: "default-src 'none'".
```

## Soluções

### 1. Solução Rápida - Executar sem CSP
```bash
npm run start:no-csp
```

Este comando remove temporariamente a tag CSP do `index.html` e executa o projeto em modo de desenvolvimento.

### 2. Solução com CSP Configurado
```bash
npm run start:dev
```

Este comando executa o projeto com CSP configurado para permitir conexões com localhost.

### 3. Configuração Manual

#### Para Desenvolvimento
A configuração atual no `index.html` permite:
- Conexões com localhost (qualquer porta)
- WebSockets (ws:// e wss://)
- Inline styles e scripts
- Data URLs e blobs

#### Para Produção
Use a configuração mais restritiva no `environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  enableCSP: true,
  // ... outras configurações
};
```

## Configurações de CSP

### Desenvolvimento
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:;
  connect-src 'self' http://localhost:* https://localhost:* ws://localhost:* wss://localhost:*;
  img-src 'self' data: blob:;
  font-src 'self' data:;
  style-src 'self' 'unsafe-inline';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
">
```

### Produção
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  connect-src 'self' https:;
  img-src 'self' data: blob:;
  font-src 'self' data:;
  style-src 'self' 'unsafe-inline';
  script-src 'self';
">
```

## Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm start` | Executa em modo padrão |
| `npm run start:dev` | Executa em modo desenvolvimento com CSP |
| `npm run start:no-csp` | Executa sem CSP (para debug) |
| `npm run build` | Build para produção |
| `npm run build:dev` | Build para desenvolvimento |

## Verificação

### 1. Verificar se o erro foi resolvido
- Abra o DevTools (F12)
- Verifique a aba Console
- Não deve haver erros de CSP

### 2. Verificar se as funcionalidades estão funcionando
- Teste a geração de senhas
- Teste o salvamento de senhas
- Teste a navegação entre páginas

## Troubleshooting Adicional

### Se o erro persistir:

1. **Limpar cache do navegador**
   - Ctrl + Shift + R (Chrome)
   - Ou abrir em aba anônima

2. **Verificar se o servidor está rodando na porta correta**
   - Padrão: http://localhost:8100
   - Verificar se não há conflito de portas

3. **Verificar configurações do MobX**
   - O arquivo `mobx.config.ts` está configurado para desenvolvimento
   - As configurações são mais permissivas

4. **Verificar se todas as dependências estão instaladas**
   ```bash
   npm install
   ```

## Notas Importantes

- **Desenvolvimento**: Use `start:no-csp` apenas para debug
- **Produção**: Sempre use CSP configurado
- **MobX**: Configuração mais permissiva em desenvolvimento
- **Chrome DevTools**: Funciona melhor sem CSP em desenvolvimento

## Arquivos Relacionados

- `src/index.html` - Configuração de CSP
- `src/csp.config.ts` - Configurações de CSP por ambiente
- `src/environments/environment.dev.ts` - Ambiente de desenvolvimento
- `scripts/dev-no-csp.js` - Script para remover CSP
- `src/storage/mobx.config.ts` - Configuração do MobX
