import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import WorkerCard from '../components/WorkerCard';

export default function Booking() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [workerId, setWorkerId] = useState(searchParams.get('workerId') || '');
    const [workerName, setWorkerName] = useState(searchParams.get('workerName') || '');
    const specialtyFilter = searchParams.get('specialty') || '';
    const searchFilter = searchParams.get('search') || '';

    const [workers, setWorkers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [comment, setComment] = useState('');
    const [serviceDate, setServiceDate] = useState('');
    const [status, setStatus] = useState({ loading: false, error: '', success: false });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            alert('Please log in to hire a professional.');
            navigate('/login');
            return;
        }
        const parsedUser = JSON.parse(storedUser);

        if (parsedUser.role === 'WORKER') {
            alert('Access Restricted: Service professionals cannot hire other professionals. Please use a Client account.');
            navigate('/dashboard/worker');
            return;
        }
        setCurrentUser(parsedUser);
    }, [navigate]);

    // If no worker chosen yet, load the catalog so the customer can pick one.
    useEffect(() => {
        if (workerId) return;
        const fetchWorkers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/workers');
                let list = response.data;
                if (specialtyFilter) list = list.filter(w => w.specialty === specialtyFilter);
                if (searchFilter) list = list.filter(w => w.name.toLowerCase().includes(searchFilter.toLowerCase()));
                setWorkers(list);
            } catch (err) {
                console.error('Failed to load workers:', err);
            }
        };
        fetchWorkers();
    }, [workerId, specialtyFilter, searchFilter]);

    const handleSelectWorker = (worker) => {
        setWorkerId(worker.id);
        setWorkerName(worker.name);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: '', success: false });

        const bookingPayload = {
            workerId: parseInt(workerId),
            workerName: workerName,
            customerName: currentUser.name,
            customerPhone: currentUser.phone,
            serviceDate: serviceDate,
            comment: comment || 'No special instructions provided.'
        };

        try {
            await axios.post('http://localhost:8080/book', bookingPayload);
            setStatus({ loading: false, error: '', success: true });
            setTimeout(() => navigate('/dashboard/customer'), 2000);
        } catch (err) {
            console.error('Booking error:', err);
            setStatus({ loading: false, error: 'Failed to create booking. Please try again.', success: false });
        }
    };

    if (!workerId) {
        return (
            <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px' }}>
                <h2 style={{ color: '#2d3748', marginBottom: '20px', textAlign: 'center' }}>Choose a Professional to Book</h2>
                {workers.length === 0 ? (
                    <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', textAlign: 'center', border: '1px dashed #cbd5e0', color: '#718096' }}>
                        No matching professionals found.
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
                        {workers.map((worker) => (
                            <WorkerCard key={worker.id} worker={worker} onSelect={handleSelectWorker} />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    const todayString = new Date().toISOString().split('T')[0];

    return (
        <div style={{ maxWidth: '600px', margin: '60px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#003366', marginBottom: '5px' }}>Confirm Your Booking</h2>
            <p style={{ textAlign: 'center', color: '#718096', marginBottom: '30px' }}>
                Hiring <strong style={{ color: '#2d3748' }}>{workerName}</strong>
            </p>

            {status.error && <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>⚠️ {status.error}</div>}

            {status.success ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#f0fff4', borderRadius: '8px', border: '1px solid #c6f6d5' }}>
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>✅</div>
                    <h3 style={{ color: '#276749', margin: '0 0 10px 0' }}>Booking Request Sent!</h3>
                    <p style={{ color: '#2f855a', margin: 0 }}>Redirecting to your dashboard...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div style={{ backgroundColor: '#f7fafc', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                        <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#4a5568' }}><strong>Client Name:</strong> {currentUser?.name}</p>
                        <p style={{ margin: 0, fontSize: '14px', color: '#4a5568' }}><strong>Phone Number:</strong> {currentUser?.phone}</p>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#4a5568' }}>Service Date (Future Dates Only)</label>
                        <input
                            type="date" required min={todayString} value={serviceDate}
                            onChange={(e) => setServiceDate(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box', fontSize: '16px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#4a5568' }}>Special Instructions / Comments</label>
                        <textarea
                            rows="3" placeholder="e.g. Please arrive by 9 AM, keys are under the mat..."
                            value={comment} onChange={(e) => setComment(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box', fontSize: '16px', resize: 'vertical' }}
                        />
                    </div>

                    <button
                        type="submit" disabled={status.loading}
                        style={{
                            width: '100%', padding: '15px',
                            backgroundColor: status.loading ? '#cbd5e0' : '#003366',
                            color: status.loading ? '#718096' : 'white',
                            border: 'none', borderRadius: '8px',
                            fontSize: '18px', fontWeight: 'bold', cursor: status.loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {status.loading ? 'Processing...' : `Confirm Booking with ${workerName}`}
                    </button>
                </form>
            )}
        </div>
    );
}
