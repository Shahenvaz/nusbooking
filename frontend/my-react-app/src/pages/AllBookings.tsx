import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<any>(null);
  const { showToast } = useToast();
  
  // Edit Form State
  const [editSeat, setEditSeat] = useState('');
  const [editStatus, setEditStatus] = useState('');

  const fetchBookings = async () => {
    try {
      const response = await api.get('/admin/bookings');
      setBookings(response.data);
    } catch (err) {
      showToast('Error fetching bookings', 'error');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const openEditModal = (booking: any) => {
    setCurrentBooking(booking);
    setEditSeat(booking.seat_number.toString());
    setEditStatus(booking.status);
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    try {
      await api.put(`/admin/bookings/${currentBooking.id}`, {
        seat_number: parseInt(editSeat),
        status: editStatus
      });
      setShowEditModal(false);
      showToast('Booking updated successfully!', 'success');
      fetchBookings();
    } catch (err) {
      showToast('Error updating booking', 'error');
    }
  };

  const openDeleteModal = (booking: any) => {
    setCurrentBooking(booking);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/admin/bookings/${currentBooking.id}`);
      setShowDeleteModal(false);
      showToast('Booking deleted permanently', 'info');
      fetchBookings();
    } catch (err) {
      showToast('Error deleting booking', 'error');
    }
  };

  return (
    <div className="container">
      <div className="bookings-container" style={{ maxWidth: '1000px' }}>
        <h2>All System Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Passenger</th>
              <th>Bus & Route</th>
              <th>Departure</th>
              <th>Seat</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking: any) => (
              <tr key={booking.id}>
                <td>
                  {booking.user_name ? (
                    <span>{booking.user_name}<br/><small>{booking.user_email}</small></span>
                  ) : (
                    <span>Guest: {booking.guest_name}<br/><small>{booking.guest_email || 'No Email'}</small></span>
                  )}
                </td>
                <td>
                  <strong>{booking.bus_name}</strong><br/>
                  <small>{booking.origin} to {booking.destination}</small>
                </td>
                <td>{new Date(booking.departure_time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                <td style={{ textAlign: 'center' }}>{booking.seat_number}</td>
                <td>
                  <span style={{ 
                    padding: '0.2rem 0.6rem', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem',
                    background: booking.status === 'booked' ? '#dcfce7' : '#fee2e2',
                    color: booking.status === 'booked' ? '#166534' : '#991b1b'
                  }}>
                    {booking.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => openEditModal(booking)}
                      className="btn-action btn-edit"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => openDeleteModal(booking)}
                      className="btn-action btn-delete"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>

    {/* Edit Modal */}
    {showEditModal && (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Edit Booking</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Updating booking for {currentBooking?.guest_name || currentBooking?.user_name}
            </p>
          </div>
          <div className="modal-body">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Seat Number</label>
            <input 
              type="number" 
              value={editSeat} 
              onChange={(e) => setEditSeat(e.target.value)} 
              placeholder="Enter seat number"
            />
            
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Booking Status</label>
            <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
              <option value="booked">Booked</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="modal-footer">
            <button className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
            <button className="btn-edit" style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', color: 'white', fontWeight: '600', border: 'none', cursor: 'pointer' }} onClick={handleEditSubmit}>Save Changes</button>
          </div>
        </div>
      </div>
    )}

    {/* Delete Modal */}
    {showDeleteModal && (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3 style={{ color: '#ef4444' }}>Confirm Delete</h3>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete this booking? This action cannot be undone.</p>
            <p style={{ marginTop: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', fontSize: '0.9rem' }}>
              <strong>Passenger:</strong> {currentBooking?.guest_name || currentBooking?.user_name}<br/>
              <strong>Bus:</strong> {currentBooking?.bus_name}
            </p>
          </div>
          <div className="modal-footer">
            <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
            <button className="btn-delete" style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', color: 'white', fontWeight: '600', border: 'none', cursor: 'pointer' }} onClick={handleDeleteConfirm}>Delete Permanently</button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default AllBookings;
