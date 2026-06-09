import React, { useState } from 'react';
import { 
  User, Briefcase, MapPin, Phone, 
  Camera, Upload, Loader2, CheckCircle2, CreditCard 
} from 'lucide-react';
import axios from 'axios';
import { db } from './Firebase/Firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './JoinAsPartner.css';

const JoinAsPartner = () => {
    const [formData, setFormData] = useState({
        date: '',
        firstName: '',
        middleName: '',
        lastName: '',
        fatherHusbandName: '',
        fatherHusbandMiddleName: '',
        fatherHusbandLastName: '',
        dob: '',
        localAddressLine2: '',
        localCity: '',
        localState: '',
        localPinCode: '',
        permanentAddressLine1: '',
        permanentCity: '',
        permanentState: '',
        permanentPinCode: '',
        email: '',
        mobile1: '',
        mobile2: '',
        panCardNo: '',
        aadhaarCardNo: '',
    });

    const [files, setFiles] = useState({
        photograph: null,
        panCard: null,
        aadhaarCard: null
    });

    const [previews, setPreviews] = useState({
        photograph: null,
        panCard: null,
        aadhaarCard: null
    });

    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files: uploadedFiles } = e.target;
        if (uploadedFiles[0]) {
            setFiles(prev => ({ ...prev, [name]: uploadedFiles[0] }));
            setPreviews(prev => ({ 
                ...prev, 
                [name]: URL.createObjectURL(uploadedFiles[0]) 
            }));
        }
    };

    const uploadToCloudinary = async (file, onProgress) => {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'Mahanta_group');
        const res = await axios.post('https://api.cloudinary.com/v1_1/dlsbj8nug/image/upload', data, {
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(percentCompleted);
            }
        });
        return res.data.secure_url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setUploadProgress(0);

        try {
            let photographUrl = '';
            let panCardUrl = '';
            let aadhaarCardUrl = '';

            const totalFiles = (files.photograph ? 1 : 0) + (files.panCard ? 1 : 0) + (files.aadhaarCard ? 1 : 0);
            let uploadedCount = 0;

            const updateOverallProgress = (p) => {
                const fileShare = 100 / (totalFiles || 1);
                const currentTotalProgress = (uploadedCount * fileShare) + (p * fileShare / 100);
                setUploadProgress(Math.min(95, Math.round(currentTotalProgress)));
            };

            if (files.photograph) {
                photographUrl = await uploadToCloudinary(files.photograph, updateOverallProgress);
                uploadedCount++;
            }
            if (files.panCard) {
                panCardUrl = await uploadToCloudinary(files.panCard, updateOverallProgress);
                uploadedCount++;
            }
            if (files.aadhaarCard) {
                aadhaarCardUrl = await uploadToCloudinary(files.aadhaarCard, updateOverallProgress);
                uploadedCount++;
            }

            setUploadProgress(98);

            await addDoc(collection(db, 'partnerRequests'), {
                ...formData,
                photographUrl,
                panCardUrl,
                aadhaarCardUrl,
                createdAt: serverTimestamp(),
            });

            setUploadProgress(100);
            setSubmitted(true);
            
            setFormData({
                date: '',
                firstName: '', middleName: '', lastName: '',
                fatherHusbandName: '', fatherHusbandMiddleName: '', fatherHusbandLastName: '',
                dob: '',
                localAddressLine2: '', localCity: '', localState: '', localPinCode: '',
                permanentAddressLine1: '', permanentCity: '', permanentState: '', permanentPinCode: '',
                email: '', mobile1: '', mobile2: '',
                panCardNo: '', aadhaarCardNo: '',
            });
            setFiles({ photograph: null, panCard: null, aadhaarCard: null });
            setPreviews({ photograph: null, panCard: null, aadhaarCard: null });

            setTimeout(() => setSubmitted(false), 4000);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Submission failed. Check your internet and Firebase configuration.');
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="contact-wrapper mt-5 pt-4">
            <div className="logo-container">
                <img src="/img/logo.jpeg" alt="Mahanta Group Logo" className="brand-logo" />
            </div>
            <section className="container py-5">
                <div className="text-center mb-5">
                    <span className="contact-badge">PARTNER PROGRAM</span>
                    <h1 className="contact-title mt-3">
                        Join as <span>Partner</span>
                    </h1>
                    <p className="contact-subtitle">
                        Empower your future with SOS Infrabulls's premier partnership program.
                    </p>
                </div>

                {submitted && (
                    <div className="alert alert-success d-flex align-items-center justify-content-center gap-2 mb-4 animate__animated animate__fadeIn" role="alert">
                        <CheckCircle2 size={20} />
                        <span>Your application has been submitted successfully!</span>
                    </div>
                )}

                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="contact-card">
                            <form onSubmit={handleSubmit}>
                                {/* Header Info */}
                                <div className="form-section-compact mb-4">
                                    <h5 className="section-title-compact"><Briefcase size={20} /> Basic Information</h5>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="small text-muted mb-1">Application Date</label>
                                            <input type="date" className="form-control" name="date" value={formData.date} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="small text-muted mb-1">Your Photograph</label>
                                            <div className="compact-upload">
                                                <input type="file" id="photo" name="photograph" accept="image/*" onChange={handleFileChange} hidden />
                                                <label htmlFor="photo" className="form-control d-flex align-items-center justify-content-between cursor-pointer">
                                                    <span className="text-muted">{previews.photograph ? "Photo Selected ✓" : "Upload Photograph"}</span>
                                                    <Camera size={18} className="text-primary" />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Basic Information */}
                                <div className="form-section-compact mb-4">
                                    <h5 className="section-title-compact"><User size={20} /> Applicant Name</h5>
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <input type="text" className="form-control" placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-4">
                                            <input type="text" className="form-control" placeholder="Middle Name" name="middleName" value={formData.middleName} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-4">
                                            <input type="text" className="form-control" placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    
                                    <h6 className="mt-3 text-muted small fw-bold">Father / Husband Details</h6>
                                    <div className="row g-3 mt-1">
                                        <div className="col-md-4">
                                            <input type="text" className="form-control" placeholder="First Name" name="fatherHusbandName" value={formData.fatherHusbandName} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-4">
                                            <input type="text" className="form-control" placeholder="Middle Name" name="fatherHusbandMiddleName" value={formData.fatherHusbandMiddleName} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-4">
                                            <input type="text" className="form-control" placeholder="Last Name" name="fatherHusbandLastName" value={formData.fatherHusbandLastName} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>

                                {/* Personal & Address */}
                                <div className="row g-4">
                                    <div className="col-12">
                                <div className="form-section-compact mb-4">
                                    <h5 className="section-title-compact"><User size={20} /> Personal Details</h5>
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <label className="small text-muted mb-1">Date of Birth</label>
                                            <input type="date" className="form-control" name="dob" value={formData.dob} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="small text-muted mb-1">PAN Card Number</label>
                                            <input type="text" className="form-control" placeholder="ABCDE1234F" name="panCardNo" value={formData.panCardNo} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="small text-muted mb-1">PAN Card Image</label>
                                            <div className="compact-upload">
                                                <input type="file" id="pan-file" name="panCard" accept="image/*" onChange={handleFileChange} hidden />
                                                <label htmlFor="pan-file" className="form-control d-flex align-items-center justify-content-between cursor-pointer">
                                                    <span className="text-muted small">{previews.panCard ? "PAN Selected ✓" : "Upload PAN"}</span>
                                                    <Upload size={18} className="text-primary" />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row g-3 mt-1">
                                        <div className="col-md-8">
                                            <label className="small text-muted mb-1">Aadhaar Card Number</label>
                                            <input type="text" className="form-control" placeholder="1234 5678 9012" name="aadhaarCardNo" value={formData.aadhaarCardNo} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="small text-muted mb-1">Aadhaar Card Image</label>
                                            <div className="compact-upload">
                                                <input type="file" id="aadhaar-file" name="aadhaarCard" accept="image/*" onChange={handleFileChange} hidden />
                                                <label htmlFor="aadhaar-file" className="form-control d-flex align-items-center justify-content-between cursor-pointer">
                                                    <span className="text-muted small">{previews.aadhaarCard ? "Aadhaar Selected ✓" : "Upload Aadhaar"}</span>
                                                    <Upload size={18} className="text-primary" />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                    </div>
                                </div>

                                <div className="row g-4">
                                    {/* Local Address */}
                                    <div className="col-md-6">
                                        <div className="form-section-compact mb-4">
                                            <h5 className="section-title-compact"><MapPin size={20} /> Local Address</h5>
                                            <div className="row g-3">
                                                <div className="col-12">
                                                    <input type="text" className="form-control" placeholder="Address Line" name="localAddressLine2" value={formData.localAddressLine2} onChange={handleChange} required />
                                                </div>
                                                <div className="col-md-4">
                                                    <input type="text" className="form-control" placeholder="City" name="localCity" value={formData.localCity} onChange={handleChange} required />
                                                </div>
                                                <div className="col-md-4">
                                                    <input type="text" className="form-control" placeholder="State" name="localState" value={formData.localState} onChange={handleChange} required />
                                                </div>
                                                <div className="col-md-4">
                                                    <input type="text" className="form-control" placeholder="Pin Code" name="localPinCode" value={formData.localPinCode} onChange={handleChange} required />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Permanent Address */}
                                    <div className="col-md-6">
                                        <div className="form-section-compact mb-4">
                                            <h5 className="section-title-compact"><MapPin size={20} /> Permanent Address</h5>
                                            <div className="row g-3">
                                                <div className="col-12">
                                                    <input type="text" className="form-control" placeholder="Address Line" name="permanentAddressLine1" value={formData.permanentAddressLine1} onChange={handleChange} required />
                                                </div>
                                                <div className="col-md-4">
                                                    <input type="text" className="form-control" placeholder="City" name="permanentCity" value={formData.permanentCity} onChange={handleChange} required />
                                                </div>
                                                <div className="col-md-4">
                                                    <input type="text" className="form-control" placeholder="State" name="permanentState" value={formData.permanentState} onChange={handleChange} required />
                                                </div>
                                                <div className="col-md-4">
                                                    <input type="text" className="form-control" placeholder="Pin Code" name="permanentPinCode" value={formData.permanentPinCode} onChange={handleChange} required />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="form-section-compact mb-4">
                                    <h5 className="section-title-compact"><Phone size={20} /> Contact Details</h5>
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <input type="email" className="form-control" placeholder="Email ID" name="email" value={formData.email} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-4">
                                            <input type="tel" className="form-control" placeholder="Mobile 1" name="mobile1" value={formData.mobile1} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-4">
                                            <input type="tel" className="form-control" placeholder="Mobile 2 (Opt)" name="mobile2" value={formData.mobile2} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                                {/* Payment Information */}
                                <div className="form-section-compact mb-4">
                                    <h5 className="section-title-compact"><CreditCard size={20} /> Payment Details (Registration Fee)</h5>
                                    <div className="row align-items-center">
                                        <div className="col-md-7">
                                            <p className="text-muted small mb-3">
                                                To complete your partnership registration, please scan the QR code to pay the processing fee. 
                                                Once paid, your application will be reviewed by our team.
                                            </p>
                                            <div className="payment-alert">
                                                <span className="fw-bold text-primary">Note:</span> Please mention your mobile number in the transaction note for faster verification.
                                            </div>
                                        </div>
                                        <div className="col-md-5 text-center">
                                            <div className="qr-container">
                                                <img src="/img/qr.jpeg" alt="UPI QR Code" className="qr-image" />
                                                <div className="qr-badge">Scan to Pay</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center mt-4">
                                    {loading && (
                                        <div className="progress mb-3" style={{ height: '20px', borderRadius: '10px' }}>
                                            <div 
                                                className="progress-bar progress-bar-striped progress-bar-animated" 
                                                role="progressbar" 
                                                style={{ width: `${uploadProgress}%`, backgroundColor: '#1174d6' }}
                                            >
                                                {uploadProgress}%
                                            </div>
                                        </div>
                                    )}
                                    <button type="submit" className="btn btn-primary px-5 py-3 w-100" disabled={loading}>
                                        {loading ? (
                                            <span className="d-flex align-items-center justify-content-center gap-2">
                                                <Loader2 size={20} className="spinner-icon" /> 
                                                {uploadProgress < 100 ? `Uploading Documents (${uploadProgress}%)` : 'Finalizing Registration...'}
                                            </span>
                                        ) : (
                                            'Submit Application'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default JoinAsPartner;
