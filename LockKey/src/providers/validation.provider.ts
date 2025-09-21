import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationProvider {
  
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('A senha deve ter pelo menos 8 caracteres');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('A senha deve conter pelo menos uma letra maiúscula');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('A senha deve conter pelo menos uma letra minúscula');
    }

    if (!/\d/.test(password)) {
      errors.push('A senha deve conter pelo menos um número');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
      errors.push('A senha deve conter pelo menos um símbolo especial');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateRequired(value: any, fieldName: string): { isValid: boolean; error: string } {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return {
        isValid: false,
        error: `${fieldName} é obrigatório`
      };
    }

    return {
      isValid: true,
      error: ''
    };
  }

  validateMinLength(value: string, minLength: number, fieldName: string): { isValid: boolean; error: string } {
    if (value.length < minLength) {
      return {
        isValid: false,
        error: `${fieldName} deve ter pelo menos ${minLength} caracteres`
      };
    }

    return {
      isValid: true,
      error: ''
    };
  }

  validateMaxLength(value: string, maxLength: number, fieldName: string): { isValid: boolean; error: string } {
    if (value.length > maxLength) {
      return {
        isValid: false,
        error: `${fieldName} deve ter no máximo ${maxLength} caracteres`
      };
    }

    return {
      isValid: true,
      error: ''
    };
  }
}
