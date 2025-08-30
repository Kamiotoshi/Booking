// src/App.tsx

import React, {useEffect, useState} from 'react';
import type { BookingResponse } from './models/model.ts';
import { LoginForm } from './components/loginForm.tsx';
import { BookingForm } from './components/bookingForm.tsx';
import { BookingDetails } from './components/bookingDetails.tsx';

import { ApiService } from './services/api.ts';

type ViewType = 'login' | 'booking' | 'details';

const App: React.FC = () => {
    const [token, setToken] = useState<string>('');
    const [currentBooking, setCurrentBooking] = useState<BookingResponse | null>(null);
    const [currentView, setCurrentView] = useState<ViewType>('login');
    // Kiểm tra token trong localStorage khi app khởi động
    useEffect(() => {
        const storedToken = ApiService.getStoredToken();
        if (storedToken && ApiService.isTokenValid(storedToken)) {
            setToken(storedToken);
            setCurrentView('booking');
        }
    }, []);
    const handleLogin = (authToken: string) => {
        setToken(authToken);
        setCurrentView('booking');
    };

    const handleBookingSuccess = (booking: BookingResponse) => {
        setCurrentBooking(booking);
        setCurrentView('details');
    };

    const handleBack = () => {
        setCurrentBooking(null);
        setCurrentView('booking');
    };

    const handleLogout = () => {
        setToken('');
        setCurrentBooking(null);
        setCurrentView('login');
    };

    const renderCurrentView = () => {
        switch (currentView) {
            case 'login':
                return <LoginForm onLogin={handleLogin} />;

            case 'booking':
                return (
                    <BookingForm
                        token={token}
                        onBookingSuccess={handleBookingSuccess}
                        onLogout={handleLogout}
                    />
                );

            case 'details':
                return currentBooking ? (
                    <BookingDetails
                        bookingResponse={currentBooking}
                        token={token}
                        onBack={handleBack}
                        onLogout={handleLogout}
                    />
                ) : null;

            default:
                return <LoginForm onLogin={handleLogin} />;
        }
    };

    return (
        <>
            <link
                href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
                rel="stylesheet"
            />
            <style>
                {`
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
          
          .card {
            transition: all 0.3s ease;
          }
          
          .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
          }
          
          .btn {
            transition: all 0.2s ease;
          }
          
          .btn:hover {
            transform: translateY(-1px);
          }
          
          .form-control:focus {
            border-color: #0d6efd;
            box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
          }
          
          .alert {
            border-radius: 8px;
          }
          
          @media print {
            .btn, .card-header button {
              display: none !important;
            }
          }
          
          .spinner-border {
            animation: spinner-border 0.75s linear infinite;
          }
          
          @keyframes spinner-border {
            to {
              transform: rotate(360deg);
            }
          }
        `}
            </style>
            {renderCurrentView()}
        </>
    );
};

export default App;