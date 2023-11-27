import React from "react";
import { useParams, Link } from "react-router-dom";
import { Eye } from "lucide-react";

import "./styles/BookOverview.css";

// Data:
const book = {
  id: "<id>",
  genres: "Isekai, Fantasy, Slice of Life",
  name: "Searching for Ashoka: Questing for a Buddhist King from India to Thailand",
  translators: "SUNY Press",
  authors: "Nayanjot Lahiri",
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
      <div className="inner-container">
        <div className="cover-container">
          <img src={book.cover} alt={book.name} className="cover" />
        </div>

        <div className="info-container">
          <h3 className="title">{book.name}</h3>
          <Link to={`/authors/${book.authors}`} className="authors">
            {book.authors}
          </Link>
          <div className="stats">
            <p className="views">
              <Eye />
              {book.views}
            </p>
            <a href="#comments-container" className="comments">
              {commentsCount} Comments
            </a>
          </div>

          <div className="description">
            <div className="left">
              <div className="status item">
                <span>Status:</span>
                <span>{book.status}</span>
              </div>

              <div className="translator item">
                <span>Translators:</span>
                <span>{book.translators}</span>
              </div>

              <div className="volumes item">
                <span>Volumes:</span>
                <span>{book.volumes}</span>
              </div>
            </div>

            <div className="right">
              <div className="year item">
                <span>Year:</span>
                <span>{book.startedPublishing}</span>
              </div>

              <div className="categories item">
                <span>Categories: </span>
                <span>
                  {book.genres.split(",").map((g) => (
                    <Link
                      key={g.toLowerCase()}
                      to={`/genres/${g.toLowerCase()}`}
                    >
                      {g}
                    </Link>
                  ))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookOverview;
