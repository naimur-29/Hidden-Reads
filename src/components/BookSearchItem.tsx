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
  volumes: number;
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
            <span>
              {book.volumes < 10 && book.volumes > 0
                ? `0${book.volumes}`
                : book.volumes > 999
                ? `${(book.volumes / 1000).toFixed(2)}k`
                : book.volumes}
            </span>
          </div>
          <div className="info views">
            <Eye className="icon" size={20} />
            <span>
              {book.views < 10 && book.views > 0
                ? `0${book.views}`
                : book.views > 999
                ? `${(book.views / 1000).toFixed(2)}k`
                : book.views}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSearchItem;
