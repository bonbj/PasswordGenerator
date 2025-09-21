import { Injectable } from '@angular/core';

export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PasswordProvider {
  private readonly UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private readonly LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
  private readonly NUMBERS = '0123456789';
  private readonly SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  private readonly SIMILAR_CHARS = 'il1Lo0O';
  private readonly AMBIGUOUS_CHARS = '{}[]()/\\\'"`~,;.<>';

  generatePassword(options: PasswordOptions): string {
    let charset = '';
    
    if (options.includeUppercase) {
      charset += this.UPPERCASE;
    }
    if (options.includeLowercase) {
      charset += this.LOWERCASE;
    }
    if (options.includeNumbers) {
      charset += this.NUMBERS;
    }
    if (options.includeSymbols) {
      charset += this.SYMBOLS;
    }

    // Remover caracteres similares se solicitado
    if (options.excludeSimilar) {
      charset = this.removeChars(charset, this.SIMILAR_CHARS);
    }

    // Remover caracteres ambíguos se solicitado
    if (options.excludeAmbiguous) {
      charset = this.removeChars(charset, this.AMBIGUOUS_CHARS);
    }

    if (charset.length === 0) {
      throw new Error('Nenhum tipo de caractere foi selecionado');
    }

    let password = '';
    for (let i = 0; i < options.length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }

    return password;
  }

  validatePassword(password: string): { isValid: boolean; score: number; feedback: string[] } {
    const feedback: string[] = [];
    let score = 0;

    // Verificar comprimento
    if (password.length < 8) {
      feedback.push('Senha muito curta (mínimo 8 caracteres)');
    } else if (password.length >= 12) {
      score += 2;
    } else {
      score += 1;
    }

    // Verificar maiúsculas
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Adicione letras maiúsculas');
    }

    // Verificar minúsculas
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Adicione letras minúsculas');
    }

    // Verificar números
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Adicione números');
    }

    // Verificar símbolos
    if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Adicione símbolos especiais');
    }

    // Verificar sequências comuns
    if (this.hasCommonSequences(password)) {
      score -= 1;
      feedback.push('Evite sequências comuns');
    }

    return {
      isValid: score >= 4,
      score: Math.max(0, score),
      feedback
    };
  }

  private removeChars(charset: string, charsToRemove: string): string {
    return charset.split('').filter(char => !charsToRemove.includes(char)).join('');
  }

  private hasCommonSequences(password: string): boolean {
    const commonSequences = ['123', 'abc', 'qwe', 'asd', 'zxc'];
    const lowerPassword = password.toLowerCase();
    
    return commonSequences.some(seq => lowerPassword.includes(seq));
  }
}
