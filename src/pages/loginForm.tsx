// src/components/loginForm.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Loader2, User } from 'lucide-react';
import type { LoginModel } from "../models/RequestModel/LoginModel.ts";
import { ApiService } from '../services/api.ts';
import { ValidationUtils } from '../utils/validation.ts';
import { FormatUtils } from '../utils/format.ts';
import { Alert } from '../components/alert.tsx';
import { LoadingProgressBar } from '../components/loading.tsx';

interface LoginFormProps {
    onLogin: (token: string) => void;
}
export interface ValidationErrors {
    [key: string]: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
    const [formData, setFormData] = useState<LoginModel>({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    const usernameRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        FormatUtils.scrollToTop();
        usernameRef.current?.focus();
    }, []);

    useEffect(() => {
        if (Object.keys(validationErrors).length > 0) {
            ValidationUtils.focusFirstErrorField(validationErrors, {
                username: usernameRef,
                password: passwordRef
            });
        }
    }, [validationErrors]);

    const handleInputChange = (field: keyof LoginModel) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));

        if (validationErrors[field]) {
            setValidationErrors(prev => ({ ...prev, [field]: '' }));
        }
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const errors = ValidationUtils.validateLoginForm(formData);
        setValidationErrors(errors);

        if (Object.keys(errors).length > 0) return;

        setIsLoading(true);
        setError('');

        try {
            const response = await ApiService.login(formData);
            onLogin(response.token);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi đăng nhập');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <LoadingProgressBar isLoading={isLoading} />
            <div className="row w-100 justify-content-center">
                <div className="col-12 col-md-6 col-lg-4">
                    <div className="card shadow-lg border-0">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <User size={48} className="text-primary mb-3" />
                                <h2 className="card-title fw-bold">Đăng nhập</h2>
                                <p className="text-muted">Vui lòng đăng nhập để tiếp tục</p>
                            </div>

                            {error && (
                                <Alert
                                    type="error"
                                    message={error}
                                    onClose={() => setError('')}
                                />
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label fw-semibold">
                                        Tên đăng nhập
                                    </label>
                                    <input
                                        ref={usernameRef}
                                        type="text"
                                        className={`form-control ${validationErrors.username ? 'is-invalid' : ''}`}
                                        id="username"
                                        value={formData.username}
                                        onChange={handleInputChange('username')}
                                        placeholder="Nhập tên đăng nhập"
                                        disabled={isLoading}
                                    />
                                    {validationErrors.username && (
                                        <div className="invalid-feedback">{validationErrors.username}</div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="password" className="form-label fw-semibold">
                                        Mật khẩu
                                    </label>
                                    <div className="input-group">
                                        <input
                                            ref={passwordRef}
                                            type={showPassword ? 'text' : 'password'}
                                            className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                                            id="password"
                                            value={formData.password}
                                            onChange={handleInputChange('password')}
                                            placeholder="Nhập mật khẩu"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={isLoading}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    {validationErrors.password && (
                                        <div className="invalid-feedback d-block">{validationErrors.password}</div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 py-2"
                                    disabled={isLoading}
                                    style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={16} className="me-2 spinner-border spinner-border-sm" />
                                            Đang đăng nhập...
                                        </>
                                    ) : (
                                        'Đăng nhập'
                                    )}
                                </button>
                            </form>

                            <div className="mt-4 text-center">
                                <small className="text-muted">
                                    Demo: admin / password123
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};