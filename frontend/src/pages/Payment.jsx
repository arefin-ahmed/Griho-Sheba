import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Payment() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const bookingId = searchParams.get('bookingId');
    const workerName = searchParams.get('workerName');

    const [method, setMethod] = useState('BKASH');
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState({ loading: false, error: '', success: false });

    if (!bookingId) {
        return (
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <h2>No booking selected for payment.</h2>
                <button onClick={() => navigate('/dashboard/customer')} style={{ padding: '10px 20px', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '15px' }}>
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const handlePay = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: '', success: false });
        try {
            await axios.post('http://localhost:8080/payments', {
                bookingId: parseInt(bookingId),
                amount: parseFloat(amount),
                method
            });
            setStatus({ loading: false, error: '', success: true });
            setTimeout(() => navigate('/dashboard/customer'), 2000);
        } catch (err) {
            console.error('Payment error:', err);
            setStatus({ loading: false, error: 'Payment failed. Please try again.', success: false });
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '60px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#003366', marginBottom: '5px' }}>Complete Payment</h2>
            <p style={{ textAlign: 'center', color: '#718096', marginBottom: '30px' }}>
                For your booking with <strong style={{ color: '#2d3748' }}>{workerName}</strong>
            </p>

            {status.error && <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>⚠️ {status.error}</div>}

            {status.success ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#f0fff4', borderRadius: '8px', border: '1px solid #c6f6d5' }}>
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>✅</div>
                    <h3 style={{ color: '#276749', margin: '0 0 10px 0' }}>Payment Successful!</h3>
                    <p style={{ color: '#2f855a', margin: 0 }}>Redirecting to your dashboard...</p>
                </div>
            ) : (
                <form onSubmit={handlePay}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#4a5568' }}>Amount (BDT)</label>
                        <input type="number" required min="1" value={amount} onChange={(e) => setAmount(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box', fontSize: '16px' }} />
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#4a5568' }}>Payment Method</label>
                        <select value={method} onChange={(e) => setMethod(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '16px' }}>
                            <option value="BKASH">bKash</option>
                            <option value="NAGAD">Nagad</option>
                            <option value="CARD">Debit/Credit Card</option>
                            <option value="CASH">Cash on Service</option>
                        </select>
                    </div>

                    <button type="submit" disabled={status.loading} style={{
                        width: '100%', padding: '15px',
                        backgroundColor: status.loading ? '#cbd5e0' : '#003366',
                        color: status.loading ? '#718096' : 'white',
                        border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold',
                        cursor: status.loading ? 'not-allowed' : 'pointer'
                    }}>
                        {status.loading ? 'Processing...' : 'Pay Now'}
                    </button>
                </form>
            )}
        </div>
    );
}
