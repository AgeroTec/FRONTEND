export class Status {
  private constructor(private readonly value: 'S' | 'N') {}

  static active(): Status {
    return new Status('S');
  }

  static inactive(): Status {
    return new Status('N');
  }

  static fromString(value: string): Status {
    if (value !== 'S' && value !== 'N') {
      throw new Error('Status deve ser "S" (Ativo) ou "N" (Inativo)');
    }
    return new Status(value);
  }

  get isActive(): boolean {
    return this.value === 'S';
  }

  get label(): string {
    return this.isActive ? 'Ativo' : 'Inativo';
  }

  get badgeClass(): string {
    return this.isActive
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  }

  toString(): string {
    return this.value;
  }

  toJSON(): string {
    return this.value;
  }
}
