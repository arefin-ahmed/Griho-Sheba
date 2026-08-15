import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ComplaintModal from '../components/ComplaintModal';

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', phone: '', specialty: '', experience: '', photoUrl: '' });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [isComplaintOpen, setIsComplaintOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setForm({
            name: parsedUser.name || '',
            email: parsedUser.email || '',
            phone: parsedUser.phone || '',
            specialty: parsedUser.specialty || '',
            experience: parsedUser.experience || '',
            photoUrl: parsedUser.photoUrl || ''
        });
    }, [navigate]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm({ ...form, photoUrl: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            const response = await axios.put(`http://localhost:8080/profile/${user.id}`, form);
            localStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);
            setMessage('✅ Profile updated successfully.');
        } catch (err) {
            console.error('Failed to update profile:', err);
            setMessage('⚠️ Could not update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (!user) return null;

    return (
        <div style={{ maxWidth: '500px', margin: '60px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{
                    width: '90px', height: '90px', margin: '0 auto 10px auto', borderRadius: '50%',
                    backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', border: '3px solid #003366', boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}>
                    {form.photoUrl ? (
                        <img src={form.photoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#4a5568' }}>
                            {user.name?.charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>
                <h3 style={{ margin: '0 0 5px 0', color: '#2d3748' }}>{user.name}</h3>
                <span style={{ backgroundColor: '#edf2f7', color: '#4a5568', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                    {user.role}
                </span>
            </div>

            <h2 style={{ textAlign: 'center', color: '#003366', marginBottom: '25px' }}>My Profile</h2>

            {message && <div style={{ backgroundColor: '#f7fafc', color: '#2d3748', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>{message}</div>}

            <form onSubmit={handleSave}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#4a5568' }}>Update Photo</label>
                    <input type="file" accept="image/*" onChange={handlePhotoChange}
                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box', backgroundColor: '#fff' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#4a5568' }}>Full Name</label>
                    <input name="name" value={form.name} onChange={handleChange}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#4a5568' }}>Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#4a5568' }}>Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
                </div>

                {user.role === 'WORKER' && (
                    <>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#4a5568' }}>Specialty</label>
                            <input name="specialty" value={form.specialty} onChange={handleChange}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#4a5568' }}>Experience</label>
                            <input name="experience" value={form.experience} onChange={handleChange}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
                        </div>
                    </>
                )}

                <button type="submit" disabled={saving} style={{
                    width: '100%', padding: '14px', marginTop: '10px',
                    backgroundColor: saving ? '#cbd5e0' : '#ab0000', color: 'white',
                    border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px',
                    cursor: saving ? 'not-allowed' : 'pointer'
                }}>
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>

            {user.role !== 'ADMIN' && (
                <button
                    type="button"
                    onClick={() => setIsComplaintOpen(true)}
                    style={{
                        width: '100%', padding: '12px', marginTop: '15px',
                        backgroundColor: '#4a5568', color: 'white',
                        border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px',
                        cursor: 'pointer'
                    }}
                >
                    💬 Contact Support / File Complaint
                </button>
            )}

            <ComplaintModal
                isOpen={isComplaintOpen}
                onClose={() => setIsComplaintOpen(false)}
            />
        </div>
    );
}