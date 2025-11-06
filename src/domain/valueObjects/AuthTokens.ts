export interface AuthTokens {
  accessToken: string;
  tokenType: string;
  expiresIn?: number;
  issuedAt?: string;
  refreshToken?: string;
}

export class AuthTokensVO {
  private constructor(private readonly value: AuthTokens) {
    this.validate();
  }

  static create(tokens: AuthTokens): AuthTokensVO {
    return new AuthTokensVO(tokens);
  }

  private validate(): void {
    if (!this.value.accessToken || this.value.accessToken.trim() === "") {
      throw new Error("Token de acesso é obrigatório");
    }

    if (!this.value.tokenType || this.value.tokenType.trim() === "") {
      throw new Error("Tipo de token é obrigatório");
    }
  }

  get accessToken(): string {
    return this.value.accessToken;
  }

  get tokenType(): string {
    return this.value.tokenType;
  }

  get expiresIn(): number | undefined {
    return this.value.expiresIn;
  }

  get issuedAt(): string | undefined {
    return this.value.issuedAt;
  }

  get refreshToken(): string | undefined {
    return this.value.refreshToken;
  }

  toJSON(): AuthTokens {
    return { ...this.value };
  }

  isExpired(): boolean {
    if (!this.value.expiresIn || !this.value.issuedAt) {
      return false;
    }

    const issuedTime = new Date(this.value.issuedAt).getTime();
    const expirationTime = issuedTime + this.value.expiresIn * 1000;
    return Date.now() >= expirationTime;
  }
}
