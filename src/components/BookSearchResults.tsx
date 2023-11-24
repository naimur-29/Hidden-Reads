import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";

import "./styles/BookSearchResults.css";

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
            <a href="/" className="book-container" key={index}>
              <div className="left">
                <img className="cover" src={b.cover} alt={b.name} />
              </div>
              <div className="right">
                <div className="title-container">
                  <h3 className="name">{b.name}</h3>
                  <p className="translator">{b.translator}</p>
                  <p className="author">{b.author}</p>
                </div>

                <div className="info-container">
                  <div className="info">
                    {`Published: `}
                    <span>{b.startedPublishing}</span>
                  </div>
                  <div className="info">
                    {`Status: `}
                    <span>{b.status}</span>
                  </div>
                  <div className="info">
                    {`Volumes: `}
                    <span>{b.volumes}</span>
                  </div>
                  <div className="info views">
                    <Eye className="icon" size={20} />
                    <span>{b.views}</span>
                  </div>
                </div>
              </div>
            </a>
          ))
        ) : (
          <p>No Books Found!</p>
        )}
      </div>
    </div>
  );
};

export default BookSearchResults;
