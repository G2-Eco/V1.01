// JWT Decoder Utility
// Decodes JWT tokens to extract claims without verification (client-side)

export interface JWTPayload {
    sub: string;  // email
    role: 'CLIENT' | 'ADMIN';
    iat: number;  // issued at
    exp: number;  // expiration
}

/**
 * Decode a JWT token and extract the payload
 * Note: This does NOT verify the signature - verification happens server-side
 */
export function decodeJWT(token: string): JWTPayload | null {
    try {
        // JWT structure: header.payload.signature
        const parts = token.split('.');

        if (parts.length !== 3) {
            console.error('Invalid JWT format');
            return null;
        }

        // Decode the payload (second part)
        const payload = parts[1];

        // Base64 URL decode
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload) as JWTPayload;
    } catch (error) {
        console.error('Failed to decode JWT:', error);
        return null;
    }
}

/**
 * Check if a JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
    const payload = decodeJWT(token);
    if (!payload) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
}

/**
 * Get the role from a JWT token
 */
export function getRoleFromToken(token: string): 'CLIENT' | 'ADMIN' | null {
    const payload = decodeJWT(token);
    return payload?.role || null;
}

/**
 * Get the email from a JWT token
 */
export function getEmailFromToken(token: string): string | null {
    const payload = decodeJWT(token);
    return payload?.sub || null;
}
