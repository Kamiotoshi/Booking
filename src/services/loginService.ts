// src/services/loginService.ts

import type { LoginModel } from "../models/LoginModel.ts";

const API_BASE_URL = '/api';

export class LoginService {
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

    static async login(credentials: LoginModel): Promise<{ token: string }> {
        const response = await fetch(`${API_BASE_URL}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Origin': window.location.origin
            },
            body: JSON.stringify(credentials),
            mode: 'cors',
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
            }
            throw new Error('Đăng nhập thất bại. Vui lòng thử lại sau.');
        }

        const data = await response.json();

        // Nếu server không trả token, vẫn coi như đăng nhập thất bại
        if (!data.token) {
            throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
        }

        // Lưu token vào localStorage
        localStorage.setItem('authToken', data.token);

        return data;
    }
}