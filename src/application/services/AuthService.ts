import { authRepository } from "@/infrastructure/repositories/AuthRepositoryImpl";
import { LoginCredentials, LoginResult } from "@/domain/repositories/IAuthRepository";

export class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResult> {
    return authRepository.login(credentials);
  }
}

export const authService = new AuthService();
