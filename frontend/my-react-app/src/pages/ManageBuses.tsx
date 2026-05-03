import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const ManageBuses = () => {
  const [buses, setBuses] = useState([]);
  const [name, setName] = useState('');
  const [seats, setSeats] = useState(40);
  const { showToast } = useToast();

  const fetchBuses = async () => {
    try {
      const response = await api.get('/admin/buses');
      setBuses(response.data);
    } catch (err) {
      showToast('Error fetching buses', 'error');
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const handleAddBus = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/buses', { name, total_seats: seats });
      setName('');
      showToast('Bus added successfully!', 'success');
      fetchBuses();
    } catch (err) {
      showToast('Error adding bus', 'error');
    }
  };

  return (
    <div className="container">
      <div className="admin-page">
      <h2>Manage Buses</h2>
      <form onSubmit={handleAddBus} className="admin-form">
        <input type="text" placeholder="Bus Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="number" placeholder="Seats" value={seats} onChange={(e) => setSeats(parseInt(e.target.value))} required />
        <button type="submit">Add Bus</button>
      </form>
      <ul className="admin-list">
        {buses.map((bus: any) => (
          <li key={bus.id} style={{ marginBottom: '0.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
            <strong>{bus.name}</strong> - {bus.total_seats} seats
          </li>
        ))}
      </ul>
    </div>
  </div>
  );
};

export default ManageBuses;
