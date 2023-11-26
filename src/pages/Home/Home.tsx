import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import "./Home.css";

// Components:
import BookSearchResults from "../../components/BookSearchResults";

// Types:
type propType = {
  hasQuery?: boolean;
};

const Home: React.FC<propType> = ({ hasQuery = false }) => {
  // States:
  const [searchInput, setSearchInput] = useState("");

  // Hooks:
  const { query } = useParams();

  useEffect(() => {
    if (hasQuery && query) {
      setSearchInput(query);
    }
  }, [query, hasQuery]);

  return (
    <section className="home-page-container">
      <div className="header-container">
        <div className="title-container">
          <h1 className="title">HIDDEN READS</h1>
          <article className="headline">
            A Curated Collection of Captivating Light Novels / Web Novels
          </article>
        </div>

        <div className="search-container">
          <input
            className="search-field"
            onChange={(e) => {
              e.preventDefault();
              setSearchInput(e.target.value.toLowerCase());
            }}
            type="text"
            value={searchInput}
            placeholder="Search for full titles, authors.."
          />
          <Link to={`/${searchInput}`} className="search-btn">
            Search
          </Link>
        </div>
      </div>

      {hasQuery ? <BookSearchResults /> : <></>}
    </section>
  );
};

export default Home;
