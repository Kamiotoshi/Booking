// src/services/api.ts

import type { LoginData, BookingData, BookingResponse } from '../models/model.ts';

// Sử dụng proxy thay vì direct URL
const API_BASE_URL = '/api';

export class ApiService {
    static async login(credentials: LoginData): Promise<{ token: string }> {
        const response = await fetch(`${API_BASE_URL}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error('Đăng nhập thất bại');
        }

        const data = await response.json();

        if (!data.token) {
            throw new Error('Không nhận được token từ server');
        }

        return data;
    }

    static async createBooking(bookingData: BookingData, token: string): Promise<BookingResponse> {
        const response = await fetch(`${API_BASE_URL}/booking`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bookingData),
        });

        if (!response.ok) {
            throw new Error('Tạo booking thất bại');
        }

        const data = await response.json();
        return data;
    }

    static async getBookingById(bookingId: number, token: string): Promise<BookingData> {
        const response = await fetch(`${API_BASE_URL}/booking/${bookingId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Không thể lấy thông tin booking');
        }

        const data = await response.json();
        return data;
    }
}