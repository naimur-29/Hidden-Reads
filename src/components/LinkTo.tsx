import React from "react";
import { Link } from "react-router-dom";

import "./styles/GenreLink.css";

// Types:
type propTypes = {
  context: string;
  link: string;
};

const LinkTo: React.FC<propTypes> = ({ context, link }) => {
  return (
    <div className="genre-link-container link-to">
      <Link to={`/control/manage/${link}`} className="link">
        {context}
      </Link>
    </div>
  );
};

export default LinkTo;
