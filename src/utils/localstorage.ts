
export class Localstorage {
    // Token management methods
    static getStoredToken(): string | null {
        try {
            return localStorage.getItem('authToken');
        } catch (e) {
            console.warn('Không thể đọc token từ localStorage:', e);
            return null;
        }
    }

    static removeStoredToken(): void {
        try {
            localStorage.removeItem('authToken');
        } catch (e) {
            console.warn('Không thể xóa token từ localStorage:', e);
        }
    }

    static isTokenValid(token: string | null): boolean {
        return !!(token && token.length > 0);
    }
}