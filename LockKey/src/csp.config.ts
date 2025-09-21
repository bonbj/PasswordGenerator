// Configuração de Content Security Policy
export const CSP_CONFIG = {
  development: `
    default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:;
    connect-src 'self' http://localhost:* https://localhost:* ws://localhost:* wss://localhost:*;
    img-src 'self' data: blob:;
    font-src 'self' data:;
    style-src 'self' 'unsafe-inline';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
  `,
  
  production: `
    default-src 'self';
    connect-src 'self' https:;
    img-src 'self' data: blob:;
    font-src 'self' data:;
    style-src 'self' 'unsafe-inline';
    script-src 'self';
  `
};

// Função para obter CSP baseado no ambiente
export function getCSPConfig(isProduction: boolean = false): string {
  return isProduction ? CSP_CONFIG.production : CSP_CONFIG.development;
}
