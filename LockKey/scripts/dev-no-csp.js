// Script para executar o projeto em desenvolvimento sem CSP
// Este script remove temporariamente a tag CSP do index.html

const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../src/index.html');

// Ler o arquivo index.html
let content = fs.readFileSync(indexPath, 'utf8');

// Remover a tag CSP
content = content.replace(
  /<!-- Content Security Policy -->[\s\S]*?<meta http-equiv="Content-Security-Policy"[\s\S]*?>/g,
  '<!-- CSP removido para desenvolvimento -->'
);

// Escrever o arquivo modificado
fs.writeFileSync(indexPath, content);

console.log('CSP removido do index.html para desenvolvimento');
console.log('Execute: ionic serve');
