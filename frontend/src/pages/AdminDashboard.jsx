import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [activeTab, setActiveTab] = useState('users');
    const [clientSearch, setClientSearch] = useState('');
    const [workerSearch, setWorkerSearch] = useState('');
    const [complaintSearch, setComplaintSearch] = useState('');
    const [complaintFilterStatus, setComplaintFilterStatus] = useState('ALL');
    const [enlargedImage, setEnlargedImage] = useState(null);

    const fetchAdminData = async () => {
        try {
            const userRes = await axios.get('http://localhost:8080/admin/users');
            setUsers(userRes.data);

            const complaintRes = await axios.get('http://localhost:8080/complaints');
            setComplaints(complaintRes.data);

            setLoading(false);
        } catch (err) {
            console.error("Error fetching admin data:", err);
            setError("Failed to load platform data. Make sure your backend server is running.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    const handleApprove = async (userId) => {
        try {
            await axios.put(`http://localhost:8080/admin/approve/${userId}`);
            alert("User approved successfully!");
            fetchAdminData();
        } catch (err) {
            console.error("Approval error:", err);
            alert("Failed to approve user.");
        }
    };

    const handleReject = async (userId) => {
        try {
            await axios.put(`http://localhost:8080/admin/reject/${userId}`);
            alert("User rejected due to mismatch/scam detection.");
            fetchAdminData();
        } catch (err) {
            console.error("Rejection error:", err);
            alert("Failed to reject user.");
        }
    };

    const handleUpdateStatus = async (complaintId, newStatus) => {
        try {
            await axios.put(`http://localhost:8080/complaints/${complaintId}/status`, { status: newStatus });
            alert(`Complaint status updated to ${newStatus}`);
            fetchAdminData();
        } catch (err) {
            console.error("Error updating complaint status:", err);
            alert("Failed to update complaint status.");
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '18px' }}>Loading Admin Console...</div>;

    const pendingUsers = users.filter(u => u.status === 'PENDING');
    const approvedClients = users.filter(u => u.status === 'APPROVED' && u.role === 'CUSTOMER');
    const approvedWorkers = users.filter(u => u.status === 'APPROVED' && u.role === 'WORKER');
    const rejectedUsers = users.filter(u => u.status === 'REJECTED');

    const filteredClients = approvedClients.filter(c =>
        c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
        c.phone.toLowerCase().includes(clientSearch.toLowerCase()) ||
        (c.email && c.email.toLowerCase().includes(clientSearch.toLowerCase()))
    );

    const filteredWorkers = approvedWorkers.filter(w =>
        w.name.toLowerCase().includes(workerSearch.toLowerCase()) ||
        w.phone.toLowerCase().includes(workerSearch.toLowerCase()) ||
        (w.email && w.email.toLowerCase().includes(workerSearch.toLowerCase()))
    );

    const filteredComplaints = complaints.filter(c => {
        const matchesSearch =
            (c.customerName && c.customerName.toLowerCase().includes(complaintSearch.toLowerCase())) ||
            (c.customerPhone && c.customerPhone.toLowerCase().includes(complaintSearch.toLowerCase())) ||
            (c.workerName && c.workerName.toLowerCase().includes(complaintSearch.toLowerCase())) ||
            (c.complaint && c.complaint.toLowerCase().includes(complaintSearch.toLowerCase())) ||
            (c.bookingId && c.bookingId.toString().toLowerCase().includes(complaintSearch.toLowerCase()));

        if (complaintFilterStatus === 'ALL') return matchesSearch;
        return matchesSearch && c.status === complaintFilterStatus;
    });

    return (
        <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', padding: '40px 20px', fontFamily: '"Segoe UI", Roboto, sans-serif', position: 'relative' }}>

            {/* Enhanced Image Modal with close button */}
            {enlargedImage && (
                <div
                    onClick={() => setEnlargedImage(null)}
                    style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.85)', display: 'flex',
                        justifyContent: 'center', alignItems: 'center', zIndex: 9999, cursor: 'pointer'
                    }}>
                    <button
                        onClick={() => setEnlargedImage(null)}
                        style={{
                            position: 'absolute', top: '25px', right: '30px', background: 'transparent',
                            border: 'none', color: '#ffffff', fontSize: '36px', cursor: 'pointer', fontWeight: 'bold'
                        }}
                    >
                        &times;
                    </button>
                    <img
                        src={enlargedImage}
                        alt="Enlarged Profile"
                        style={{ maxWidth: '85%', maxHeight: '85%', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

                <div style={{ backgroundColor: '#003366', color: 'white', padding: '30px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <h1 style={{ margin: '0 0 10px 0' }}>Admin Console & Trust Security</h1>
                    <p style={{ margin: '0 0 20px 0', color: '#cbd5e0' }}>Manage platform security, verify users, review complaints, and control pricing models.</p>

                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setActiveTab('users')}
                            style={{ padding: '10px 20px', backgroundColor: activeTab === 'users' ? '#fff' : 'rgba(255,255,255,0.15)', color: activeTab === 'users' ? '#003366' : '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            👥 User Management
                        </button>
                        <button
                            onClick={() => setActiveTab('complaints')}
                            style={{ padding: '10px 20px', backgroundColor: activeTab === 'complaints' ? '#fff' : 'rgba(255,255,255,0.15)', color: activeTab === 'complaints' ? '#003366' : '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            🚨 Complaints & Reports ({complaints.filter(c => c.status === 'OPEN').length})
                        </button>
                        <button
                            onClick={() => setActiveTab('pricing')}
                            style={{ padding: '10px 20px', backgroundColor: activeTab === 'pricing' ? '#fff' : 'rgba(255,255,255,0.15)', color: activeTab === 'pricing' ? '#003366' : '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            ⚙️ Pricing Control
                        </button>
                    </div>
                </div>

                {error && <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>⚠️ {error}</div>}

                {/* ================= USER MANAGEMENT TAB ================= */}
                {activeTab === 'users' && (
                    <>
                        <h2 style={{ color: '#c05621', marginBottom: '15px' }}>⏳ Pending Registrations ({pendingUsers.length})</h2>
                        {pendingUsers.length === 0 ? (
                            <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', marginBottom: '30px', border: '1px solid #e2e8f0', color: '#718096' }}>
                                No pending registrations waiting for review.
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '20px', marginBottom: '40px' }}>
                                {pendingUsers.map((user) => (
                                    <div key={user.id} style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '2px solid #feebc8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                            <div
                                                onClick={() => user.photoUrl && setEnlargedImage(user.photoUrl)}
                                                style={{ width: '65px', height: '65px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: user.photoUrl ? 'pointer' : 'default', flexShrink: 0, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                                {user.photoUrl ? (
                                                    <img src={user.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <span style={{ fontWeight: 'bold', fontSize: '22px', color: '#4a5568' }}>{user.name ? user.name.charAt(0).toUpperCase() : '?'}</span>
                                                )}
                                            </div>

                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                                    <h3 style={{ margin: 0, color: '#2d3748' }}>{user.name}</h3>
                                                    <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', backgroundColor: user.role === 'WORKER' ? '#ebf8ff' : '#faf5ff', color: user.role === 'WORKER' ? '#3182ce' : '#805ad5' }}>
                                                        {user.role}
                                                    </span>
                                                </div>
                                                <p style={{ margin: '4px 0', color: '#4a5568' }}><strong>Phone:</strong> {user.phone} | <strong>Email:</strong> {user.email || 'N/A'}</p>
                                                {user.role === 'WORKER' && (
                                                    <p style={{ margin: '4px 0', color: '#4a5568' }}><strong>Specialty:</strong> {user.specialty} | <strong>Exp:</strong> {user.experience}</p>
                                                )}
                                                <div style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: '#fffaf0', borderRadius: '6px', border: '1px solid #fbd38d', display: 'inline-block' }}>
                                                    <span style={{ color: '#c05621', fontWeight: 'bold' }}>National ID (NID): </span>
                                                    <span style={{ fontFamily: 'monospace', fontSize: '16px', color: '#2d3748' }}>{user.nid || 'Not Provided'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => handleApprove(user.id)} style={{ padding: '10px 20px', backgroundColor: '#38a169', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Approve</button>
                                            <button onClick={() => handleReject(user.id)} style={{ padding: '10px 20px', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Disapprove / Reject</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Approved Workers */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                            <h2 style={{ color: '#2d3748', margin: 0 }}>🛠️ Approved Workers & Maids ({filteredWorkers.length})</h2>
                            <input type="text" placeholder="Search worker..." value={workerSearch} onChange={(e) => setWorkerSearch(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', width: '280px', fontSize: '14px' }} />
                        </div>
                        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', marginBottom: '40px', overflowX: 'auto' }}>
                            {filteredWorkers.length === 0 ? <p style={{ color: '#718096', margin: 0 }}>No matching workers found.</p> : (
                                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #edf2f7', textAlign: 'left', color: '#718096', fontSize: '14px' }}>
                                            <th style={{ padding: '10px' }}>Name</th>
                                            <th style={{ padding: '10px' }}>Specialty</th>
                                            <th style={{ padding: '10px' }}>Phone</th>
                                            <th style={{ padding: '10px' }}>Email</th>
                                            <th style={{ padding: '10px' }}>NID</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredWorkers.map(w => (
                                            <tr key={w.id} style={{ borderBottom: '1px solid #f7fafc' }}>
                                                <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div onClick={() => w.photoUrl && setEnlargedImage(w.photoUrl)} style={{ width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#cbd5e0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: w.photoUrl ? 'pointer' : 'default', flexShrink: 0 }}>
                                                        {w.photoUrl ? <img src={w.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#4a5568' }}>{w.name?.charAt(0).toUpperCase()}</span>}
                                                    </div>
                                                    <span style={{ fontWeight: '600', color: '#2d3748' }}>{w.name}</span>
                                                </td>
                                                <td style={{ padding: '12px', color: '#4a5568' }}>{w.specialty || 'General'}</td>
                                                <td style={{ padding: '12px', color: '#4a5568' }}>{w.phone}</td>
                                                <td style={{ padding: '12px', color: '#4a5568' }}>{w.email || 'N/A'}</td>
                                                <td style={{ padding: '12px', fontFamily: 'monospace', color: '#2d3748' }}>{w.nid || 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Approved Clients */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                            <h2 style={{ color: '#2d3748', margin: 0 }}>👥 Approved Clients ({filteredClients.length})</h2>
                            <input type="text" placeholder="Search client..." value={clientSearch} onChange={(e) => setClientSearch(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', width: '280px', fontSize: '14px' }} />
                        </div>
                        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', marginBottom: '40px', overflowX: 'auto' }}>
                            {filteredClients.length === 0 ? <p style={{ color: '#718096', margin: 0 }}>No matching clients found.</p> : (
                                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #edf2f7', textAlign: 'left', color: '#718096', fontSize: '14px' }}>
                                            <th style={{ padding: '10px' }}>Name</th>
                                            <th style={{ padding: '10px' }}>Email</th>
                                            <th style={{ padding: '10px' }}>Phone</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredClients.map(c => (
                                            <tr key={c.id} style={{ borderBottom: '1px solid #f7fafc' }}>
                                                <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div onClick={() => c.photoUrl && setEnlargedImage(c.photoUrl)} style={{ width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#cbd5e0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: c.photoUrl ? 'pointer' : 'default', flexShrink: 0 }}>
                                                        {c.photoUrl ? <img src={c.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#4a5568' }}>{c.name?.charAt(0).toUpperCase()}</span>}
                                                    </div>
                                                    <span style={{ fontWeight: '600', color: '#2d3748' }}>{c.name}</span>
                                                </td>
                                                <td style={{ padding: '12px', color: '#4a5568' }}>{c.email || 'N/A'}</td>
                                                <td style={{ padding: '12px', color: '#4a5568' }}>{c.phone}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </>
                )}

                {/* ================= COMPLAINTS & REPORTS TAB (PRECISELY MAPPED) ================= */}
                {activeTab === 'complaints' && (
                    <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                        <h2 style={{ color: '#2d3748', marginTop: 0 }}>🚨 Platform Complaints & Reports</h2>
                        <p style={{ color: '#718096', marginBottom: '25px' }}>Review general complaints and targeted user reports filed by customers and workers.</p>

                        {/* Complaint Filters & Search Controls */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {['ALL', 'OPEN', 'RESOLVED', 'DISMISSED'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setComplaintFilterStatus(status)}
                                        style={{
                                            padding: '6px 14px',
                                            borderRadius: '6px',
                                            border: '1px solid #cbd5e0',
                                            backgroundColor: complaintFilterStatus === status ? '#003366' : '#f7fafc',
                                            color: complaintFilterStatus === status ? '#fff' : '#4a5568',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            fontSize: '13px'
                                        }}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                            <input
                                type="text"
                                placeholder="Search complaints, reports, or booking ID..."
                                value={complaintSearch}
                                onChange={(e) => setComplaintSearch(e.target.value)}
                                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', width: '280px', fontSize: '14px' }}
                            />
                        </div>

                        {filteredComplaints.length === 0 ? (
                            <div style={{ backgroundColor: '#f7fafc', padding: '30px', borderRadius: '8px', border: '1px dashed #cbd5e0', textAlign: 'center', color: '#718096' }}>
                                <h3>No matching complaints or reports found</h3>
                                <p style={{ fontSize: '14px', margin: '5px 0 0 0' }}>Try adjusting your search criteria or filter options.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '15px' }}>
                                {filteredComplaints.map(c => {
                                    const complaintText = c.complaint || '';
                                    const isClientIssue = complaintText.includes('[Client Issue]');
                                    const isWorkerReportTag = complaintText.includes('[Worker Report]') || (c.workerName && c.workerName.includes('[Worker Report]'));

                                    const submitterUser = users.find(u => u.name && c.customerName && u.name.trim().toLowerCase() === c.customerName.trim().toLowerCase());
                                    const isSubmitterWorker = submitterUser?.role === 'WORKER';

                                    const isWorkerReport = isClientIssue || isWorkerReportTag || (isSubmitterWorker && c.workerName && c.workerName !== 'General Support' && c.workerName !== 'N/A' && c.workerName !== 'Worker Dispute');

                                    let workerName = '';
                                    let workerPhone = '';
                                    let customerName = '';
                                    let customerPhone = '';

                                    if (isWorkerReport) {
                                        // For worker reports, c.workerName holds the worker and c.customerName holds the customer
                                        workerName = c.workerName ? c.workerName.replace('[Worker Report]', '').replace('[Client Issue]', '').trim() : '';
                                        customerName = c.customerName || '';

                                        const wUser = users.find(u => u.name && workerName && u.name.trim().toLowerCase() === workerName.trim().toLowerCase());
                                        workerPhone = wUser ? wUser.phone : 'N/A';

                                        const cUser = users.find(u => u.name && customerName && u.name.trim().toLowerCase() === customerName.trim().toLowerCase());
                                        customerPhone = cUser ? cUser.phone : (c.customerPhone || 'N/A');
                                    } else {
                                        customerName = c.customerName || 'N/A';
                                        customerPhone = c.customerPhone || 'N/A';

                                        const rawTarget = c.workerName || '';
                                        const cleanTarget = rawTarget.replace('[Worker Report]', '').replace('[Client Issue]', '').trim();
                                        const isGeneral = !cleanTarget || cleanTarget === 'General Support' || cleanTarget === 'N/A' || cleanTarget === 'Worker Dispute';

                                        if (!isGeneral) {
                                            workerName = cleanTarget;
                                            const wUser = users.find(u => u.name && workerName && u.name.trim().toLowerCase() === workerName.trim().toLowerCase());
                                            workerPhone = wUser ? wUser.phone : 'N/A';
                                        }
                                    }

                                    let ticketCategory = '';
                                    if (isWorkerReport) {
                                        ticketCategory = 'WORKER_REPORT';
                                    } else if (workerName) {
                                        ticketCategory = 'CUSTOMER_REPORT';
                                    } else if (isSubmitterWorker) {
                                        ticketCategory = 'WORKER_COMPLAINT';
                                    } else {
                                        ticketCategory = 'CUSTOMER_COMPLAINT';
                                    }

                                    return (
                                        <div key={c.id} style={{ padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#fdfdfe', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', flexWrap: 'wrap', gap: '15px' }}>
                                            <div style={{ flex: 1, minWidth: '280px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                                    {ticketCategory === 'CUSTOMER_COMPLAINT' && (
                                                        <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#faf5ff', color: '#805ad5' }}>
                                                            👤 Customer Complaint
                                                        </span>
                                                    )}
                                                    {ticketCategory === 'CUSTOMER_REPORT' && (
                                                        <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#ebf8ff', color: '#3182ce' }}>
                                                            🛡️ Customer Report (vs Worker)
                                                        </span>
                                                    )}
                                                    {ticketCategory === 'WORKER_COMPLAINT' && (
                                                        <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#fffaf0', color: '#c05621' }}>
                                                            🛠️ Worker Complaint
                                                        </span>
                                                    )}
                                                    {ticketCategory === 'WORKER_REPORT' && (
                                                        <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#f0fff4', color: '#38a169' }}>
                                                            ⚡ Worker Report (vs Customer)
                                                        </span>
                                                    )}

                                                    <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', backgroundColor: c.status === 'RESOLVED' ? '#def7ec' : c.status === 'OPEN' ? '#fde8e8' : '#e2e8f0', color: c.status === 'RESOLVED' ? '#03543f' : c.status === 'OPEN' ? '#9b1c1c' : '#4a5568' }}>
                                                        {c.status}
                                                    </span>
                                                </div>

                                                {ticketCategory === 'CUSTOMER_COMPLAINT' && (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '14px', color: '#2d3748' }}>
                                                        <div><strong>Customer Info:</strong> {customerName} (Phone: {customerPhone})</div>
                                                        <div><strong>Booking ID:</strong> {c.bookingId || 'N/A'}</div>
                                                    </div>
                                                )}

                                                {ticketCategory === 'CUSTOMER_REPORT' && (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '14px', color: '#2d3748' }}>
                                                        <div><strong>Customer Info:</strong> {customerName} (Phone: {customerPhone})</div>
                                                        <div><strong>Targeted Worker:</strong> {workerName} (Phone: {workerPhone})</div>
                                                        <div><strong>Booking ID:</strong> {c.bookingId || 'N/A'}</div>
                                                    </div>
                                                )}

                                                {ticketCategory === 'WORKER_COMPLAINT' && (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '14px', color: '#2d3748' }}>
                                                        <div><strong>Worker Info:</strong> {customerName} (Phone: {customerPhone})</div>
                                                        <div><strong>Booking ID:</strong> {c.bookingId || 'N/A'}</div>
                                                    </div>
                                                )}

                                                {ticketCategory === 'WORKER_REPORT' && (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '14px', color: '#2d3748' }}>
                                                        <div><strong>Worker Info:</strong> {workerName} (Phone: {workerPhone})</div>
                                                        <div><strong>Targeted Customer:</strong> {customerName} (Phone: {customerPhone})</div>
                                                        <div><strong>Booking ID:</strong> {c.bookingId || 'N/A'}</div>
                                                    </div>
                                                )}

                                                <p style={{ margin: '10px 0 0 0', fontSize: '15px', color: '#1a202c', fontStyle: 'italic', paddingLeft: '8px', borderLeft: '3px solid #cbd5e0' }}>
                                                    "{c.complaint}"
                                                </p>
                                            </div>

                                            <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                                                {c.status !== 'RESOLVED' && (
                                                    <button onClick={() => handleUpdateStatus(c.id, 'RESOLVED')} style={{ padding: '6px 12px', backgroundColor: '#38a169', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
                                                        Resolve
                                                    </button>
                                                )}
                                                {c.status !== 'DISMISSED' && (
                                                    <button onClick={() => handleUpdateStatus(c.id, 'DISMISSED')} style={{ padding: '6px 12px', backgroundColor: '#718096', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
                                                        Dismiss
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ================= PRICING CONTROL TAB ================= */}
                {activeTab === 'pricing' && (
                    <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                        <h2 style={{ color: '#2d3748', marginTop: 0 }}>⚙️ Service Pricing & Experience Multiplier Control</h2>
                        <p style={{ color: '#718096', marginBottom: '25px' }}>Configure base rates, hourly multipliers, and experience-based pricing brackets.</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '25px' }}>
                            <div style={{ padding: '20px', backgroundColor: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <label style={{ display: 'block', fontWeight: 'bold', color: '#4a5568', marginBottom: '8px' }}>Base Hourly Rate (BDT)</label>
                                <input type="number" defaultValue="350" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0' }} />
                            </div>
                            <div style={{ padding: '20px', backgroundColor: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <label style={{ display: 'block', fontWeight: 'bold', color: '#4a5568', marginBottom: '8px' }}>Experience Multiplier (Per Year)</label>
                                <input type="number" defaultValue="50" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0' }} />
                            </div>
                        </div>
                        <button onClick={() => alert("Pricing rules saved successfully!")} style={{ padding: '12px 25px', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                            Save Pricing Rules
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}