// Reusable presentational card for a service category (e.g. Cleaning, Cooking).
// Clicking a card takes the user to the worker catalog filtered by that specialty.
export default function ServiceCard({ service, onSelect }) {
    return (
        <div
            onClick={() => onSelect && onSelect(service)}
            style={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '30px 20px',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease-in-out',
                textAlign: 'center'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = '#cbd5e0';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                e.currentTarget.style.borderColor = '#e2e8f0';
            }}
        >
            <div style={{ fontSize: '45px', marginBottom: '15px' }}>{service.icon}</div>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#4a5568' }}>{service.name}</h3>
            {service.basePrice && (
                <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#718096' }}>
                    From ৳{service.basePrice}/hr
                </p>
            )}
        </div>
    );
}
