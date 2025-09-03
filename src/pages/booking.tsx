// src/pages/booking.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Calendar, User, DollarSign, CreditCard } from 'lucide-react';
import type { BookingData, BookingResponse } from '../models/bookingResponse.ts';
import { BookingService } from '../services/bookingService.ts';
import { ValidationUtils } from '../utils/validation.ts';
import { FormatUtils } from '../utils/format.ts';
import { Alert } from '../components/alert.tsx';
import { LoadingProgressBar } from '../components/loading.tsx';

interface BookingFormProps {
    token: string;
    onBookingSuccess: (booking: BookingResponse) => void;
    onLogout: () => void;
}

export interface ValidationErrors {
    [key: string]: string;
}

export const Booking: React.FC<BookingFormProps> = ({
                                                        token,
                                                        onBookingSuccess,
                                                        onLogout
                                                    }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<BookingData>({
        firstname: '',
        lastname: '',
        totalprice: 0,
        depositpaid: false,
        bookingdates: {
            checkin: '',
            checkout: ''
        }
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    const firstnameRef = useRef<HTMLInputElement | null>(null);
    const lastnameRef = useRef<HTMLInputElement | null>(null);
    const totalpriceRef = useRef<HTMLInputElement | null>(null);
    const checkinRef = useRef<HTMLInputElement | null>(null);
    const checkoutRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        FormatUtils.scrollToTop();
        firstnameRef.current?.focus();
    }, []);

    useEffect(() => {
        if (Object.keys(validationErrors).length > 0) {
            ValidationUtils.focusFirstErrorField(validationErrors, {
                firstname: firstnameRef,
                lastname: lastnameRef,
                totalprice: totalpriceRef,
                checkin: checkinRef,
                checkout: checkoutRef
            });
        }
    }, [validationErrors]);

    const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = field === 'totalprice' ? parseFloat(e.target.value) || 0 : e.target.value;

        if (field.includes('bookingdates.')) {
            const dateField = field.split('.')[1];
            setFormData(prev => ({
                ...prev,
                bookingdates: {
                    ...prev.bookingdates,
                    [dateField]: value as string
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }

        if (validationErrors[field]) {
            setValidationErrors(prev => ({ ...prev, [field]: '' }));
        }
        setError('');
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, depositpaid: e.target.checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const errors = ValidationUtils.validateBookingForm(formData);
        setValidationErrors(errors);

        if (Object.keys(errors).length > 0) return;

        setIsLoading(true);
        setError('');

        try {
            const bookingResponse = await BookingService.createBooking(formData, token);
            onBookingSuccess(bookingResponse);
            navigate('/booking-details');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo booking');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container-fluid min-vh-100 bg-light py-4">
            <LoadingProgressBar isLoading={isLoading} />
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-8">
                        <div className="card shadow-lg border-0">
                            <div className="card-header bg-primary text-white">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h3 className="mb-0">
                                        <Calendar size={24} className="me-2" />
                                        Tạo Booking Mới
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
                                        type="error"
                                        message={error}
                                        onClose={() => setError('')}
                                    />
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="firstname" className="form-label fw-semibold">
                                                <User size={16} className="me-1" />
                                                Họ
                                            </label>
                                            <input
                                                ref={firstnameRef}
                                                type="text"
                                                className={`form-control ${validationErrors.firstname ? 'is-invalid' : ''}`}
                                                id="firstname"
                                                value={formData.firstname}
                                                onChange={handleInputChange('firstname')}
                                                placeholder="Nhập họ"
                                                disabled={isLoading}
                                            />
                                            {validationErrors.firstname && (
                                                <div className="invalid-feedback">{validationErrors.firstname}</div>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="lastname" className="form-label fw-semibold">
                                                <User size={16} className="me-1" />
                                                Tên
                                            </label>
                                            <input
                                                ref={lastnameRef}
                                                type="text"
                                                className={`form-control ${validationErrors.lastname ? 'is-invalid' : ''}`}
                                                id="lastname"
                                                value={formData.lastname}
                                                onChange={handleInputChange('lastname')}
                                                placeholder="Nhập tên"
                                                disabled={isLoading}
                                            />
                                            {validationErrors.lastname && (
                                                <div className="invalid-feedback">{validationErrors.lastname}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="totalprice" className="form-label fw-semibold">
                                                <DollarSign size={16} className="me-1" />
                                                Tổng giá
                                            </label>
                                            <input
                                                ref={totalpriceRef}
                                                type="number"
                                                className={`form-control ${validationErrors.totalprice ? 'is-invalid' : ''}`}
                                                id="totalprice"
                                                value={formData.totalprice || ''}
                                                onChange={handleInputChange('totalprice')}
                                                placeholder="Nhập tổng giá"
                                                min="1"
                                                disabled={isLoading}
                                            />
                                            {validationErrors.totalprice && (
                                                <div className="invalid-feedback">{validationErrors.totalprice}</div>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3 d-flex align-items-end">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="depositpaid"
                                                    checked={formData.depositpaid}
                                                    onChange={handleCheckboxChange}
                                                    disabled={isLoading}
                                                />
                                                <label className="form-check-label fw-semibold" htmlFor="depositpaid">
                                                    <CreditCard size={16} className="me-1" />
                                                    Đã thanh toán cọc
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="checkin" className="form-label fw-semibold">
                                                <Calendar size={16} className="me-1" />
                                                Ngày nhận phòng
                                            </label>
                                            <input
                                                ref={checkinRef}
                                                type="date"
                                                className={`form-control ${validationErrors.checkin ? 'is-invalid' : ''}`}
                                                id="checkin"
                                                value={formData.bookingdates.checkin}
                                                onChange={handleInputChange('bookingdates.checkin')}
                                                disabled={isLoading}
                                            />
                                            {validationErrors.checkin && (
                                                <div className="invalid-feedback">{validationErrors.checkin}</div>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="checkout" className="form-label fw-semibold">
                                                <Calendar size={16} className="me-1" />
                                                Ngày trả phòng
                                            </label>
                                            <input
                                                ref={checkoutRef}
                                                type="date"
                                                className={`form-control ${validationErrors.checkout ? 'is-invalid' : ''}`}
                                                id="checkout"
                                                value={formData.bookingdates.checkout}
                                                onChange={handleInputChange('bookingdates.checkout')}
                                                disabled={isLoading}
                                            />
                                            {validationErrors.checkout && (
                                                <div className="invalid-feedback">{validationErrors.checkout}</div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 py-2 mt-3"
                                        disabled={isLoading}
                                        style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 size={16} className="me-2 spinner-border spinner-border-sm" />
                                                Đang tạo booking...
                                            </>
                                        ) : (
                                            'Tạo Booking'
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};