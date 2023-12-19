import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./Genres.css";

// Components:
import GenreLink from "../../components/GenreLink";

// Data:
import { GenresList } from "./GenresList";

const Genres: React.FC = () => {
  // States:
  const [searchInput, setSearchInput] = useState("");

  return (
    <section className="genres-page-container">
      <div className="notice-container">
        <article className="notice">
          Please note that some novels may not be categorized. So, if you know
          the title, use the search from the{" "}
          <Link className="link" to="/">
            homepage
          </Link>
          !
        </article>
      </div>

      <div className="header-container">
        <h2 className="title">All Genres</h2>

        <input
          onChange={(e) => {
            e.preventDefault();
            setSearchInput(e.target.value.toLowerCase());
          }}
          type="text"
          className="search-bar"
          placeholder="Search in genres"
        />
      </div>

      <div
        className="genres-container"
        data-split={
          GenresList.filter((g) => g.name.toLowerCase().includes(searchInput))
            .length > 16
        }
      >
        {GenresList.filter((g) =>
          g.name.toLowerCase().startsWith(searchInput)
        ).map((g) => (
          <GenreLink key={g.name.toLowerCase()} name={g.name} />
        ))}
      </div>
    </section>
  );
};

export default Genres;
