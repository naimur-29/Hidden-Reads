import React from "react";
import { Link } from "react-router-dom";
import { abbreviateNumberForStats } from "../utility/commonFunctions";

// icons:
import { Eye } from "lucide-react";

// assets:
import BookLoadingGif from "../assets/bookLoading.gif";

// TYPES:
import { bookType } from "./BooksByCoverContainer";
type propType = {
  book: bookType;
};

const BookByCover: React.FC<propType> = ({ book }) => {
  return (
    <Link
      to={`/overview/${book.title.slice(0, 10).toLowerCase()}_${book.id}`}
      className="cover-container"
      style={{
        backgroundImage: `linear-gradient(0deg, ${book.cover_shade}99, ${book.cover_shade}00, ${book.cover_shade}99)`,
      }}
    >
      {book?.cover_link?.includes("http") ? (
        <img
          className="cover"
          src={book.cover_link}
          loading="lazy"
          alt={book.title}
        />
      ) : (
        <img
          className="cover"
          src={BookLoadingGif}
          loading="lazy"
          alt={book.title}
        />
      )}
      <div
        className="overlay1"
        style={{
          background: book?.cover_link?.includes("http")
            ? `linear-gradient(to bottom, ${book?.cover_shade}00 10%, ${book?.cover_shade} 80%)`
            : "",
        }}
      >
        <h3 className="content">
          {abbreviateNumberForStats(book.views)}
          <Eye />
        </h3>
      </div>

      <div
        className="overlay2"
        style={{
          background: book?.cover_link?.includes("http")
            ? `linear-gradient(to bottom, ${book?.cover_shade}00 10%, ${book?.cover_shade} 80%)`
            : "",
        }}
      >
        <h3 className="content">
          {book.title.length > 50
            ? book.title.slice(0, 50).trim() + "..."
            : book.title}
        </h3>
      </div>
    </Link>
  );
};

export default BookByCover;
