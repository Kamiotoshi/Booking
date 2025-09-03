// src/components/bookingDetails.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, User, Calendar, DollarSign } from 'lucide-react';
import type { BookingResponse } from '../models/bookingResponse.ts';
import type { BookingData } from '../models/bookingResponse.ts'
import { BookingService } from '../services/bookingService.ts';
import { FormatUtils } from '../utils/format.ts';
import { Alert } from './alert.tsx';
import { LoadingSpinner, LoadingProgressBar } from './loading.tsx';

interface BookingDetailsProps {
    // Trường hợp 1: Được gọi sau khi tạo booking (có sẵn data)
    bookingResponse?: BookingResponse;

    // Trường hợp 2: Được gọi từ trang khác với bookingId
    bookingId?: number;

    token: string;
    onBack?: () => void;
    onLogout: () => void;

    // Tuỳ chỉnh giao diện
    showCreateNewButton?: boolean;
    showPrintButton?: boolean;
    successMessage?: string;
}

export const BookingDetails: React.FC<BookingDetailsProps> = ({
                                                                  bookingResponse,
                                                                  bookingId,
                                                                  // token,
                                                                  onBack,
                                                                  onLogout,
                                                                  showCreateNewButton = true,
                                                                  showPrintButton = true,
                                                                  successMessage
                                                              }) => {
    const navigate = useNavigate();
    const { id: urlBookingId } = useParams<{ id: string }>();

    // Debug log
    console.log('URL Booking ID:', urlBookingId);
    console.log('Prop Booking ID:', bookingId);
    console.log('BookingResponse:', bookingResponse);

    const [bookingDetails, setBookingDetails] = useState<BookingData | null>(null);
    const [currentBookingId, setCurrentBookingId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');

    // Xác định bookingId từ các nguồn: prop -> URL param -> bookingResponse
    const resolvedBookingId = bookingId ||
        (urlBookingId ? parseInt(urlBookingId) : null) ||
        bookingResponse?.bookingid ||
        null;

    const fetchBookingDetails = useCallback(async () => {
        if (!resolvedBookingId) {
            setError('Không tìm thấy ID booking');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError('');
        setCurrentBookingId(resolvedBookingId);

        try {
            const data = await BookingService.getBookingById(resolvedBookingId);
            setBookingDetails(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể tải thông tin booking');
        } finally {
            setIsLoading(false);
        }
    }, [resolvedBookingId]);

    useEffect(() => {
        FormatUtils.scrollToTop();

        // Nếu có bookingResponse từ trang tạo booking, dùng data đó luôn
        if (bookingResponse) {
            setBookingDetails(bookingResponse.booking);
            setCurrentBookingId(bookingResponse.bookingid);
            setIsLoading(false);
        } else {
            // Nếu không, fetch từ API
            fetchBookingDetails();
        }
    }, [bookingResponse, fetchBookingDetails]);

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1); // Go back to previous page
        }
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

    if (error || !bookingDetails || !currentBookingId) {
        return (
            <div className="container-fluid min-vh-100 bg-light py-4">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-8">
                            <Alert
                                type="error"
                                // message={error || 'Không thể hiển thị thông tin booking'}
                                message={'Không thể hiển thị thông tin booking'}
                            />
                            <div className="text-center mt-3">
                                <button
                                    className="btn btn-primary"
                                    onClick={handleBack}
                                >
                                    Quay lại
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const defaultSuccessMessage = bookingResponse
        ? 'Booking đã được tạo thành công'
        : 'Chi tiết booking';

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
                                        {successMessage || defaultSuccessMessage}
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
                                <div className="alert alert-success" role="alert">
                                    <CheckCircle size={20} className="me-2" />
                                    Booking ID: <strong>#{currentBookingId}</strong>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <div className="card bg-light">
                                            <div className="card-body">
                                                <h5 className="card-title text-primary">
                                                    <User size={20} className="me-2" />
                                                    Thông tin khách hàng
                                                </h5>
                                                <p className="mb-1"><strong>Booking ID:</strong> #{currentBookingId}</p>
                                                <p className="mb-1"><strong>Họ và tên:</strong> {bookingDetails.firstname} {bookingDetails.lastname}</p>
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
                                                <p className="mb-1"><strong>Tổng giá:</strong> {FormatUtils.formatCurrency(bookingDetails.totalprice)}</p>
                                                <p className="mb-1">
                                                    <strong>Trạng thái cọc:</strong>
                                                    <span className={`badge ms-2 ${bookingDetails.depositpaid ? 'bg-success' : 'bg-warning'}`}>
                                                        {bookingDetails.depositpaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
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
                                                        <p className="mb-1"><strong>Ngày nhận phòng:</strong> {FormatUtils.formatDate(bookingDetails.bookingdates.checkin)}</p>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <p className="mb-1"><strong>Ngày trả phòng:</strong> {FormatUtils.formatDate(bookingDetails.bookingdates.checkout)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex gap-2 justify-content-center mt-4">
                                    {showCreateNewButton && bookingResponse && (
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary"
                                            onClick={handleBack}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Tạo booking mới
                                        </button>
                                    )}

                                    {!bookingResponse && (
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary"
                                            onClick={handleBack}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Quay lại
                                        </button>
                                    )}

                                    {showPrintButton && (
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => window.print()}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            In booking
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};