export class VerifyTotpDTO {
    tempSecret: string;    // Temporary secret key for TOTP.
    token: string;         // Token entered by the user.
}