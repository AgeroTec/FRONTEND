import { IAuthRepository } from "@/domain/repositories/IAuthRepository";

export class ValidateTokenUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(token: string): Promise<boolean> {
    try {
      if (!token || token.trim() === "") {
        return false;
      }

      return await this.authRepository.validateToken(token);
    } catch (error) {
      return false;
    }
  }
}
