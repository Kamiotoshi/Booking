// src/services/api.ts

import type { LoginData, BookingData, BookingResponse } from '../models/model.ts';
const API_BASE_URL = '/api';


export class ApiService {
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

    static async login(credentials: LoginData): Promise<{ token: string }> {
        try {
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
                // Gom lỗi 401, 403 hoặc bất kỳ lỗi đăng nhập nào thành 1 message chung
                if (response.status === 401 || response.status === 403) {
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
            try {
                localStorage.setItem('authToken', data.token);
            } catch (e) {
                console.warn('Không thể lưu token vào localStorage:', e);
            }

            return data;
        } catch (error) {
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
            }
            throw error;
        }
    }


    static async createBooking(bookingData: BookingData, token?: string): Promise<BookingResponse> {
        const authToken = token || this.getStoredToken();

        if (!authToken) {
            throw new Error('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/booking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                    'Origin': window.location.origin
                },
                body: JSON.stringify(bookingData),
                mode: 'cors',
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    this.removeStoredToken();
                    throw new Error('Token hết hạn. Vui lòng đăng nhập lại.');
                }
                throw new Error(`Tạo booking thất bại (${response.status})`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
            }
            throw error;
        }
    }

    static async getBookingById(bookingId: number, token?: string): Promise<BookingData> {
        const authToken = token || this.getStoredToken();

        if (!authToken) {
            throw new Error('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/booking/${bookingId}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                    'Origin': window.location.origin
                },
                mode: 'cors',
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    this.removeStoredToken();
                    throw new Error('Token hết hạn. Vui lòng đăng nhập lại.');
                }
                throw new Error(`Không thể lấy thông tin booking (${response.status})`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
            }
            throw error;
        }
    }
}