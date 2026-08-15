export default function Footer() {
    return (
        <footer style={{ backgroundColor: '#2c3e50', color: '#ecf0f1', padding: '50px 20px 20px 20px', marginTop: '60px' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>

                {/* Brand Section */}
                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ color: '#e74c3c', margin: '0 0 15px 0', fontSize: '24px' }}>Grihosheba</h3>
                    <p style={{ fontSize: '14px', maxWidth: '250px', lineHeight: '1.6', color: '#bdc3c7' }}>
                        Your trusted platform for finding reliable and verified domestic helpers in Bangladesh.
                    </p>
                </div>

                {/* Quick Links Section */}
                <div style={{ marginBottom: '30px' }}>
                    <h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Quick Links</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', lineHeight: '2.2', color: '#bdc3c7' }}>
                        <li style={{ cursor: 'pointer' }}>Home</li>
                        <li style={{ cursor: 'pointer' }}>All Services</li>
                        <li style={{ cursor: 'pointer' }}>Become a Worker</li>
                        <li style={{ cursor: 'pointer' }}>FAQ</li>
                    </ul>
                </div>

                {/* Contact Section */}
                <div style={{ marginBottom: '30px' }}>
                    <h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Contact Us</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', lineHeight: '2.2', color: '#bdc3c7' }}>
                        <li>📍 Dhaka, Bangladesh</li>
                        <li>📧 support@grihosheba.com</li>
                        <li>📞 +880 1234 567890</li>
                    </ul>
                </div>

            </div>

            {/* Copyright Bar */}
            <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #34495e', fontSize: '12px', color: '#7f8c8d' }}>
                © 2026 Grihosheba. All rights reserved.
            </div>
        </footer>
    );
}