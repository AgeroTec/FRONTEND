export class Document {
  private constructor(private readonly value: string) {}

  static fromCPF(cpf: string): Document {
    const cleaned = cpf.replace(/\D/g, '');
    if (!this.isValidCPF(cleaned)) {
      throw new Error('CPF inválido');
    }
    return new Document(this.formatCPF(cleaned));
  }

  static fromCNPJ(cnpj: string): Document {
    const cleaned = cnpj.replace(/\D/g, '');
    if (!this.isValidCNPJ(cleaned)) {
      throw new Error('CNPJ inválido');
    }
    return new Document(this.formatCNPJ(cleaned));
  }

  static fromString(value: string): Document | null {
    if (!value) return null;

    const cleaned = value.replace(/\D/g, '');

    if (cleaned.length === 11) {
      return this.fromCPF(cleaned);
    } else if (cleaned.length === 14) {
      return this.fromCNPJ(cleaned);
    }

    throw new Error('Documento deve ter 11 (CPF) ou 14 (CNPJ) dígitos');
  }

  private static isValidCPF(cpf: string): boolean {
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(10))) return false;

    return true;
  }

  private static isValidCNPJ(cnpj: string): boolean {
    if (cnpj.length !== 14) return false;
    if (/^(\d)\1+$/.test(cnpj)) return false;

    let sum = 0;
    let weight = 5;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cnpj.charAt(i)) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (digit !== parseInt(cnpj.charAt(12))) return false;

    sum = 0;
    weight = 6;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cnpj.charAt(i)) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (digit !== parseInt(cnpj.charAt(13))) return false;

    return true;
  }

  private static formatCPF(cpf: string): string {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  private static formatCNPJ(cnpj: string): string {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  get raw(): string {
    return this.value.replace(/\D/g, '');
  }

  get formatted(): string {
    return this.value;
  }

  isCPF(): boolean {
    return this.raw.length === 11;
  }

  isCNPJ(): boolean {
    return this.raw.length === 14;
  }

  toString(): string {
    return this.formatted;
  }
}
