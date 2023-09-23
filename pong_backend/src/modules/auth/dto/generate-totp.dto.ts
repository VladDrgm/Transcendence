export class GenerateTotpDTO {
    secret: string;     // Temporary secret key for TOTP.
    dataURL: string;        // Data URL for QR code image.
	otpauth_url: string;
}