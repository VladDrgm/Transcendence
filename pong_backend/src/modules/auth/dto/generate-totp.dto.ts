export class GenerateTotpDTO {
    dataURL: string;        // Data URL for QR code image.
    tempSecret: string;     // Temporary secret key for TOTP.
}