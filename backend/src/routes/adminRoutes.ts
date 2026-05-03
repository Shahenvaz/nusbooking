import express from 'express';
import { 
  addBus, getBuses, addRoute, getAllRoutes, getAllBookings, updateBooking, deleteBooking
} from '../controllers/adminController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeAdmin);

// Bus routes
router.post('/buses', addBus);
router.get('/buses', getBuses);

// Route routes
router.post('/routes', addRoute);
router.get('/routes', getAllRoutes);

// Booking routes
router.get('/bookings', getAllBookings);
router.put('/bookings/:id', updateBooking);
router.delete('/bookings/:id', deleteBooking);

export default router;
