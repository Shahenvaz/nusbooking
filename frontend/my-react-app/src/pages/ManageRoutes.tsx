import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const ManageRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    bus_id: '',
    origin: '',
    destination: '',
    departure_time: '',
    arrival_time: '',
    price: ''
  });

  const fetchData = async () => {
    try {
      const [rResp, bResp] = await Promise.all([
        api.get('/admin/routes'),
        api.get('/admin/buses')
      ]);
      setRoutes(rResp.data);
      setBuses(bResp.data);
    } catch (err) {
      showToast('Error fetching data', 'error');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/routes', formData);
      setFormData({ bus_id: '', origin: '', destination: '', departure_time: '', arrival_time: '', price: '' });
      showToast('Route added successfully!', 'success');
      fetchData();
    } catch (err) {
      showToast('Error adding route', 'error');
    }
  };

  return (
    <div className="container">
      <div className="admin-page" style={{ maxWidth: '800px' }}>
      <h2>Manage Routes</h2>
      <form onSubmit={handleAddRoute} className="admin-form">
        <select value={formData.bus_id} onChange={(e) => setFormData({ ...formData, bus_id: e.target.value })} required>
          <option value="">Select Bus</option>
          {buses.map((bus: any) => <option key={bus.id} value={bus.id}>{bus.name}</option>)}
        </select>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <input type="text" placeholder="Origin" value={formData.origin} onChange={(e) => setFormData({ ...formData, origin: e.target.value })} required />
          <input type="text" placeholder="Destination" value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Departure</label>
            <input type="datetime-local" value={formData.departure_time} onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })} required />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Arrival</label>
            <input type="datetime-local" value={formData.arrival_time} onChange={(e) => setFormData({ ...formData, arrival_time: e.target.value })} required />
          </div>
        </div>
        <input type="number" placeholder="Price (Rs.)" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
        <button type="submit">Add Route</button>
      </form>
      <ul className="admin-list">
        {routes.map((route: any) => (
          <li key={route.id} style={{ marginBottom: '0.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
            <strong>{route.bus_name}</strong>: {route.origin} to {route.destination} - Rs. {Number(route.price).toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  </div>
  );
};

export default ManageRoutes;
