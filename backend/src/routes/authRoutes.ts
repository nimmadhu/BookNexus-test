import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  getAllUsers,
  deleteLibrarian
} from '../controllers/authController.js';
import { admin, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.get('/users', protect, getAllUsers);
router.delete('/librarians/:id', protect, admin, deleteLibrarian);

export default router;