import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Home = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAllRoutes = async () => {
    try {
      const response = await api.get('/user/routes/search'); // Calling search without params returns all
      setRoutes(response.data);
    } catch (err) {
      console.error('Error fetching routes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRoutes();
  }, []);

  const filteredRoutes = routes.filter((route: any) => 
    route.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.bus_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <section className="hero-section">
        <h1>Travel Anywhere, Anytime</h1>
        <p>Book your bus tickets in seconds with India's most trusted booking platform. Comfortable seats, affordable prices.</p>
        
        <div className="search-bar" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <input 
            type="text" 
            placeholder="Search by city or bus name..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      <h2>Available Bus Routes</h2>
      
      {loading ? (
        <p>Loading routes...</p>
      ) : filteredRoutes.length === 0 ? (
        <p>No routes available at the moment.</p>
      ) : (
        <div className="route-list">
          {filteredRoutes.map((route: any) => (
            <div key={route.id} className="route-card">
              <div className="route-details">
                <h3>{route.bus_name}</h3>
                <p><strong>From:</strong> {route.origin} &nbsp; <strong>To:</strong> {route.destination}</p>
                <p><strong>Departure:</strong> {new Date(route.departure_time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                <p style={{ fontSize: '1.2rem', color: 'var(--secondary)', fontWeight: 'bold' }}>Rs. {Number(route.price).toFixed(2)}</p>
              </div>
              <Link to={`/book/${route.id}`} className="book-btn">Select Seats</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
