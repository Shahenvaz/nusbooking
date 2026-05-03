import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useToast } from '../context/ToastContext';

const Booking = () => {
  const { id } = useParams();
  const [route, setRoute] = useState<any>(null);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Custom Login/Guest Prompt Modal
  const [showPromptModal, setShowPromptModal] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await api.get(`/user/routes/${id}`);
        setRoute(response.data);
      } catch (err) {
        showToast('Error fetching route details', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, showToast]);

  const generateTicket = (bookingId: number, name: string) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('BusBook - E-Ticket', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Booking ID: ${bookingId}`, 20, 40);
    doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`, 20, 50);
    doc.setFontSize(16);
    doc.text('Passenger Details', 20, 70);
    autoTable(doc, {
      startY: 75,
      body: [
        ['Name', name],
        ['Bus', route.bus_name],
        ['Seat Number', selectedSeat?.toString() || 'N/A'],
      ],
    });
    doc.text('Trip Details', 20, (doc as any).lastAutoTable.finalY + 20);
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 25,
      body: [
        ['From', route.origin],
        ['To', route.destination],
        ['Departure', new Date(route.departure_time).toLocaleString()],
        ['Price', `Rs. ${Number(route.price).toFixed(2)}`],
      ],
    });
    doc.setFontSize(10);
    doc.text('Please present this ticket at the time of boarding.', 105, (doc as any).lastAutoTable.finalY + 30, { align: 'center' });
    doc.text('Thank you for choosing BusBook!', 105, (doc as any).lastAutoTable.finalY + 40, { align: 'center' });
    doc.save(`BusBook_Ticket_${bookingId}.pdf`);
  };

  const handleBooking = async () => {
    if (!user && !guestName) {
      setShowPromptModal(true);
      return;
    }
    if (selectedSeat === null) return;

    try {
      const name = user ? user.name : guestName;
      const response = await api.post('/user/bookings', { 
        route_id: id, 
        seat_number: selectedSeat,
        guest_name: user ? user.name : guestName,
        guest_email: user ? user.email : guestEmail
      });
      
      showToast('Booking successful! Your ticket is being downloaded.', 'success');
      generateTicket(response.data.id, name);

      if (user) {
        navigate('/my-bookings');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Booking failed', 'error');
    }
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (!route) return <div className="container"><p>Route not found</p></div>;

  const seats = Array.from({ length: route.total_seats }, (_, i) => i + 1);

  return (
    <div className="container">
      <div className="booking-container" style={{ maxWidth: '800px' }}>
        <h2>Book Your Seat</h2>
        <div className="route-info" style={{ marginBottom: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
          <h3 style={{ color: 'var(--primary)' }}>{route.bus_name}</h3>
          <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>{route.origin} → {route.destination}</p>
          <p style={{ color: 'var(--text-muted)' }}>Departure: {new Date(route.departure_time).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</p>
          <p style={{ fontSize: '1.5rem', color: 'var(--secondary)', fontWeight: 'bold', marginTop: '0.5rem' }}>Rs. {Number(route.price).toFixed(2)}</p>
        </div>

        {!user && (
          <div className="guest-info" style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Passenger Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="Full Name" 
                value={guestName} 
                onChange={(e) => setGuestName(e.target.value)} 
                required 
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={guestEmail} 
                onChange={(e) => setGuestEmail(e.target.value)} 
              />
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Or <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: 'var(--primary)', padding: 0, font: 'inherit', cursor: 'pointer', textDecoration: 'underline' }}>Login</button> to save booking to history.
            </p>
          </div>
        )}

        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Select your preferred seat</h3>
        <div className="seat-grid">
          {seats.map((seat) => (
            <button
              key={seat}
              className={`seat ${route.bookedSeats.includes(seat) ? 'booked' : ''} ${selectedSeat === seat ? 'selected' : ''}`}
              disabled={route.bookedSeats.includes(seat)}
              onClick={() => setSelectedSeat(seat)}
            >
              {seat}
            </button>
          ))}
        </div>
        {selectedSeat && (
          <div className="confirm-section">
            <p style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Selected Seat: {selectedSeat}</p>
            <button onClick={handleBooking}>Confirm Booking</button>
          </div>
        )}
      </div>

      {/* Identity Prompt Modal */}
      {showPromptModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Passenger Information Required</h3>
            </div>
            <div className="modal-body">
              <p>Please enter your name in the form above to book a seat as a guest, or login to your account.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowPromptModal(false)}>Understood</button>
              <button className="btn-edit" onClick={() => navigate('/login')}>Go to Login</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
