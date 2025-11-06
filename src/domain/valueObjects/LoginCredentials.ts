export interface LoginCredentialsData {
  login: string;
  senha: string;
}

export class LoginCredentials {
  private constructor(
    private readonly _login: string,
    private readonly _senha: string
  ) {
    this.validate();
  }

  static create(data: LoginCredentialsData): LoginCredentials {
    return new LoginCredentials(data.login, data.senha);
  }

  private validate(): void {
    if (!this._login || this._login.trim() === "") {
      throw new Error("Login é obrigatório");
    }

    if (!this._senha || this._senha.trim() === "") {
      throw new Error("Senha é obrigatória");
    }

    if (this._senha.length < 3) {
      throw new Error("Senha deve ter pelo menos 3 caracteres");
    }
  }

  get login(): string {
    return this._login;
  }

  get senha(): string {
    return this._senha;
  }

  toJSON(): LoginCredentialsData {
    return {
      login: this._login,
      senha: this._senha,
    };
  }
}
