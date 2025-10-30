export interface AuthTokens {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken: string | null;
  idToken: string | null;
  scope: string;
  issuedAt: string;
}
