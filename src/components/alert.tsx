// src/components/alert.tsx

import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
export interface AlertProps {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
    const alertClasses = {
        success: 'alert-success',
        error: 'alert-danger',
        warning: 'alert-warning',
        info: 'alert-info'
    };

    const icons = {
        success: <CheckCircle size={20} />,
        error: <AlertCircle size={20} />,
        warning: <AlertCircle size={20} />,
        info: <AlertCircle size={20} />
    };

    return (
        <div className={`alert ${alertClasses[type]} alert-dismissible fade show`} role="alert">
            <div className="d-flex align-items-center">
                {icons[type]}
                <span className="ms-2">{message}</span>
            </div>
            {onClose && (
                <button
                    type="button"
                    className="btn-close"
                    onClick={onClose}
                    aria-label="Close"
                ></button>
            )}
        </div>
    );
};