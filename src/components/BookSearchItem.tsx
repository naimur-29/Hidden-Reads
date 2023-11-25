import React from "react";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

import "./styles/BookSearchItem.css";

// Types:
import { bookType } from "../pages/Home/books";

type propTypes = {
  book: bookType;
};

const BookSearchItem: React.FC<propTypes> = ({ book }) => {
  return (
    <Link to={`/overview/${book.name}_${book.id}`} className="book-container">
      <div className="left">
        <img className="cover" src={book.cover} alt={book.name} />
      </div>
      <div className="right">
        <div className="title-container">
          <h3 className="name">{book.name}</h3>
          <p className="translator">{book.translator}</p>
          <p className="author">{book.author}</p>
        </div>

        <div className="info-container">
          <div className="info">
            {`Published: `}
            <span>{book.startedPublishing}</span>
          </div>
          <div className="info">
            {`Status: `}
            <span>{book.status}</span>
          </div>
          <div className="info">
            {`Volumes: `}
            <span>{book.volumes}</span>
          </div>
          <div className="info views">
            <Eye className="icon" size={20} />
            <span>{book.views}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookSearchItem;
