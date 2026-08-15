import { useState } from 'react';
import axios from 'axios';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'CUSTOMER',
        nid: '',
        dob: '',
        specialty: '',
        experience: '',
        hourlyWage: '',
        photoUrl: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const calculateAge = (dobString) => {
        const today = new Date();
        const birthDate = new Date(dobString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Limit image size to 2MB to prevent browser freezing or payload errors
            if (file.size > 2 * 1024 * 1024) {
                setError('Profile photo is too large. Please choose an image under 2MB.');
                return;
            }
            setError('');
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, photoUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setError('');
        setIsSubmitting(true);

        if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.nid || !formData.dob) {
            setError('All core fields are mandatory.');
            setIsSubmitting(false);
            return;
        }

        if (formData.role === 'WORKER' && (!formData.specialty || !formData.experience || !formData.hourlyWage)) {
            setError('Workers must provide their specialty, experience, and hourly wage to build a profile.');
            setIsSubmitting(false);
            return;
        }

        const age = calculateAge(formData.dob);
        if (age < 18) {
            setError('You must be at least 18 years old.');
            setIsSubmitting(false);
            return;
        }

        const phoneRegex = /^[0-9]{11}$/;
        if (!phoneRegex.test(formData.phone)) {
            setError('Phone number must be exactly 11 digits (e.g., 016XXXXXXXX).');
            setIsSubmitting(false);
            return;
        }

        try {
            await axios.post('http://localhost:8080/register', formData);
            alert("Registration successful! Your identity has been recorded.");
            window.location.href = '/login';
        } catch (err) {
            setError(err.response?.data || "Registration failed. Please check your connection or image size.");
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '50px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontFamily: '"Segoe UI", Roboto, sans-serif' }}>
            <h2 style={{ textAlign: 'center', color: '#ab0000', marginBottom: '20px' }}>Secure Registration</h2>

            {error && (
                <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '12px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px', borderLeft: '4px solid #dc3545', fontWeight: '500' }}>
                    ⚠️ {error}
                </div>
            )}

            <form onSubmit={handleRegister}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#4a5568', fontWeight: '500' }}>I am registering as a:</label>
                    <select
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', backgroundColor: '#fff' }}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        value={formData.role}
                    >
                        <option value="CUSTOMER">Customer (Looking to hire)</option>
                        <option value="WORKER">Domestic Worker (Looking for jobs)</option>
                    </select>
                </div>

                {formData.role === 'WORKER' && (
                    <div style={{ backgroundColor: '#f7fafc', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>💼 Professional Profile Details</h4>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#4a5568' }}>Primary Specialty</label>
                            <select
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
                                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                value={formData.specialty}
                            >
                                <option value="">Select a specialty...</option>
                                <option value="Cleaning">Cleaning</option>
                                <option value="Cooking">Cooking</option>
                                <option value="Babysitting">Babysitting</option>
                                <option value="Caregiver">Caregiver</option>
                                <option value="Laundry">Laundry</option>
                                <option value="Pet Care">Pet Care</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#4a5568' }}>Years of Experience</label>
                                <input
                                    type="text" placeholder="e.g. 3 years"
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
                                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#4a5568' }}>Hourly Wage (BDT)</label>
                                <input
                                    type="text" placeholder="e.g. 200/hr"
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
                                    onChange={(e) => setFormData({ ...formData, hourlyWage: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#4a5568', fontWeight: '500' }}>Full Legal Name</label>
                        <input
                            type="text" placeholder="e.g. John Doe"
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#4a5568', fontWeight: '500' }}>Date of Birth</label>
                        <input
                            type="date"
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
                            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        />
                    </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#4a5568', fontWeight: '500' }}>National ID (NID) Number</label>
                    <input
                        type="text" placeholder="Enter 10, 13, or 17 digit NID"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
                        onChange={(e) => setFormData({ ...formData, nid: e.target.value })}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#4a5568', fontWeight: '500' }}>Profile / NID Photo (Max 2MB)</label>
                    <input
                        type="file" accept="image/*" onChange={handlePhotoChange}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box', backgroundColor: '#fff' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#4a5568', fontWeight: '500' }}>Phone Number</label>
                        <input
                            type="text" placeholder="01XXXXXXXXX"
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#4a5568', fontWeight: '500' }}>Email Address</label>
                        <input
                            type="email" placeholder="name@example.com"
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>

                <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#4a5568', fontWeight: '500' }}>Secure Password</label>
                    <input
                        type="password" placeholder="••••••••"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                        width: '100%', padding: '14px',
                        backgroundColor: isSubmitting ? '#cbd5e0' : '#ab0000',
                        color: isSubmitting ? '#718096' : 'white',
                        border: 'none', borderRadius: '8px',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold', fontSize: '16px'
                    }}>
                    {isSubmitting ? 'Processing...' : 'Verify & Register Account'}
                </button>
            </form>
        </div>
    );
}