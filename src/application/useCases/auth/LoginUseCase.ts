import { IAuthRepository, AuthResponse } from "@/domain/repositories/IAuthRepository";
import { LoginCredentials, LoginCredentialsData } from "@/domain/valueObjects/LoginCredentials";

export class LoginUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(credentials: LoginCredentialsData): Promise<AuthResponse> {
    try {
      const loginCredentials = LoginCredentials.create(credentials);
      const response = await this.authRepository.login(loginCredentials);

      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro ao realizar login");
    }
  }
}
