import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8080/login', {
                phone: identifier,
                password: password
            });

            localStorage.setItem('user', JSON.stringify(response.data));
            navigate(response.data.role === 'WORKER' ? '/dashboard/worker' : '/dashboard/customer');
        } catch (err) {
            console.error("Login error:", err);

            // Robust check to catch backend string responses (like pending/rejected status)
            const serverMessage = err.response?.data;

            if (typeof serverMessage === 'string' && serverMessage.trim() !== '') {
                setError(serverMessage);
            } else if (err.response?.status === 403) {
                setError("⏳ Your account is pending Admin approval or has been reviewed.");
            } else {
                setError('Incorrect phone/email or password. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '450px', margin: '80px auto', padding: '40px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontFamily: '"Segoe UI", Roboto, sans-serif' }}>
            <h2 style={{ textAlign: 'center', color: '#003366', marginBottom: '25px' }}>Login to Grihosheba</h2>

            {/* ERROR / PENDING / REJECTION MESSAGE ALERT BOX */}
            {error && (
                <div style={{ backgroundColor: '#fff5f5', color: '#c53030', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #feb2b2', fontSize: '15px', lineHeight: '1.5', fontWeight: '500' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#4a5568' }}>Phone Number or Email</label>
                    <input
                        type="text"
                        required
                        placeholder="Enter your phone or email"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box', fontSize: '16px' }}
                    />
                </div>

                <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#4a5568' }}>Password</label>
                    <input
                        type="password"
                        required
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box', fontSize: '16px' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%', padding: '14px',
                        backgroundColor: loading ? '#cbd5e0' : '#003366',
                        color: loading ? '#718096' : 'white',
                        border: 'none', borderRadius: '8px',
                        fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '20px', color: '#718096', fontSize: '14px' }}>
                Don't have an account? <Link to="/register" style={{ color: '#003366', fontWeight: 'bold', textDecoration: 'none' }}>Register here</Link>
            </p>
        </div>
    );
}