// src/types/index.ts

export interface LoginData {
    username: string;
    password: string;
}

export interface BookingData {
    firstname: string;
    lastname: string;
    totalprice: number;
    depositpaid: boolean;
    bookingdates: {
        checkin: string;
        checkout: string;
    };
}

export interface BookingResponse {
    bookingid: number;
    booking: BookingData;
}

export interface ValidationErrors {
    [key: string]: string;
}

export interface AlertProps {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    onClose?: () => void;
}

export interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
}

export interface LoadingProgressBarProps {
    isLoading: boolean;
}