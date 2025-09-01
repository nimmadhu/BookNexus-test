import express from 'express';
import * as bookController from '../controllers/bookController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', bookController.getBooks);
router.get('/search', bookController.searchBooks);
router.get('/ai-search', bookController.searchBooksWithAI); // Specific route first
router.get('/:id/summary', bookController.getBookSummary); // Put routes with parameters after
router.get('/:id', bookController.getBookById); // Catch-all route should be last

// Protected admin routes with file upload
router.post('/', protect, admin, upload.single('coverImage'), bookController.createBook);
router.put('/:id', protect, admin, upload.single('coverImage'), bookController.updateBook);
router.delete('/:id', protect, admin, bookController.deleteBook);

// Checkout routes
router.put('/:id/checkout', protect, bookController.checkoutBook);
router.put('/:id/return', protect, bookController.returnBook);

export default router;