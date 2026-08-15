import { useState } from 'react';
import axios from 'axios';

export default function ComplaintModal({ isOpen, onClose }) {
    const [complaintText, setComplaintText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            alert('Please log in first.');
            return;
        }
        const user = JSON.parse(storedUser);

        setSubmitting(true);
        try {
            await axios.post('http://localhost:8080/complaints', {
                workerName: user.role === 'WORKER' ? 'Worker Dispute' : 'General Support',
                customerName: user.name,
                customerPhone: user.phone,
                complaint: complaintText,
                status: 'OPEN'
            });
            alert('Complaint submitted successfully to Admin.');
            setComplaintText('');
            onClose();
        } catch (err) {
            console.error('Failed to submit complaint:', err);
            alert('Failed to submit complaint. Check backend connection.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
            alignItems: 'center', zIndex: 1000
        }}>
            <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', width: '450px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#2d3748' }}>🚨 File a Complaint</h3>
                <p style={{ fontSize: '13px', color: '#718096', marginBottom: '20px' }}>
                    Your complaint will be sent directly to the Admin review panel.
                </p>
                <form onSubmit={handleSubmit}>
                    <textarea
                        rows="4"
                        placeholder="Describe your issue clearly..."
                        value={complaintText}
                        onChange={(e) => setComplaintText(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', marginBottom: '20px', boxSizing: 'border-box', resize: 'vertical' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button type="button" onClick={onClose} style={{ padding: '8px 16px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting} style={{ padding: '8px 16px', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                            {submitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}