import express from 'express';
import { 
  searchRoutes, getRouteDetails, createBooking, getMyBookings 
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/routes/search', searchRoutes);
router.get('/routes/:id', getRouteDetails);

// Protected routes (optional authentication for booking)
router.post('/bookings', (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        authenticateToken(req as any, res, next);
    } else {
        next();
    }
}, createBooking);

router.get('/bookings/my-bookings', authenticateToken, getMyBookings);

export default router;
