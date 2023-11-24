import React from "react";
import { Link } from "react-router-dom";

// Types:
type propTypes = {
  name: string;
  bookCount: number;
};

const GenreLink: React.FC<propTypes> = ({ name, bookCount }) => {
  return (
    <div className="genre-link-container">
      <Link to={name.toLowerCase()}>{name}</Link>
      <span>{` (${bookCount})`}</span>
    </div>
  );
};

export default GenreLink;
