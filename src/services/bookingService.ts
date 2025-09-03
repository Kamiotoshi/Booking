// src/services/bookingService.ts

import type { BookingData, BookingResponse } from '../models/bookingResponse.ts';
import { LoginService } from './loginService.ts';

const API_BASE_URL = '/api';

export class BookingService {
    static async createBooking(bookingData: BookingData, token?: string): Promise<BookingResponse> {
        const authToken = token || LoginService.getStoredToken();

        if (!authToken) {
            throw new Error('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
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

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                LoginService.removeStoredToken();
                throw new Error('Token hết hạn. Vui lòng đăng nhập lại.');
            }
            throw new Error(`Tạo booking thất bại (${response.status})`);
        }

        const data = await response.json();
        return data;
    }

    static async getBookingById(bookingId: number, token?: string): Promise<BookingData> {
        const authToken = token || LoginService.getStoredToken();

        if (!authToken) {
            throw new Error('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
        }

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
                LoginService.removeStoredToken();
                throw new Error('Token hết hạn. Vui lòng đăng nhập lại.');
            }
            throw new Error(`Không thể lấy thông tin booking (${response.status})`);
        }

        const data = await response.json();
        return data;
    }
}