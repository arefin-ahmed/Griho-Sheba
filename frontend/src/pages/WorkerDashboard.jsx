import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function WorkerDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAvailable, setIsAvailable] = useState(true);

    // State for reporting a client
    const [reportingBooking, setReportingBooking] = useState(null);
    const [complaintText, setComplaintText] = useState('');
    const [submittingComplaint, setSubmittingComplaint] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            setLoading(false);
            return;
        }
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role !== 'WORKER') {
            navigate('/dashboard/customer');
            return;
        }
        setUser(parsedUser);

        const fetchBookings = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/bookings/worker/${parsedUser.id}`);
                setBookings(response.data);
            } catch (err) {
                console.error('Failed to load dashboard data:', err);
                setError('Could not load your records.');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [navigate]);

    const toggleAvailability = async () => {
        const next = !isAvailable;
        setIsAvailable(next);
        try {
            await axios.put(`http://localhost:8080/api/workers/${user.id}/availability`, { isAvailable: next });
        } catch (err) {
            console.error('Failed to update availability:', err);
        }
    };

    const handleSendComplaint = async (e) => {
        e.preventDefault();
        if (!complaintText.trim()) return;
        setSubmittingComplaint(true);
        try {
            await axios.post('http://localhost:8080/complaints', {
                bookingId: reportingBooking.id,
                workerName: `[Worker Report] ${user.name}`,
                customerName: reportingBooking.customerName,
                customerPhone: reportingBooking.customerPhone,
                complaint: `[Client Issue] ${complaintText}`,
                status: 'OPEN'
            });
            alert('✅ Complaint regarding client successfully submitted to the Admin team.');
        } catch (err) {
            console.error('Failed to submit complaint:', err);
            alert('⚠️ Failed to submit complaint.');
        } finally {
            setReportingBooking(null);
            setComplaintText('');
            setSubmittingComplaint(false);
        }
    };

    if (!user && !loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <h2 style={{ color: '#2d3748' }}>Please log in to view your dashboard.</h2>
                <button onClick={() => navigate('/login')} style={{ marginTop: '15px', padding: '12px 25px', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Go to Login
                </button>
            </div>
        );
    }

    if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '18px' }}>Loading your dashboard...</div>;

    return (
        <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', padding: '40px 20px', position: 'relative' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: '#003366', color: 'white', padding: '30px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ margin: '0 0 10px 0' }}>Welcome back, {user.name}!</h1>
                    <p style={{ margin: '0 0 5px 0', color: '#cbd5e0', fontSize: '15px' }}>Role: <strong>Domestic Professional</strong></p>
                    <p style={{ margin: 0, color: '#a0aec0', fontSize: '14px' }}>📞 Phone: {user.phone} | ✉️ Email: {user.email || 'Not provided'}</p>
                </div>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', padding: '15px 20px', borderRadius: '10px', textAlign: 'center' }}>
                    <span style={{ display: 'block', fontSize: '12px', color: '#cbd5e0', textTransform: 'uppercase' }}>Profile Rating</span>
                    <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#f6e05e' }}>⭐ 4.8 / 5.0</span>
                </div>
            </div>

            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ backgroundColor: '#fff', padding: '20px 25px', borderRadius: '12px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <div>
                        <h3 style={{ margin: '0 0 5px 0', color: '#2d3748' }}>Availability Status</h3>
                        <p style={{ margin: 0, color: '#718096', fontSize: '14px' }}>Toggle whether new customers can book you.</p>
                    </div>
                    <button onClick={toggleAvailability} style={{
                        padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer',
                        backgroundColor: isAvailable ? '#c6f6d5' : '#feb2b2', color: isAvailable ? '#22543d' : '#742a2a'
                    }}>
                        {isAvailable ? '🟢 Available' : '🔴 Unavailable'}
                    </button>
                </div>

                {error && <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>⚠️ {error}</div>}

                <h2 style={{ color: '#2d3748', marginBottom: '20px' }}>My Work Logbook & Scheduled Jobs</h2>

                {bookings.length === 0 ? (
                    <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', textAlign: 'center', border: '1px dashed #cbd5e0' }}>
                        <h3 style={{ color: '#4a5568', margin: 0 }}>No jobs booked yet.</h3>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '20px' }}>
                        {bookings.map((booking) => (
                            <div key={booking.id} style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        <h3 style={{ margin: 0, color: '#2d3748' }}>Client: {booking.customerName}</h3>
                                        <span style={{
                                            padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                                            backgroundColor: booking.status === 'PENDING' ? '#feebc8' : '#c6f6d5',
                                            color: booking.status === 'PENDING' ? '#c05621' : '#22543d'
                                        }}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <p style={{ margin: '5px 0', color: '#4a5568', fontSize: '15px' }}><strong>Scheduled Date:</strong> {booking.serviceDate}</p>
                                    <p style={{ margin: '5px 0', color: '#4a5568', fontSize: '15px' }}><strong>Client Phone:</strong> {booking.customerPhone}</p>
                                    <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f7fafc', borderRadius: '6px', borderLeft: '4px solid #003366' }}>
                                        <span style={{ fontSize: '12px', color: '#718096', display: 'block', fontWeight: 'bold' }}>Instructions / Notes:</span>
                                        <span style={{ fontSize: '14px', color: '#2d3748' }}>{booking.comment || 'None provided.'}</span>
                                    </div>
                                </div>

                                <div>
                                    <button onClick={() => setReportingBooking(booking)}
                                        style={{ padding: '8px 15px', backgroundColor: '#fff5f5', color: '#c53030', border: '1px solid #feb2b2', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                                        🚨 Report Client
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* REPORT CLIENT MODAL */}
            {reportingBooking && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setReportingBooking(null)}>
                    <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#fff', width: '100%', maxWidth: '500px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', padding: '30px' }}>
                        <h2 style={{ margin: '0 0 10px 0', color: '#c53030' }}>Report Client Issue</h2>
                        <p style={{ color: '#718096', fontSize: '14px', marginBottom: '20px' }}>
                            Filing a complaint regarding client <strong>{reportingBooking.customerName}</strong> ({reportingBooking.customerPhone}). This goes privately to the Admin team.
                        </p>
                        <form onSubmit={handleSendComplaint}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#4a5568', fontSize: '14px' }}>Describe the Incident</label>
                                <textarea rows="4" required placeholder="Detail what went wrong with this client..."
                                    value={complaintText} onChange={(e) => setComplaintText(e.target.value)}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box', fontSize: '15px', resize: 'vertical' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setReportingBooking(null)} style={{ padding: '10px 20px', backgroundColor: '#e2e8f0', color: '#4a5568', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                                <button type="submit" disabled={submittingComplaint} style={{ padding: '10px 20px', backgroundColor: '#c53030', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    {submittingComplaint ? 'Submitting...' : 'Submit Report'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}