import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './Firebase/Firebase';
import { LogIn, Mail, Lock, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import './AdminAuth.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/admin');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message.includes('auth/invalid-credential') 
                ? 'Invalid email or password.' 
                : 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card animate-slide-up">
                <div className="auth-header">
                    <div className="auth-logo">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="auth-title">Admin Portal</h1>
                    <p className="auth-subtitle">Welcome back! Please login to your account.</p>
                </div>

                {error && (
                    <div className="error-message">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form className="auth-form" onSubmit={handleLogin}>
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

                    <button type="submit" className="btn-auth" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 size={20} className="spinner-icon animate-spin" />
                                Authenticating...
                            </>
                        ) : (
                            <>
                                <LogIn size={20} />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

         {/* <div className="auth-footer">
                    <p>Don't have an admin account? <Link to="/admin-signup" className="auth-link">Contact Support</Link></p>
                </div> */}
            </div>
        </div>
    );
};

export default AdminLogin;
