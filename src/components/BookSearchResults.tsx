import React, { useState, useEffect } from "react";

import "./styles/BookSearchResults.css";

// Components:
import BookSearchItem from "./BookSearchItem";

// Data:
import { books, bookType } from "../pages/Home/books";

// Types:
type propTypes = {
  searchedContext: string;
};

const BookSearchResults: React.FC<propTypes> = ({ searchedContext }) => {
  // States:
  const [filteredBooks, setFilteredBooks] = useState<bookType[]>([]);

  useEffect(() => {
    setFilteredBooks(
      books.filter(
        (b, index) =>
          index < 20 &&
          (b.name.toLowerCase().includes(searchedContext) ||
            b.author.toLowerCase().includes(searchedContext))
      )
    );
  }, []);

  return (
    <div className="books-list-container">
      <h3 className="main-title">{`Results (${filteredBooks.length})`}</h3>
      <div className="list-container">
        {filteredBooks.length ? (
          filteredBooks.map((b, index) => (
            <BookSearchItem book={b} key={index} />
          ))
        ) : (
          <p style={{ padding: "8px" }}>No Books Found!</p>
        )}
      </div>
    </div>
  );
};

export default BookSearchResults;
