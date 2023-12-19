import React from "react";
import { Link } from "react-router-dom";

import "./styles/GenreLink.css";

// Types:
type propTypes = {
  name: string;
};

const GenreLink: React.FC<propTypes> = ({ name }) => {
  return (
    <div className="genre-link-container">
      <Link to={name} className="link">
        {name}
      </Link>
    </div>
  );
};

export default GenreLink;
