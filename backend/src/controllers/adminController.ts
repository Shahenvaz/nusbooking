import type { Request, Response } from 'express';
import pool from '../config/db.js';
import type { ResultSetHeader } from 'mysql2';

// --- Buses Management ---
export const addBus = async (req: Request, res: Response) => {
  const { name, total_seats } = req.body;
  try {
    const [result]: [ResultSetHeader, any] = await pool.query(
      'INSERT INTO buses (name, total_seats) VALUES (?, ?)',
      [name, total_seats]
    );
    res.status(201).json({ id: result.insertId, name, total_seats });
  } catch (error) {
    res.status(500).json({ message: 'Error adding bus' });
  }
};

export const getBuses = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM buses');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching buses' });
  }
};

// --- Routes Management ---
export const addRoute = async (req: Request, res: Response) => {
  const { bus_id, origin, destination, departure_time, arrival_time, price } = req.body;
  try {
    const [result]: [ResultSetHeader, any] = await pool.query(
      'INSERT INTO routes (bus_id, origin, destination, departure_time, arrival_time, price) VALUES (?, ?, ?, ?, ?, ?)',
      [bus_id, origin, destination, departure_time, arrival_time, price]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: 'Error adding route' });
  }
};

export const getAllRoutes = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(`
      SELECT r.*, b.name as bus_name 
      FROM routes r 
      JOIN buses b ON r.bus_id = b.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching routes' });
  }
};

// --- Bookings Management ---
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(`
      SELECT bk.*, u.name as user_name, u.email as user_email, 
             r.origin, r.destination, r.departure_time, b.name as bus_name
      FROM bookings bk
      LEFT JOIN users u ON bk.user_id = u.id
      JOIN routes r ON bk.route_id = r.id
      JOIN buses b ON r.bus_id = b.id
      ORDER BY bk.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, seat_number } = req.body;
  try {
    await pool.query(
      'UPDATE bookings SET status = ?, seat_number = ? WHERE id = ?',
      [status, seat_number, id]
    );
    res.json({ message: 'Booking updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking' });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM bookings WHERE id = ?', [id]);
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking' });
  }
};
