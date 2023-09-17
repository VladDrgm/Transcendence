export class GenerateTotpDTO {
    dataURL: string;        // Data URL for QR code image.
    secret: string;     // Temporary secret key for TOTP.
}