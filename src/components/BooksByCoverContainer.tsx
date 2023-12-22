import React from "react";

import "./styles/BooksByCoverContainer.css";

// components:
import BookByCover from "./BooksByCover";
import SkeletonBookByCover from "./SkeletonBookByCover";

// Types:
export type bookType = {
  id: string;
  title: string;
  cover_link: string;
  cover_shade: string;
  views: number;
};

type propType = {
  filteredBooks: bookType[];
  isLoading: boolean;
};

const BooksByCoverContainer: React.FC<propType> = ({
  filteredBooks,
  isLoading,
}) => {
  if (isLoading)
    return (
      <div className="books-container">
        {new Array(8).fill(0).map((_, index) => (
          <SkeletonBookByCover key={index} />
        ))}
      </div>
    );

  return (
    <div className="books-container">
      {!filteredBooks.length ? (
        <h2>No Books!</h2>
      ) : (
        filteredBooks.map((book) => <BookByCover key={book.id} book={book} />)
      )}
    </div>
  );
};

export default BooksByCoverContainer;
