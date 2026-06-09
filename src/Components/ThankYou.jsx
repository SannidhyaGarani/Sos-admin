import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Home, ArrowRight } from 'lucide-react';
import './ThankYou.css';

const ThankYou = () => {
    return (
        <div className="thank-you-wrapper">
            <div className="container">
                <div className="row justify-content-center align-items-center min-vh-100">
                    <div className="col-md-8 col-lg-6 text-center">
                        <div className="thank-you-card">
                            <div className="success-icon-wrapper">
                                <CheckCircle2 size={80} className="success-icon" />
                            </div>
                            <h1 className="thank-you-title mt-4">Thank You!</h1>
                            <p className="thank-you-message mb-4">
                                Your partner application has been received successfully. 
                                Our team will review your documents and getting back to you within 24-48 hours.
                            </p>
                            <div className="thank-you-info mb-5">
                                <p className="small text-muted mb-0">Follow us on social media for updates</p>
                            </div>
                            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                                <Link to="/" className="btn btn-primary d-flex align-items-center justify-content-center gap-2 px-4 py-2">
                                    <Home size={18} />
                                    Back to Home
                                </Link>
                                <Link to="/join-as-partner" className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2 px-4 py-2">
                                    View Program Details
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThankYou;
