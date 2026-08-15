import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    // Helper function to check if the current link is active
    const isActive = (path) => location.pathname === path;

    // Common style builder for links
    const getLinkStyle = (path) => ({
        textDecoration: 'none',
        color: isActive(path) ? '#ab0000' : '#4a5568',
        fontWeight: isActive(path) ? 'bold' : '500',
        borderBottom: isActive(path) ? '2px solid #ab0000' : '2px solid transparent',
        paddingBottom: '4px',
        transition: 'all 0.2s ease'
    });

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', fontFamily: '"Segoe UI", Roboto, sans-serif' }}>
            <Link to="/" style={{ textDecoration: 'none', fontSize: '24px', fontWeight: 'bold', color: '#ab0000' }}>
                Grihosheba
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                <Link to="/" style={getLinkStyle('/')}>Home</Link>

                {user && (
                    <Link
                        to={user.role === 'WORKER' ? '/dashboard/worker' : '/dashboard/customer'}
                        style={getLinkStyle(user.role === 'WORKER' ? '/dashboard/worker' : '/dashboard/customer')}
                    >
                        Dashboard
                    </Link>
                )}
                {user && (
                    <Link to="/profile" style={getLinkStyle('/profile')}>Profile</Link>
                )}

                <Link to="/admin" style={getLinkStyle('/admin')}>Admin Console</Link>

                {user ? (
                    <button
                        onClick={handleLogout}
                        style={{ padding: '8px 20px', backgroundColor: '#ab0000', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}
                    >
                        Logout
                    </button>
                ) : (
                    <>
                        <Link to="/register" style={getLinkStyle('/register')}>Register</Link>
                        <Link to="/login" style={{
                            textDecoration: 'none',
                            padding: '8px 20px',
                            border: '1px solid #ab0000',
                            backgroundColor: isActive('/login') ? '#ab0000' : 'transparent',
                            color: isActive('/login') ? '#fff' : '#ab0000',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            transition: 'all 0.2s ease'
                        }}>
                            Login
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}