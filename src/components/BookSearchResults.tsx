import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import "./styles/BookSearchResults.css";

// Components:
import BookSearchItem from "./BookSearchItem";

// Data:
import { books, bookType } from "../pages/Home/books";

const BookSearchResults: React.FC = () => {
  // States:
  const [filteredBooks, setFilteredBooks] = useState<bookType[]>([]);

  // hooks:
  const { query } = useParams();

  useEffect(() => {
    if (query) {
      setFilteredBooks(
        books.filter(
          (b, index) =>
            index < 20 &&
            (b.name.toLowerCase().includes(query) ||
              b.author.toLowerCase().includes(query))
        )
      );
    }
  }, [query]);

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
