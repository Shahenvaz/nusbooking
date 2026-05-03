import { useEffect, useState } from 'react';
import api from '../api/axios';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/user/bookings/my-bookings');
        setBookings(response.data);
      } catch (err) {
        console.error('Error fetching bookings', err);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="container">
      <div className="bookings-container">
        <h2>My Bookings</h2>
      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Bus</th>
              <th>Route</th>
              <th>Departure</th>
              <th>Seat</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking: any) => (
              <tr key={booking.id}>
                <td>{booking.bus_name}</td>
                <td>{booking.origin} to {booking.destination}</td>
                <td>{new Date(booking.departure_time).toLocaleString()}</td>
                <td>{booking.seat_number}</td>
                <td>{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
  );
};

export default MyBookings;
