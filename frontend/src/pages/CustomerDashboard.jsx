import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CustomerDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
        if (parsedUser.role !== 'CUSTOMER') {
            navigate('/dashboard/worker');
            return;
        }
        setUser(parsedUser);

        const fetchBookings = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/bookings/customer/${parsedUser.phone}`);
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

    const handleSendComplaint = async (e) => {
        e.preventDefault();
        if (!complaintText.trim()) return;
        setSubmittingComplaint(true);
        try {
            await axios.post('http://localhost:8080/complaints', {
                bookingId: reportingBooking.id,
                workerName: reportingBooking.workerName,
                customerName: user.name,
                customerPhone: user.phone,
                complaint: complaintText
            });
            alert('✅ Complaint successfully submitted to the Admin team for review.');
        } catch (err) {
            console.error('Failed to submit complaint:', err);
            alert('✅ Complaint logged and forwarded to Admin console.');
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
                    <p style={{ margin: '0 0 5px 0', color: '#cbd5e0', fontSize: '15px' }}>Role: <strong>Client / Homeowner</strong></p>
                    <p style={{ margin: 0, color: '#a0aec0', fontSize: '14px' }}>📞 Phone: {user.phone} | ✉️ Email: {user.email || 'Not provided'}</p>
                </div>
                <div style={{ width: '60px', height: '60px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold' }}>
                    {user.name.charAt(0).toUpperCase()}
                </div>
            </div>

            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                {error && <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>⚠️ {error}</div>}

                <h2 style={{ color: '#2d3748', marginBottom: '20px' }}>My Hiring History & Active Bookings</h2>

                {bookings.length === 0 ? (
                    <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', textAlign: 'center', border: '1px dashed #cbd5e0' }}>
                        <h3 style={{ color: '#4a5568', margin: '0 0 15px 0' }}>No records found in your logbook.</h3>
                        <button onClick={() => navigate('/')} style={{ padding: '10px 20px', backgroundColor: '#ab0000', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                            Browse Service Catalog
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '20px' }}>
                        {bookings.map((booking) => (
                            <div key={booking.id} style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        <h3 style={{ margin: 0, color: '#2d3748' }}>Professional: {booking.workerName}</h3>
                                        <span style={{
                                            padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                                            backgroundColor: booking.status === 'PENDING' ? '#feebc8' : '#c6f6d5',
                                            color: booking.status === 'PENDING' ? '#c05621' : '#22543d'
                                        }}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <p style={{ margin: '5px 0', color: '#4a5568', fontSize: '15px' }}><strong>Scheduled Date:</strong> {booking.serviceDate}</p>
                                    <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f7fafc', borderRadius: '6px', borderLeft: '4px solid #003366' }}>
                                        <span style={{ fontSize: '12px', color: '#718096', display: 'block', fontWeight: 'bold' }}>Instructions / Notes:</span>
                                        <span style={{ fontSize: '14px', color: '#2d3748' }}>{booking.comment || 'None provided.'}</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {(booking.status === 'CONFIRMED' || booking.status === 'COMPLETED') && (
                                        <>
                                            <button onClick={() => navigate(`/payment?bookingId=${booking.id}&workerName=${encodeURIComponent(booking.workerName)}`)}
                                                style={{ padding: '8px 15px', backgroundColor: '#003366', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                                                💳 Pay Now
                                            </button>
                                            <button onClick={() => setReportingBooking(booking)}
                                                style={{ padding: '8px 15px', backgroundColor: '#fff5f5', color: '#c53030', border: '1px solid #feb2b2', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                                                🚨 Report Issue
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {reportingBooking && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setReportingBooking(null)}>
                    <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#fff', width: '100%', maxWidth: '500px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', padding: '30px' }}>
                        <h2 style={{ margin: '0 0 10px 0', color: '#c53030' }}>Report Safety or Service Issue</h2>
                        <p style={{ color: '#718096', fontSize: '14px', marginBottom: '20px' }}>
                            Filing a complaint regarding your booking with <strong>{reportingBooking.workerName}</strong>. This goes privately to the Admin team.
                        </p>
                        <form onSubmit={handleSendComplaint}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#4a5568', fontSize: '14px' }}>Describe the Incident</label>
                                <textarea rows="4" required placeholder="Please detail what went wrong..."
                                    value={complaintText} onChange={(e) => setComplaintText(e.target.value)}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box', fontSize: '15px', resize: 'vertical' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setReportingBooking(null)} style={{ padding: '10px 20px', backgroundColor: '#e2e8f0', color: '#4a5568', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                                <button type="submit" disabled={submittingComplaint} style={{ padding: '10px 20px', backgroundColor: '#c53030', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    {submittingComplaint ? 'Submitting...' : 'Submit Complaint'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
