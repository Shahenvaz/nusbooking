import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
export declare const searchRoutes: (req: Request, res: Response) => Promise<void>;
export declare const getRouteDetails: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createBooking: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMyBookings: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=userController.d.ts.map