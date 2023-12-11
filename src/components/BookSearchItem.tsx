import React from "react";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

import "./styles/BookSearchItem.css";

// TYPES:
type bookType = {
  id: string;
  title: string;
  author: string;
  cover_link: string;
  published: string;
  status: string;
  volumes: string;
  views: number;
};

type propTypes = {
  book: bookType;
};

const BookSearchItem: React.FC<propTypes> = ({ book }) => {
  return (
    <div className="book-container">
      <div className="left">
        <img className="cover" src={book.cover_link} alt={book.title} />
      </div>
      <div className="right">
        <div className="title-container">
          <Link
            to={`/overview/${book.title.slice(0, 10).toLowerCase()}_${book.id}`}
            className="title"
          >
            {book.title}
          </Link>
          {/* <p className="translator">{book.translator}</p> */}
          {/* <Link to={`/authors/${book.author}`} className="author">
            {book.author}
          </Link> */}

          <div className="author">{book.author}</div>
        </div>

        <div className="info-container">
          <div className="info">
            {`Published: `}
            <span>{book.published}</span>
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
    </div>
  );
};

export default BookSearchItem;
