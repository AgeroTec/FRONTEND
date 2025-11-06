import { AuthUser } from "../entities/AuthUser";
import { AuthTokens } from "../valueObjects/AuthTokens";
import { LoginCredentials } from "../valueObjects/LoginCredentials";

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  logout(): Promise<void>;
  refreshToken(refreshToken: string): Promise<AuthTokens>;
  validateToken(token: string): Promise<boolean>;
}
