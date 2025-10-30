import { AuthUser } from "@/domain/entities/AuthUser";
import { AuthTokens } from "@/domain/valueObjects/AuthTokens";

export interface LoginCredentials {
  login: string;
  senha: string;
}

export interface LoginResult {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<LoginResult>;
}
