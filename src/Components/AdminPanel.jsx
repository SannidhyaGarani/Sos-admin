import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from './Firebase/Firebase';
import { collection, getDocs, orderBy, query, deleteDoc, doc } from 'firebase/firestore';
import { 
    Users, Eye, Trash2, X, Mail, Phone, MapPin, 
    Calendar, Briefcase, IdCard, Loader2, RefreshCw,
    User, Image, LogOut
} from 'lucide-react';
import './AdminPanel.css';

const AdminPanel = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                navigate('/admin-login');
            } else {
                setUser(currentUser);
                setAuthLoading(false);
                fetchPartners();
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const fetchPartners = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'partnerRequests'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(docSnap => ({
                id: docSnap.id,
                ...docSnap.data()
            }));
            setPartners(data);
        } catch (error) {
            console.error('Error fetching partners:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/admin-login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this partner?')) {
            try {
                await deleteDoc(doc(db, 'partnerRequests', id));
                setPartners(prev => prev.filter(p => p.id !== id));
            } catch (error) {
                console.error('Error deleting partner:', error);
                alert('Failed to delete partner.');
            }
        }
    };

    const openModal = (partner) => {
        setSelectedPartner(partner);
        setShowModal(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedPartner(null);
        document.body.style.overflow = 'auto';
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        if (timestamp.seconds) {
            return new Date(timestamp.seconds * 1000).toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric'
            });
        }
        return timestamp;
    };

    if (authLoading) {
        return (
            <div className="admin-loading-screen" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#1174d6' }}>
                <Loader2 size={48} className="spinner-icon animate-spin" />
                <p className="mt-4 fw-bold">Verifying Admin Access...</p>
            </div>
        );
    }

    return (
        <div className="admin-wrapper">
            {/* Header */}
            <div className="admin-header">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                            <div className="admin-logo-icon">
                                <Users size={24} />
                            </div>
                            <div>
                                <h1 className="admin-title">Partner Applications</h1>
                                <p className="admin-subtitle mb-0">Mahanta Group Admin Panel</p>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                            <span className="admin-count-badge">
                                {partners.length} {partners.length === 1 ? 'Partner' : 'Partners'}
                            </span>
                            <button className="btn-refresh" onClick={fetchPartners} title="Refresh">
                                <RefreshCw size={18} />
                            </button>
                            <button className="btn btn-outline-danger d-flex align-items-center gap-2" onClick={handleLogout}>
                                <LogOut size={18} />
                                <span className="d-none d-md-inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="container py-4">
                {loading ? (
                    <div className="admin-loading">
                        <Loader2 size={40} className="spinner-icon" />
                        <p className="mt-3 text-muted">Loading partner data...</p>
                    </div>
                ) : partners.length === 0 ? (
                    <div className="admin-empty">
                        <Users size={60} strokeWidth={1} />
                        <h4 className="mt-3">No Applications Yet</h4>
                        <p className="text-muted">Partner applications will appear here once submitted.</p>
                    </div>
                ) : (
                    <div className="table-responsive admin-table-wrapper">
                        <table className="table table-hover admin-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Photo</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Mobile</th>
                                    <th>City</th>
                                    <th>RERA No.</th>
                                    <th>Date</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {partners.map((partner, index) => (
                                    <tr key={partner.id}>
                                        <td className="fw-semibold text-muted">{index + 1}</td>
                                        <td>
                                            {partner.photographUrl ? (
                                                <img 
                                                    src={partner.photographUrl} 
                                                    alt="Partner" 
                                                    className="admin-avatar"
                                                />
                                            ) : (
                                                <div className="admin-avatar-placeholder">
                                                    <User size={18} />
                                                </div>
                                            )}
                                        </td>
                                        <td className="fw-semibold">
                                            {partner.firstName} {partner.middleName} {partner.lastName}
                                        </td>
                                        <td className="text-muted">{partner.email || 'N/A'}</td>
                                        <td className="text-muted">{partner.mobile1 || 'N/A'}</td>
                                        <td className="text-muted">{partner.localCity || 'N/A'}</td>
                                        <td>
                                            <span className="rera-badge">{partner.reraNo || 'N/A'}</span>
                                        </td>
                                        <td className="text-muted">{formatDate(partner.createdAt)}</td>
                                        <td>
                                            <div className="d-flex justify-content-center gap-2">
                                                <button 
                                                    className="btn-action btn-view" 
                                                    onClick={() => openModal(partner)}
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button 
                                                    className="btn-action btn-delete" 
                                                    onClick={() => handleDelete(partner.id)}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {showModal && selectedPartner && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={closeModal}>
                            <X size={20} />
                        </button>

                        {/* Modal Header with Photo */}
                        <div className="modal-header-custom">
                            {selectedPartner.photographUrl ? (
                                <img 
                                    src={selectedPartner.photographUrl} 
                                    alt="Partner" 
                                    className="modal-photo"
                                />
                            ) : (
                                <div className="modal-photo-placeholder">
                                    <User size={40} />
                                </div>
                            )}
                            <h3 className="modal-name">
                                {selectedPartner.firstName} {selectedPartner.middleName} {selectedPartner.lastName}
                            </h3>
                            <span className="modal-rera">RERA: {selectedPartner.reraNo || 'N/A'}</span>
                        </div>

                        {/* Modal Body */}
                        <div className="modal-body-custom">
                            {/* Business Info */}
                            <div className="detail-section">
                                <h6 className="detail-section-title">
                                    <Briefcase size={16} /> Business Information
                                </h6>
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Business Advisor</span>
                                        <span className="detail-value">{selectedPartner.businessAdvisor || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">RERA No.</span>
                                        <span className="detail-value">{selectedPartner.reraNo || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Application Date</span>
                                        <span className="detail-value">{selectedPartner.date || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Personal Info */}
                            <div className="detail-section">
                                <h6 className="detail-section-title">
                                    <User size={16} /> Personal Details
                                </h6>
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Full Name</span>
                                        <span className="detail-value">
                                            {selectedPartner.firstName} {selectedPartner.middleName} {selectedPartner.lastName}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Father/Husband</span>
                                        <span className="detail-value">
                                            {selectedPartner.fatherHusbandName || ''} {selectedPartner.fatherHusbandMiddleName || ''} {selectedPartner.fatherHusbandLastName || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Date of Birth</span>
                                        <span className="detail-value">{selectedPartner.dob || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">PAN Card No.</span>
                                        <span className="detail-value fw-bold text-primary">{selectedPartner.panCardNo || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="detail-section">
                                <h6 className="detail-section-title">
                                    <Phone size={16} /> Contact Information
                                </h6>
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <span className="detail-label"><Mail size={14} /> Email</span>
                                        <span className="detail-value">{selectedPartner.email || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label"><Phone size={14} /> Mobile 1</span>
                                        <span className="detail-value">{selectedPartner.mobile1 || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label"><Phone size={14} /> Mobile 2</span>
                                        <span className="detail-value">{selectedPartner.mobile2 || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Address Info */}
                            <div className="detail-section">
                                <h6 className="detail-section-title">
                                    <MapPin size={16} /> Local Address
                                </h6>
                                <div className="detail-grid">
                                    <div className="detail-item full-width">
                                        <span className="detail-label">Address Line</span>
                                        <span className="detail-value">{selectedPartner.localAddressLine2 || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">City</span>
                                        <span className="detail-value">{selectedPartner.localCity || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">State</span>
                                        <span className="detail-value">{selectedPartner.localState || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Pin Code</span>
                                        <span className="detail-value">{selectedPartner.localPinCode || 'N/A'}</span>
                                    </div>
                                </div>

                                <h6 className="detail-section-title mt-4">
                                    <MapPin size={16} /> Permanent Address
                                </h6>
                                <div className="detail-grid">
                                    <div className="detail-item full-width">
                                        <span className="detail-label">Address Line</span>
                                        <span className="detail-value">{selectedPartner.permanentAddressLine1 || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">City</span>
                                        <span className="detail-value">{selectedPartner.permanentCity || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">State</span>
                                        <span className="detail-value">{selectedPartner.permanentState || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Pin Code</span>
                                        <span className="detail-value">{selectedPartner.permanentPinCode || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* PAN Card */}
                            {selectedPartner.panCardUrl && (
                                <div className="detail-section">
                                    <h6 className="detail-section-title">
                                        <IdCard size={16} /> PAN Card Document
                                    </h6>
                                    <div className="id-proof-preview">
                                        <img 
                                            src={selectedPartner.panCardUrl} 
                                            alt="PAN Card" 
                                            className="id-proof-image"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Submitted At */}
                            <div className="detail-footer">
                                <Calendar size={14} />
                                <span>Submitted: {formatDate(selectedPartner.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
