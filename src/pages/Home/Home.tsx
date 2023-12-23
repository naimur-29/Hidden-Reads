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
    setSearchInput("");
  }, []);

  useEffect(() => {
    if (hasQuery && query?.startsWith("q=")) {
      let searchString = query;
      searchString = searchString.slice(2);
      setSearchInput(searchString);
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
            value={searchInput}
            onChange={(e) => {
              e.preventDefault();
              setSearchInput(e.target.value);
            }}
            type="text"
            placeholder="titles, authors, status, year.."
          />
          <Link to={`/q=${searchInput}`} className="search-btn">
            Search
          </Link>
        </div>
      </div>

      <BookSearchResults />
    </section>
  );
};

export default Home;
