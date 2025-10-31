/**
 * Güvenli logging utility
 * Production'da hassas bilgileri gizler
 */

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Güvenli error logging
 * Production'da sadece genel mesajları gösterir
 */
export function logError(message: string, error?: unknown, additionalInfo?: Record<string, unknown>): void {
    if (isDevelopment) {
        // Development: Tüm detayları göster
        if (error) {
            console.error(`[DEV] ${message}`, error, additionalInfo || '');
        } else {
            console.error(`[DEV] ${message}`, additionalInfo || '');
        }
    } else {
        // Production: Sadece genel mesajları göster
        // Hassas bilgileri (stack trace, API keys, internal details) gizle
        console.error(message);
    }
}

/**
 * Güvenli info logging
 * Production'da hiçbir şey göstermez
 */
export function logInfo(message: string, data?: unknown): void {
    if (isDevelopment) {
        console.log(`[DEV] ${message}`, data || '');
    }
    // Production'da hiçbir şey loglanmaz
}

/**
 * Güvenli warning logging
 * Production'da sadece genel mesajları gösterir
 */
export function logWarn(message: string, data?: unknown): void {
    if (isDevelopment) {
        console.warn(`[DEV] ${message}`, data || '');
    } else {
        // Production'da sadece mesaj göster, detayları gizle
        console.warn(message);
    }
}

