// src/App.tsx

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import type { BookingResponse } from './models/bookingResponse.ts';
import { Login } from './pages/login.tsx';
import { Booking } from './pages/booking.tsx';
import { BookingDetails } from './components/bookingDetails.tsx';
import { LoginService } from './services/loginService.ts';
import { LoadingSpinner } from './components/loading.tsx'; // Import spinner nếu có

const App: React.FC = () => {
    const [token, setToken] = useState<string>('');
    const [currentBooking, setCurrentBooking] = useState<BookingResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Thêm state này

    // Load token synchronous trong useEffect
    useEffect(() => {
        const loadToken = () => {
            const storedToken = LoginService.getStoredToken();
            if (storedToken && LoginService.isTokenValid(storedToken)) {
                setToken(storedToken);
            }
            setIsLoading(false); // Load xong
        };
        loadToken();
    }, []);

    // Đồng bộ state với localStorage - kiểm tra định kỳ
    useEffect(() => {
        const interval = setInterval(() => {
            const storedToken = LoginService.getStoredToken();
            if (!storedToken && token) {
                // Nếu localStorage bị xóa nhưng state vẫn có token
                setToken('');
                setCurrentBooking(null);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [token]);

    const handleLogin = (authToken: string) => {
        setToken(authToken);
    };

    const handleBookingSuccess = (booking: BookingResponse) => {
        setCurrentBooking(booking);
    };

    const handleLogout = () => {
        LoginService.removeStoredToken();
        setToken('');
        setCurrentBooking(null);
    };

    // Protected Route Component
    const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
        return token ? <>{children}</> : <Navigate to="/login" replace />;
    };
    // Nếu đang loading, hiển thị spinner
    if (isLoading) {
        return (
            <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

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

            <Router>
                <Routes>
                    <Route
                        path="/login"
                        element={
                            token ?
                                <Navigate to="/booking" replace /> :
                                <Login onLogin={handleLogin} />
                        }
                    />

                    <Route
                        path="/booking"
                        element={
                            <ProtectedRoute>
                                <Booking
                                    token={token}
                                    onBookingSuccess={handleBookingSuccess}
                                    onLogout={handleLogout}
                                />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/booking-details/:id"
                        element={
                            <ProtectedRoute>
                                <BookingDetails
                                    token={token}
                                    onLogout={handleLogout}
                                    showCreateNewButton={false}
                                    successMessage="Chi tiết booking"
                                />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/booking-details"
                        element={
                            <ProtectedRoute>
                                {currentBooking ? (
                                    <BookingDetails
                                        bookingResponse={currentBooking}
                                        token={token}
                                        onBack={() => setCurrentBooking(null)}
                                        onLogout={handleLogout}
                                    />
                                ) : (
                                    <Navigate to="/booking" replace />
                                )}
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/"
                        element={
                            token ?
                                <Navigate to="/booking" replace /> :
                                <Navigate to="/login" replace />
                        }
                    />

                    {/* 404 Route */}
                    <Route
                        path="*"
                        element={
                            token ?
                                <Navigate to="/booking" replace /> :
                                <Navigate to="/login" replace />
                        }
                    />
                </Routes>
            </Router>
        </>
    );
};

export default App;