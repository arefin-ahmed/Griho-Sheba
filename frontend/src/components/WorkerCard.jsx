import { useState } from 'react';
import axios from 'axios';

export default function WorkerCard({ worker, onSelect, onImageClick }) {
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isReporting, setIsReporting] = useState(false);
    const [complaintText, setComplaintText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const displayWage = !worker.hourlyWage || worker.hourlyWage === 'null' || worker.hourlyWage === 'Pending Admin Review'
        ? 'Pending'
        : `৳${worker.hourlyWage}`;

    const handleReportSubmit = async (e) => {
        e.preventDefault();
        if (!complaintText.trim()) return;

        const storedUser = localStorage.getItem('user');
        const currentUser = storedUser ? JSON.parse(storedUser) : { name: 'Anonymous', phone: 'N/A' };

        setSubmitting(true);
        try {
            await axios.post('http://localhost:8080/complaints', {
                workerName: worker.name,
                customerName: currentUser.name,
                customerPhone: currentUser.phone || 'N/A',
                complaint: `[Worker Report] ${complaintText}`,
                status: 'OPEN'
            });
            alert('🚨 Report submitted successfully to Admin team.');
            setComplaintText('');
            setIsReporting(false);
            setIsProfileModalOpen(false);
        } catch (err) {
            console.error('Failed to submit report:', err);
            alert('Failed to submit report.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            {/* Main Worker Card */}
            <div style={{
                backgroundColor: '#fff',
                padding: '25px',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                        <div
                            onClick={() => worker.photoUrl && onImageClick && onImageClick(worker.photoUrl)}
                            style={{
                                width: '55px', height: '55px', backgroundColor: '#e2e8f0', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '24px', fontWeight: 'bold', color: '#4a5568',
                                overflow: 'hidden', cursor: worker.photoUrl ? 'pointer' : 'default',
                                flexShrink: 0, boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                            }}
                        >
                            {worker.photoUrl ? (
                                <img src={worker.photoUrl} alt={worker.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                worker.name?.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div>
                            <h3 style={{ margin: '0 0 5px 0', color: '#2d3748' }}>{worker.name}</h3>
                            <span style={{
                                backgroundColor: '#c6f6d5', color: '#22543d', padding: '2px 8px',
                                borderRadius: '10px', fontSize: '12px', fontWeight: 'bold'
                            }}>
                                ✓ Verified Profile
                            </span>
                        </div>
                    </div>

                    <p style={{ margin: '6px 0', color: '#4a5568', fontSize: '14px' }}>
                        <strong>Specialty:</strong> {worker.specialty || 'General Housekeeping'}
                    </p>
                    <p style={{ margin: '6px 0', color: '#4a5568', fontSize: '14px' }}>
                        <strong>Experience:</strong> {worker.experience || '2+'} Years
                    </p>
                    <p style={{ margin: '6px 0', color: '#2b6cb0', fontSize: '14px', fontWeight: 'bold' }}>
                        ⭐ {worker.rating ? worker.rating.toFixed(1) : '4.8'} Rating
                    </p>
                    <p style={{ margin: '6px 0', color: '#38a169', fontSize: '14px', fontWeight: 'bold' }}>
                        {displayWage !== 'Pending' ? `${displayWage} / hr` : 'Rate Pending'}
                    </p>
                </div>

                {/* Two Separate Action Buttons */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button
                        onClick={() => setIsProfileModalOpen(true)}
                        style={{
                            flex: 1, padding: '12px', backgroundColor: '#4a5568',
                            color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer',
                            fontWeight: 'bold', fontSize: '14px'
                        }}
                    >
                        View Profile
                    </button>
                    <button
                        onClick={() => onSelect && onSelect(worker)}
                        style={{
                            flex: 1, padding: '12px', backgroundColor: '#003366',
                            color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer',
                            fontWeight: 'bold', fontSize: '14px'
                        }}
                    >
                        Hire Now
                    </button>
                </div>
            </div>

            {/* Worker Profile & Report Modal Popup */}
            {isProfileModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center',
                    alignItems: 'center', zIndex: 1000, padding: '20px'
                }} onClick={() => setIsProfileModalOpen(false)}>
                    <div style={{
                        backgroundColor: '#fff', width: '100%', maxWidth: '450px', borderRadius: '16px',
                        padding: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                    }} onClick={(e) => e.stopPropagation()}>

                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <div style={{ width: '90px', height: '90px', margin: '0 auto 15px auto', borderRadius: '50%', backgroundColor: '#e2e8f0', overflow: 'hidden', border: '3px solid #003366' }}>
                                {worker.photoUrl ? (
                                    <img src={worker.photoUrl} alt={worker.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ fontSize: '36px', lineHeight: '90px', fontWeight: 'bold', color: '#4a5568' }}>
                                        {worker.name?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <h2 style={{ margin: '0 0 5px 0', color: '#2d3748' }}>{worker.name}</h2>
                            <p style={{ margin: 0, color: '#4a5568', fontSize: '15px' }}>Specialty: <strong>{worker.specialty}</strong></p>
                            <p style={{ margin: '5px 0', color: '#4a5568', fontSize: '14px' }}>Experience: {worker.experience}</p>
                            <p style={{ margin: 0, color: '#d69e2e', fontSize: '14px', fontWeight: 'bold' }}>⭐ {worker.rating || '4.8'} Rating</p>
                        </div>

                        {!isReporting ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <button
                                    onClick={() => { setIsProfileModalOpen(false); onSelect && onSelect(worker); }}
                                    style={{ padding: '12px', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    📅 Proceed to Hire
                                </button>
                                <button
                                    onClick={() => setIsReporting(true)}
                                    style={{ padding: '10px', backgroundColor: '#fff5f5', color: '#c53030', border: '1px solid #feb2b2', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                                >
                                    🚨 Report Worker Profile
                                </button>
                                <button
                                    onClick={() => setIsProfileModalOpen(false)}
                                    style={{ padding: '8px', backgroundColor: '#e2e8f0', color: '#4a5568', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleReportSubmit}>
                                <h3 style={{ color: '#c53030', margin: '0 0 10px 0', fontSize: '16px' }}>Report {worker.name}</h3>
                                <textarea
                                    rows="4" required placeholder="Why are you reporting this worker? Explain the issue..."
                                    value={complaintText} onChange={(e) => setComplaintText(e.target.value)}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', marginBottom: '15px', boxSizing: 'border-box', fontSize: '14px' }}
                                />
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                    <button type="button" onClick={() => setIsReporting(false)} style={{ padding: '8px 12px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                                    <button type="submit" disabled={submitting} style={{ padding: '8px 12px', backgroundColor: '#c53030', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                                        {submitting ? 'Submitting...' : 'Submit Report'}
                                    </button>
                                </div>
                            </form>
                        )}

                    </div>
                </div>
            )}
        </>
    );
}