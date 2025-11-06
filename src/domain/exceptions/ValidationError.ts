export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

export class RequiredFieldError extends ValidationError {
  constructor(field: string) {
    super(`O campo ${field} é obrigatório`, field);
    this.name = "RequiredFieldError";
  }
}

export class InvalidFormatError extends ValidationError {
  constructor(field: string, expectedFormat: string) {
    super(`O campo ${field} está em formato inválido. Esperado: ${expectedFormat}`, field);
    this.name = "InvalidFormatError";
  }
}
