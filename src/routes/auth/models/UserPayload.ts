export interface UserPayload {
  sub: number;
  login: string;
  name: string;
  iat?: number;
  exp?: number;
  role: string;
}
