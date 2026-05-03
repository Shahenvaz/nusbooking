import type { Request, Response } from 'express';
import pool from '../config/db.js';
import type { AuthRequest } from '../middleware/authMiddleware.js';
import type { ResultSetHeader } from 'mysql2';

// --- Route Searching ---
export const searchRoutes = async (req: Request, res: Response) => {
  const { origin, destination, date } = req.query;
  try {
    let query = `
      SELECT r.*, b.name as bus_name, b.total_seats 
      FROM routes r 
      JOIN buses b ON r.bus_id = b.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (origin) {
      query += ' AND r.origin = ?';
      params.push(origin);
    }
    if (destination) {
      query += ' AND r.destination = ?';
      params.push(destination);
    }
    if (date) {
      query += ' AND DATE(r.departure_time) = ?';
      params.push(date);
    }

    const [rows]: any = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error searching routes' });
  }
};

export const getRouteDetails = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [routeRows]: any = await pool.query(`
      SELECT r.*, b.name as bus_name, b.total_seats 
      FROM routes r 
      JOIN buses b ON r.bus_id = b.id
      WHERE r.id = ?
    `, [id]);

    if (routeRows.length === 0) {
      return res.status(404).json({ message: 'Route not found' });
    }

    const [bookingRows]: any = await pool.query(
      'SELECT seat_number FROM bookings WHERE route_id = ? AND status = "booked"',
      [id]
    );

    const bookedSeats = bookingRows.map((b: any) => b.seat_number);

    res.json({
      ...routeRows[0],
      bookedSeats
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching route details' });
  }
};

// --- Bookings ---
export const createBooking = async (req: AuthRequest, res: Response) => {
  const { route_id, seat_number, guest_name, guest_email } = req.body;
  const user_id = req.user?.id || null;

  try {
    // Check if seat is already booked
    const [existing]: any = await pool.query(
      'SELECT * FROM bookings WHERE route_id = ? AND seat_number = ? AND status = "booked"',
      [route_id, seat_number]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Seat already booked' });
    }

    const [result]: [ResultSetHeader, any] = await pool.query(
      'INSERT INTO bookings (user_id, route_id, seat_number, guest_name, guest_email) VALUES (?, ?, ?, ?, ?)',
      [user_id, route_id, seat_number, guest_name || null, guest_email || null]
    );

    res.status(201).json({ message: 'Booking successful', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating booking' });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  const user_id = req.user?.id;
  try {
    const [rows]: any = await pool.query(`
      SELECT bk.*, r.origin, r.destination, r.departure_time, b.name as bus_name
      FROM bookings bk
      JOIN routes r ON bk.route_id = r.id
      JOIN buses b ON r.bus_id = b.id
      WHERE bk.user_id = ?
      ORDER BY bk.created_at DESC
    `, [user_id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your bookings' });
  }
};
