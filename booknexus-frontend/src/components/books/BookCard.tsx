import React from 'react';
import { Link } from 'react-router-dom';
import type { Book } from '../../types/books';
import { BookCover } from '../../utils/imageUtils';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <Link to={`/books/${book.id}`} className="block group">
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md transition-all duration-300 h-full flex flex-col 
                      group-hover:shadow-xl group-hover:translate-y-[-4px] dark:border dark:border-gray-700 dark:group-hover:border-blue-500">
        <div className="h-48 overflow-hidden bg-gray-100 dark:bg-gray-700 relative">
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
            <span className="text-white text-sm font-medium mb-4 px-3 py-1.5 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              View Details
            </span>
          </div>
          
          {/* Image with zoom effect */}
          <div className="w-full h-full transform transition-transform duration-500 group-hover:scale-110">
            <BookCover
              src={book.imageUrl}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="p-5 flex-grow flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1.5 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{book.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 italic">by {book.author}</p>
          
          <div className="mt-auto pt-2 flex justify-between items-center">
            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full transition-colors duration-300 ${
              book.availableCopies > 0 
                ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 group-hover:bg-green-200 dark:group-hover:bg-green-800' 
                : 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 group-hover:bg-red-200 dark:group-hover:bg-red-800'
            }`}>
              <span className={`w-2 h-2 rounded-full mr-1.5 ${
                book.availableCopies > 0 ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              {book.availableCopies > 0 ? 'Available' : 'Unavailable'}
            </span>
            
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {book.subject}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;