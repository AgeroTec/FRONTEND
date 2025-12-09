export function formatCNPJ(value: string): string {
  const numbers = value.replace(/\D/g, '');

  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
  if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
  if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;

  return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
}

export function formatCPF(value: string): string {
  const numbers = value.replace(/\D/g, '');

  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;

  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
}

export function removeMask(value: string): string {
  return value.replace(/\D/g, '');
}

export function validateCNPJ(cnpj: string): boolean {
  const numbers = removeMask(cnpj);

  if (numbers.length !== 14) return false;
  if (/^(\d)\1+$/.test(numbers)) return false;

  let sum = 0;
  let pos = 5;

  for (let i = 0; i < 12; i++) {
    sum += parseInt(numbers.charAt(i)) * pos;
    pos = pos === 2 ? 9 : pos - 1;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(numbers.charAt(12))) return false;

  sum = 0;
  pos = 6;

  for (let i = 0; i < 13; i++) {
    sum += parseInt(numbers.charAt(i)) * pos;
    pos = pos === 2 ? 9 : pos - 1;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return result === parseInt(numbers.charAt(13));
}

export function validateCPF(cpf: string): boolean {
  const numbers = removeMask(cpf);

  if (numbers.length !== 11) return false;
  if (/^(\d)\1+$/.test(numbers)) return false;

  let sum = 0;

  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers.charAt(i)) * (10 - i);
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(numbers.charAt(9))) return false;

  sum = 0;

  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers.charAt(i)) * (11 - i);
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return result === parseInt(numbers.charAt(10));
}

export function getDocumentType(value: string): 'cnpj' | 'cpf' | null {
  const numbers = removeMask(value);

  if (numbers.length === 14) return 'cnpj';
  if (numbers.length === 11) return 'cpf';

  return null;
}
