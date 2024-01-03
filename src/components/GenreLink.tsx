import React from "react";
import { Link } from "react-router-dom";

import "./styles/GenreLink.css";

// Types:
type propTypes = {
  name: string | null;
};

const GenreLink: React.FC<propTypes> = ({ name }) => {
  if (name !== null)
    return (
      <div className="genre-link-container">
        <Link to={`/genres/${name}`} className="link">
          {name}
        </Link>
      </div>
    );
};

export default GenreLink;
