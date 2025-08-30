// src/utils/validation.ts

import type { BookingData } from '../models/ReponseModel/bookingResponse.ts'
import type {LoginModel} from "../models/RequestModel/LoginModel.ts";

export interface ValidationErrors {
    [key: string]: string;
}
export class ValidationUtils {
    static validateLoginForm(data: LoginModel): ValidationErrors {
        const errors: ValidationErrors = {};

        if (!data.username.trim()) {
            errors.username = 'Tên đăng nhập không được để trống';
        }

        if (!data.password.trim()) {
            errors.password = 'Mật khẩu không được để trống';
        }

        return errors;
    }

    static validateBookingForm(data: BookingData): ValidationErrors {
        const errors: ValidationErrors = {};

        if (!data.firstname.trim()) {
            errors.firstname = 'Họ không được để trống';
        }

        if (!data.lastname.trim()) {
            errors.lastname = 'Tên không được để trống';
        }

        if (!data.totalprice || data.totalprice <= 0) {
            errors.totalprice = 'Tổng giá phải lớn hơn 0';
        }

        if (!data.bookingdates.checkin) {
            errors.checkin = 'Ngày nhận phòng không được để trống';
        }

        if (!data.bookingdates.checkout) {
            errors.checkout = 'Ngày trả phòng không được để trống';
        }

        if (data.bookingdates.checkin && data.bookingdates.checkout) {
            if (new Date(data.bookingdates.checkin) >= new Date(data.bookingdates.checkout)) {
                errors.checkout = 'Ngày trả phòng phải sau ngày nhận phòng';
            }
        }

        return errors;
    }

    static focusFirstErrorField(
        errors: ValidationErrors,
        refs: { [key: string]: React.RefObject<HTMLInputElement | null> }
    ): void {
        const firstErrorField = Object.keys(errors)[0];
        if (firstErrorField && refs[firstErrorField]) {
            refs[firstErrorField].current?.focus();
        }
    }
}