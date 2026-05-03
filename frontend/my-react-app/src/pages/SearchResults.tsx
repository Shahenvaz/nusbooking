import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../api/axios';

const SearchResults = () => {
  const [routes, setRoutes] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const origin = query.get('origin');
  const destination = query.get('destination');
  const date = query.get('date');

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await api.get(`/user/routes/search?origin=${origin}&destination=${destination}&date=${date}`);
        setRoutes(response.data);
      } catch (err) {
        console.error('Error fetching routes', err);
      }
    };
    fetchRoutes();
  }, [origin, destination, date]);

  return (
    <div className="results-container">
      <h2>Buses from {origin} to {destination} on {date}</h2>
      {routes.length === 0 ? (
        <p>No buses found for this route.</p>
      ) : (
        <div className="route-list">
          {routes.map((route: any) => (
            <div key={route.id} className="route-card">
              <h3>{route.bus_name}</h3>
              <p>Departure: {new Date(route.departure_time).toLocaleString()}</p>
              <p>Arrival: {new Date(route.arrival_time).toLocaleString()}</p>
              <p>Price: Rs. {Number(route.price).toFixed(2)}</p>
              <Link to={`/book/${route.id}`} className="book-btn">Book Now</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
