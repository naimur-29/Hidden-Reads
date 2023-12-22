import React from "react";
import { Link } from "react-router-dom";
import { abbreviateNumberForStats } from "../misc/commonFunctions";

// icons:
import { Eye } from "lucide-react";

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
    >
      <img className="cover" src={book.cover_link} alt={book.title} />
      <div
        className="overlay1"
        style={{
          background: `linear-gradient(to bottom, ${book?.cover_shade}00 10%, ${book?.cover_shade} 80%)`,
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
          background: `linear-gradient(to bottom, ${book?.cover_shade}00 10%, ${book?.cover_shade} 80%)`,
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
