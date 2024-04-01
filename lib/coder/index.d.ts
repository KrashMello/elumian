export declare class Encoder {
    private readonly secretKey;
    private readonly algorithm;
    private readonly secretKeyBuffer;
    private readonly iv;
    encrypted(data: object): string;
    encryptedBase64(text: string): string;
    decrypt(data: string): Record<string, any>;
    decryptBase64(text: string): string;
    hardEncrypter(data: object, time: number): string;
    hardDecrypt(data: string): Record<string, any>;
}
