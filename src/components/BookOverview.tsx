import React from "react";
import { useParams, Link } from "react-router-dom";

// Data:
const book = {
  id: "<id>",
  genres: "Isekai, Fantasy, Slice of Life",
  name: "Searching for Ashoka: Questing for a Buddhist King from India to Thailand",
  translator: "SUNY Press",
  author: "Nayanjot Lahiri",
  cover:
    "https://cdnagesdb.com/images/booksimages/554D573E6317587D4EB898050F9E2BAC.webp",
  startedPublishing: "2023",
  status: "Ongoing",
  volumes: "03",
  views: 104,
};

const commentsCount = 12;

const BookOverview: React.FC = () => {
  const { info } = useParams();

  return (
    <div className="book-overview-container">
      <div className="cover-container">
        <img src={book.cover} alt={book.name} className="cover" />
      </div>

      <h3>{book.name}</h3>
      <Link to={`/authors/${book.author}`}>{book.author}</Link>
      <div className="stats">
        <p className="views">{book.views}</p>
        <a href="#comments-container" className="comments">
          {commentsCount} Comments
        </a>
      </div>

      <div className="description">
        <div className="categories">
          <span>Categories: </span>
          {book.genres.split(",").map((g) => (
            <Link to={`/genres/${g.toLowerCase()}`}>{g}</Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookOverview;
