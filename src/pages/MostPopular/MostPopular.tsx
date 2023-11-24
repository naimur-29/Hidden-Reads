import React from "react";
import { Link } from "react-router-dom";

import "./MostPopular.css";

// data:
import { bookCoverList } from "./bookCoverList";

const MostPopular: React.FC = () => {
  return (
    <section className="most-popular-page-container">
      <div className="title-container">
        <h2 className="title">Most Popular</h2>
      </div>

      <div className="books-container">
        {bookCoverList.map((b) => (
          <Link className="cover-container" to={`/overview/${b.name}_${b.id}`}>
            <img className="cover" src={b.cover} alt={b.name} />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default MostPopular;
