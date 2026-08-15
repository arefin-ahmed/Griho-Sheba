import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ServiceCard from '../components/ServiceCard';
import WorkerCard from '../components/WorkerCard';

const CATEGORIES = [
    { name: 'Cleaning', icon: '🧹' },
    { name: 'Cooking', icon: '🍳' },
    { name: 'Babysitting', icon: '👶' },
    { name: 'Caregiver', icon: '🧑‍🦳' },
    { name: 'Laundry', icon: '🧺' },
    { name: 'Pet Care', icon: '🐾' }
];

const TESTIMONIALS = [
    {
        name: 'Nusrat Shoume',
        date: 'December 2025',
        rating: '⭐⭐⭐⭐⭐',
        text: 'I booked a deep clean service today from Grihosheba. They did an excellent job — very professional and thorough. Highly recommend!'
    },
    {
        name: 'M.A. Imtiyaz',
        date: 'October 2025',
        rating: '⭐⭐⭐⭐⭐',
        text: 'I have been using their services regularly for over a year now. I highly recommend them for their communication and excellent customer service.'
    }
];

export default function Home() {
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');
    const [workers, setWorkers] = useState([]);
    const [loadingWorkers, setLoadingWorkers] = useState(true);

    // State to manage the zoomed image modal
    const [enlargedImage, setEnlargedImage] = useState(null);

    useEffect(() => {
        const fetchWorkers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/workers');
                setWorkers(response.data.slice(0, 3)); // Teaser: top 3 only
            } catch (err) {
                console.error('Failed to load workers:', err);
            } finally {
                setLoadingWorkers(false);
            }
        };
        fetchWorkers();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            navigate(`/booking?search=${encodeURIComponent(searchInput)}`);
        }
    };

    const handleCategorySelect = (category) => {
        navigate(`/booking?specialty=${encodeURIComponent(category.name)}`);
    };

    const handleWorkerSelect = (worker) => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            alert('Please log in as a client to hire professionals.');
            navigate('/login');
            return;
        }
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role === 'WORKER') {
            alert('Access Restricted: Service professionals cannot hire other professionals. Please use a Client account.');
            return;
        }
        navigate(`/booking?workerId=${worker.id}&workerName=${encodeURIComponent(worker.name)}`);
    };

    return (
        <div style={{ position: 'relative' }}>

            {/* ENLARGED IMAGE MODAL */}
            {enlargedImage && (
                <div
                    onClick={() => setEnlargedImage(null)}
                    style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex',
                        justifyContent: 'center', alignItems: 'center', zIndex: 9999, cursor: 'pointer'
                    }}>
                    <img
                        src={enlargedImage}
                        alt="Enlarged Profile"
                        style={{ maxWidth: '85%', maxHeight: '85%', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
                    />
                </div>
            )}

            {/* Hero */}
            <div style={{ backgroundColor: '#f8f9fa', padding: '80px 20px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', color: '#2c3e50', marginBottom: '15px' }}>
                    Your Personal Assistant
                </h1>
                <p style={{ fontSize: '1.2rem', color: '#7f8c8d', marginBottom: '40px' }}>
                    One-stop solution for your home services. Order any service, anytime.
                </p>
                <form
                    onSubmit={handleSearch}
                    style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}
                >
                    <input
                        type="text"
                        placeholder="Find your service here e.g. Cooking, Babysitting, Pet Care..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        style={{ flex: 1, padding: '15px', border: 'none', outline: 'none', fontSize: '16px' }}
                    />
                    <button type="submit" style={{ padding: '15px 30px', backgroundColor: '#e74c3c', color: 'white', border: 'none', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Search
                    </button>
                </form>
            </div>

            {/* Service Categories */}
            <div style={{ maxWidth: '1000px', margin: '60px auto', textAlign: 'center' }}>
                <h2 style={{ color: '#2c3e50', marginBottom: '40px' }}>What type of service are you looking for?</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', padding: '0 20px' }}>
                    {CATEGORIES.map((cat) => (
                        <ServiceCard key={cat.name} service={cat} onSelect={handleCategorySelect} />
                    ))}
                </div>
            </div>

            {/* Featured Workers */}
            <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px' }}>
                <h2 style={{ color: '#2d3748', marginBottom: '20px', textAlign: 'center' }}>Verified Domestic Professionals</h2>
                {loadingWorkers ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>Loading available professionals...</div>
                ) : workers.length === 0 ? (
                    <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', textAlign: 'center', border: '1px dashed #cbd5e0', color: '#718096' }}>
                        No approved active workers available yet.
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
                        {workers.map((worker) => (
                            <WorkerCard
                                key={worker.id}
                                worker={worker}
                                onSelect={handleWorkerSelect}
                                onImageClick={setEnlargedImage}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Testimonials */}
            <div style={{ padding: '60px 20px', backgroundColor: '#ffffff' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <h2 style={{ color: '#2c3e50', marginBottom: '40px', textAlign: 'center' }}>Real Happy Customers</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '30px' }}>
                        {TESTIMONIALS.map((review, index) => (
                            <div key={index} style={{
                                backgroundColor: '#f8f9fa', borderLeft: '4px solid #e74c3c', padding: '25px',
                                width: '380px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderRadius: '0 8px 8px 0'
                            }}>
                                <div style={{ marginBottom: '10px' }}>{review.rating}</div>
                                <p style={{ fontStyle: 'italic', color: '#34495e', lineHeight: '1.6', marginBottom: '20px' }}>
                                    "{review.text}"
                                </p>
                                <div>
                                    <h4 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>{review.name}</h4>
                                    <small style={{ color: '#7f8c8d' }}>{review.date}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}