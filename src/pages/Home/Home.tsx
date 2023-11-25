import React, { useState } from "react";

import "./Home.css";

// Components:
import BookSearchResults from "../../components/BookSearchResults";

const Home: React.FC = () => {
  // states:
  const [searchInput, setSearchInput] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

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
              setHasSearched(false);
            }}
            type="text"
            placeholder="Search for full titles, authors.."
          />
          <button className="search-btn" onClick={() => setHasSearched(true)}>
            Search
          </button>
        </div>
      </div>

      {hasSearched && searchInput ? (
        <BookSearchResults searchedContext={searchInput} />
      ) : (
        <></>
      )}
    </section>
  );
};

export default Home;
