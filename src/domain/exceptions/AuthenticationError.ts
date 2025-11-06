export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class InvalidCredentialsError extends AuthenticationError {
  constructor() {
    super("Credenciais inválidas");
    this.name = "InvalidCredentialsError";
  }
}

export class TokenExpiredError extends AuthenticationError {
  constructor() {
    super("Token expirado");
    this.name = "TokenExpiredError";
  }
}

export class UnauthorizedError extends AuthenticationError {
  constructor(message = "Acesso não autorizado") {
    super(message);
    this.name = "UnauthorizedError";
  }
}
