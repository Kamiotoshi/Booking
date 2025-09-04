// src/services/bookingService.ts

import type { BookingData, BookingResponse } from '../models/bookingResponse.ts';
import { LoginService } from './loginService.ts';

const API_BASE_URL = '/api';

// Custom error class để phân biệt loại lỗi
export class TokenExpiredError extends Error {
    constructor(message: string = 'Token hết hạn. Vui lòng đăng nhập lại.') {
        super(message);
        this.name = 'TokenExpiredError';
    }
}

export class BookingService {
    static async createBooking(bookingData: BookingData, token?: string): Promise<BookingResponse> {
        const authToken = token || LoginService.getStoredToken();

        if (!authToken) {
            throw new TokenExpiredError();
        }

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

        // Kiểm tra response status
        if (!response.ok) {
            if (response.status === 401) {
                throw new TokenExpiredError();
            }
            throw new Error('Không thể tải thông tin booking. Vui lòng thử lại.');
        }

        const data = await response.json();
        return data;
    }

    static async getBookingById(bookingId: number): Promise<BookingData> {
        const authToken = LoginService.getStoredToken();

        if (!authToken) {
            throw new TokenExpiredError();
        }

        const response = await fetch(`${API_BASE_URL}/booking/${bookingId}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${authToken}`,
                'Origin': window.location.origin
            },
            mode: 'cors',
        });

        // Kiểm tra response status
        if (!response.ok) {
            if (response.status === 401) {
                throw new TokenExpiredError();
            }
            throw new Error('Không thể tải thông tin booking. Vui lòng thử lại.');
        }
        const data = await response.json();
        return data;
    }
}