import express from 'express';
import { searchRoutes, getRouteDetails, createBooking, getMyBookings } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
const router = express.Router();
// Public routes
router.get('/routes/search', searchRoutes);
router.get('/routes/:id', getRouteDetails);
// Protected routes
router.post('/bookings', authenticateToken, createBooking);
router.get('/bookings/my-bookings', authenticateToken, getMyBookings);
export default router;
//# sourceMappingURL=userRoutes.js.map