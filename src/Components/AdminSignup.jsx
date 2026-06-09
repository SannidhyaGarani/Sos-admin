import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './Firebase/Firebase';
import { UserPlus, Mail, Lock, Loader2, AlertCircle, ShieldPlus } from 'lucide-react';
import './AdminAuth.css';

const AdminSignup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            return setError('Passwords do not match.');
        }

        setLoading(true);
        setError('');

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/admin');
        } catch (err) {
            console.error('Signup error:', err);
            setError(err.message.includes('email-already-in-use') 
                ? 'This email is already registered.' 
                : 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card animate-slide-up">
                <div className="auth-header">
                    <div className="auth-logo">
                        <ShieldPlus size={32} />
                    </div>
                    <h1 className="auth-title">Create Admin</h1>
                    <p className="auth-subtitle">Temporary signup page for administrative access.</p>
                </div>

                {error && (
                    <div className="error-message">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSignup}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={18} />
                            <input 
                                type="email" 
                                className="form-control" 
                                placeholder="admin@abc.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={18} />
                            <input 
                                type="password" 
                                className="form-control" 
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={18} />
                            <input 
                                type="password" 
                                className="form-control" 
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-auth" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 size={20} className="spinner-icon animate-spin" />
                                Creating Account...
                            </>
                        ) : (
                            <>
                                <UserPlus size={20} />
                                Register Admin
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/admin-login" className="auth-link">Login Here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default AdminSignup;
