export class VerifyTotpDTO {
  secret: string; // Temporary secret key for TOTP.
  token: string; // Token entered by the user.
}
