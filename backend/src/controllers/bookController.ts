import type { Request, Response } from 'express';
import { Op } from 'sequelize';
import Book from '../models/Book.js';
import { generateBookSummary, getBookRecommendations } from '../services/geminiService.js';
import fs from 'fs';
import path from 'path';

// Ensure the uploads directory exists
const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'covers');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// @desc    Get all books
// @route   GET /api/books
// @access  Public
export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a single book
// @route   GET /api/books/:id
// @access  Public
export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await Book.findByPk(req.params.id);
    
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Search books by various criteria
// @route   GET /api/books/search
// @access  Public
export const searchBooks = async (req: Request, res: Response) => {
  try {
    const { query, subject, researchArea } = req.query;
    
    const searchConditions: any = {};
    
    if (query) {
      searchConditions[Op.or] = [
        { title: { [Op.iLike]: `%${query}%` } },
        { author: { [Op.iLike]: `%${query}%` } },
        { isbn: { [Op.iLike]: `%${query}%` } }
      ];
    }
    
    if (subject) {
      searchConditions.subject = { [Op.iLike]: `%${subject}%` };
    }
    
    if (researchArea) {
      searchConditions.researchArea = { [Op.iLike]: `%${researchArea}%` };
    }
    
    const books = await Book.findAll({
      where: searchConditions
    });
    
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a book with image upload
// @route   POST /api/books
// @access  Private/Admin
export const createBook = async (req: Request, res: Response) => {
  try {
    const {
      title,
      author,
      isbn,
      imageUrl,
      subject,
      researchArea,
      location,
      totalCopies,
      availableCopies,
      description
    } = req.body;
    
    // Handle file upload
    let bookImageUrl = imageUrl || '';
    if (req.file) {
      // Generate a relative path to the uploaded file
      bookImageUrl = `/uploads/covers/${req.file.filename}`;
    }
    
    const book = await Book.create({
      title,
      author,
      isbn,
      imageUrl: bookImageUrl,
      subject,
      researchArea,
      location,
      totalCopies: parseInt(totalCopies),
      availableCopies: parseInt(availableCopies),
      description
    });
    
    res.status(201).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a book with image upload
// @route   PUT /api/books/:id
// @access  Private/Admin
export const updateBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findByPk(req.params.id);
    
    if (book) {
      const {
        title,
        author,
        isbn,
        imageUrl,
        subject,
        researchArea,
        location,
        totalCopies,
        availableCopies,
        description
      } = req.body;
      
      // Handle file upload
      let bookImageUrl = imageUrl || book.imageUrl;
      if (req.file) {
        // If there's an existing image stored on the server, delete it
        if (book.imageUrl && book.imageUrl.startsWith('/uploads/covers/')) {
          const oldImagePath = path.join(process.cwd(), 'public', book.imageUrl);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        
        // Generate a relative path to the new uploaded file
        bookImageUrl = `/uploads/covers/${req.file.filename}`;
      }
      
      await book.update({
        title: title || book.title,
        author: author || book.author,
        isbn: isbn || book.isbn,
        imageUrl: bookImageUrl,
        subject: subject || book.subject,
        researchArea: researchArea || book.researchArea,
        location: location || book.location,
        totalCopies: totalCopies ? parseInt(totalCopies) : book.totalCopies,
        availableCopies: availableCopies ? parseInt(availableCopies) : book.availableCopies,
        description: description || book.description
      });
      
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findByPk(req.params.id);
    
    if (book) {
      // Remove the image file if it exists
      if (book.imageUrl && book.imageUrl.startsWith('/uploads/covers/')) {
        const imagePath = path.join(process.cwd(), 'public', book.imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      await book.destroy();
      res.json({ message: 'Book removed' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Check out a book
// @route   PUT /api/books/:id/checkout
// @access  Private/Admin
export const checkoutBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findByPk(req.params.id);
    
    if (book) {
      if (book.availableCopies > 0) {
        await book.update({
          availableCopies: book.availableCopies - 1
        });
        
        res.json({ message: 'Book checked out successfully', book });
      } else {
        res.status(400).json({ message: 'Book is not available' });
      }
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Return a book
// @route   PUT /api/books/:id/return
// @access  Private/Admin
export const returnBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findByPk(req.params.id);
    
    if (book) {
      if (book.availableCopies < book.totalCopies) {
        await book.update({
          availableCopies: book.availableCopies + 1
        });
        
        res.json({ message: 'Book returned successfully', book });
      } else {
        res.status(400).json({ message: 'All copies are already available' });
      }
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get book summary from Gemini
// @route   GET /api/books/:id/summary
// @access  Public
export const getBookSummary = async (req: Request, res: Response) => {
  try {
    const book = await Book.findByPk(req.params.id);
    
    if (book) {
      const summary = await generateBookSummary(book.title, book.author, book.description || '');
      res.json({ summary });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Search books with AI recommendations
// @route   GET /api/books/ai-search
// @access  Public
export const searchBooksWithAI = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Get all books from the database
    const allBooks = await Book.findAll();
    
    if (!allBooks || allBooks.length === 0) {
      return res.status(404).json({ message: 'No books found in the database' });
    }

    // Get AI-powered recommendations
    const recommendedBooks = await getBookRecommendations(query, allBooks);
    
    res.json({
      count: recommendedBooks.length,
      books: recommendedBooks
    });
  } catch (error) {
    console.error('Error searching books with AI:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};