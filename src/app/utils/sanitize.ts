/**
 * Security utilities for XSS prevention and input sanitization
 */

/**
 * Sanitize user input to prevent XSS attacks
 * Removes potentially dangerous characters while preserving necessary ones
 */
export function sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    // Remove null bytes
    let sanitized = input.replace(/\0/g, '');
    
    // Remove script tags and event handlers
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=/gi, ''); // Remove onclick, onload, etc.
    
    // Remove javascript: and data: URLs
    sanitized = sanitized.replace(/javascript:/gi, '');
    sanitized = sanitized.replace(/data:text\/html/gi, '');
    
    // Allow only alphanumeric, spaces, hyphens, apostrophes, and basic punctuation
    sanitized = sanitized.replace(/[^\w\s\-'.,!?]/gi, '');
    
    // Trim and limit length
    sanitized = sanitized.trim().slice(0, 200);
    
    return sanitized;
}

/**
 * Sanitize HTML content (for rendering safe HTML)
 * Use DOMPurify in production for better security
 */
export function sanitizeHTML(html: string): string {
    if (!html || typeof html !== 'string') return '';
    
    // Basic HTML sanitization
    // In production, use a library like DOMPurify
    let sanitized = html;
    
    // Remove script tags
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remove event handlers
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
    
    // Remove javascript: URLs
    sanitized = sanitized.replace(/javascript:/gi, '');
    
    return sanitized;
}

/**
 * Escape HTML entities to prevent XSS
 */
export function escapeHTML(text: string): string {
    if (!text || typeof text !== 'string') return '';
    
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Validate year input (prevent injection)
 */
export function validateYear(year: string | number): string | null {
    if (!year) return null;
    
    const yearStr = String(year).trim();
    
    // Must be exactly 4 digits
    if (!/^\d{4}$/.test(yearStr)) {
        return null;
    }
    
    const yearNum = parseInt(yearStr, 10);
    
    // Reasonable year range (1900-2100)
    if (yearNum < 1900 || yearNum > 2100) {
        return null;
    }
    
    return yearStr;
}

/**
 * Validate and sanitize URL
 */
export function sanitizeURL(url: string): string | null {
    if (!url || typeof url !== 'string') return null;
    
    try {
        const parsed = new URL(url);
        
        // Only allow https protocol
        if (parsed.protocol !== 'https:') {
            return null;
        }
        
        // Whitelist allowed domains
        const allowedDomains = [
            'm.media-amazon.com',
            'www.imdb.com',
            'imdb.com',
            'film-search-api.vercel.app',
        ];
        
        if (!allowedDomains.includes(parsed.hostname)) {
            return null;
        }
        
        return url;
    } catch {
        return null;
    }
}

/**
 * Rate limiting helper (client-side basic check)
 * For real rate limiting, implement on server-side
 */
const requestTimes: Map<string, number[]> = new Map();

export function checkRateLimit(identifier: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const times = requestTimes.get(identifier) || [];
    
    // Remove old requests outside the window
    const recentTimes = times.filter(time => now - time < windowMs);
    
    if (recentTimes.length >= maxRequests) {
        return false; // Rate limit exceeded
    }
    
    recentTimes.push(now);
    requestTimes.set(identifier, recentTimes);
    
    return true; // Within rate limit
}

