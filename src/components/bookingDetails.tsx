// src/components/bookingDetails.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, User, Calendar, DollarSign } from 'lucide-react';
import type { BookingResponse } from '../models/bookingResponse.ts';
import type { BookingData } from '../models/bookingResponse.ts'
import { BookingService } from '../services/bookingService.ts';
import { FormatUtils } from '../utils/format.ts';
import { Alert } from './alert.tsx';
import { LoadingSpinner, LoadingProgressBar } from './loading.tsx';

interface BookingDetailsProps {
    bookingResponse: BookingResponse;
    token: string;
    onBack: () => void;
    onLogout: () => void;
}

export const BookingDetails: React.FC<BookingDetailsProps> = ({
                                                                  bookingResponse,
                                                                  token,
                                                                  onBack,
                                                                  onLogout
                                                              }) => {
    const navigate = useNavigate();
    const [bookingDetails, setBookingDetails] = useState<BookingData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');

    const fetchBookingDetails = useCallback(async () => {
        setIsLoading(true);
        setError('');

        try {
            const data = await BookingService.getBookingById(bookingResponse.bookingid, token);
            setBookingDetails(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể tải thông tin booking');
        } finally {
            setIsLoading(false);
        }
    }, [bookingResponse.bookingid, token]);

    useEffect(() => {
        FormatUtils.scrollToTop();
        fetchBookingDetails();
    }, [fetchBookingDetails]);

    const handleBack = () => {
        onBack();
        navigate('/booking');
    };

    if (isLoading) {
        return (
            <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
                <LoadingProgressBar isLoading={true} />
                <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="mt-3 text-muted">Đang tải thông tin booking...</p>
                </div>
            </div>
        );
    }

    const displayData = bookingDetails || bookingResponse.booking;

    return (
        <div className="container-fluid min-vh-100 bg-light py-4">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-8">
                        <div className="card shadow-lg border-0">
                            <div className="card-header bg-success text-white">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h3 className="mb-0">
                                        <CheckCircle size={24} className="me-2" />
                                        Booking Thành Công
                                    </h3>
                                    <button
                                        className="btn btn-outline-light btn-sm"
                                        onClick={onLogout}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>

                            <div className="card-body p-4">
                                {error && (
                                    <Alert
                                        type="warning"
                                        message={`${error}. Hiển thị thông tin từ response tạo booking.`}
                                        onClose={() => setError('')}
                                    />
                                )}

                                <div className="alert alert-success" role="alert">
                                    <CheckCircle size={20} className="me-2" />
                                    Booking đã được tạo thành công với ID: <strong>#{bookingResponse.bookingid}</strong>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <div className="card bg-light">
                                            <div className="card-body">
                                                <h5 className="card-title text-primary">
                                                    <User size={20} className="me-2" />
                                                    Thông tin khách hàng
                                                </h5>
                                                <p className="mb-1"><strong>Booking ID:</strong> #{bookingResponse.bookingid}</p>
                                                <p className="mb-1"><strong>Họ và tên:</strong> {displayData.firstname} {displayData.lastname}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <div className="card bg-light">
                                            <div className="card-body">
                                                <h5 className="card-title text-primary">
                                                    <DollarSign size={20} className="me-2" />
                                                    Thông tin thanh toán
                                                </h5>
                                                <p className="mb-1"><strong>Tổng giá:</strong> {FormatUtils.formatCurrency(displayData.totalprice)}</p>
                                                <p className="mb-1">
                                                    <strong>Trạng thái cọc:</strong>
                                                    <span className={`badge ms-2 ${displayData.depositpaid ? 'bg-success' : 'bg-warning'}`}>
                                                        {displayData.depositpaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12 mb-3">
                                        <div className="card bg-light">
                                            <div className="card-body">
                                                <h5 className="card-title text-primary">
                                                    <Calendar size={20} className="me-2" />
                                                    Thông tin ngày
                                                </h5>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <p className="mb-1"><strong>Ngày nhận phòng:</strong> {FormatUtils.formatDate(displayData.bookingdates.checkin)}</p>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <p className="mb-1"><strong>Ngày trả phòng:</strong> {FormatUtils.formatDate(displayData.bookingdates.checkout)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex gap-2 justify-content-center mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        onClick={handleBack}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Tạo booking mới
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => window.print()}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        In booking
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};