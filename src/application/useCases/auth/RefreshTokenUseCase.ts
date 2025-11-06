import { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import { AuthTokens } from "@/domain/valueObjects/AuthTokens";

export class RefreshTokenUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(refreshToken: string): Promise<AuthTokens> {
    try {
      if (!refreshToken || refreshToken.trim() === "") {
        throw new Error("Refresh token é obrigatório");
      }

      const tokens = await this.authRepository.refreshToken(refreshToken);
      return tokens;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro ao renovar token");
    }
  }
}
