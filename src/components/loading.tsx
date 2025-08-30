// src/components/loading.tsx

import React from 'react';
import type { LoadingSpinnerProps, LoadingProgressBarProps } from '../models/model';

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'spinner-border-sm',
        md: '',
        lg: 'spinner-border spinner-border-lg'
    };

    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className={`spinner-border text-primary ${sizeClasses[size]}`} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
};

export const LoadingProgressBar: React.FC<LoadingProgressBarProps> = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <div className="position-fixed top-0 start-0 w-100" style={{ zIndex: 1050 }}>
            <div className="progress" style={{ height: '3px' }}>
                <div
                    className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                    style={{ width: '100%' }}
                ></div>
            </div>
        </div>
    );
};