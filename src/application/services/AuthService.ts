import { AuthRepositoryImpl } from "@/infrastructure/repositories/AuthRepositoryImpl";
import { LoginUseCase } from "../useCases/auth/LoginUseCase";
import { LogoutUseCase } from "../useCases/auth/LogoutUseCase";
import { RefreshTokenUseCase } from "../useCases/auth/RefreshTokenUseCase";
import { ValidateTokenUseCase } from "../useCases/auth/ValidateTokenUseCase";

const authRepository = new AuthRepositoryImpl();

export const authService = {
  login: new LoginUseCase(authRepository),
  logout: new LogoutUseCase(authRepository),
  refreshToken: new RefreshTokenUseCase(authRepository),
  validateToken: new ValidateTokenUseCase(authRepository),
};
