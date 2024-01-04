import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import "./Genres.css";

// Components:
import GenreLink from "../../components/GenreLink";
import LoadingAnimation from "../../components/LoadingAnimation";
import { capitalizeEachWord } from "../../utility/commonFunctions";

// TYPES:
interface propType {
  genres: string[];
  isBookGenresLoading: boolean;
}

const Genres: React.FC<propType> = ({ genres, isBookGenresLoading }) => {
  // States:
  const [searchInput, setSearchInput] = useState("");
  const [pageLoading, setPageLoading] = useState(true);

  // HOOKS:
  const pageLoadingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // handle page loading animation:
    if (pageLoadingTimeoutRef.current !== null) {
      window.clearTimeout(pageLoadingTimeoutRef.current);
    }
    pageLoadingTimeoutRef.current = window.setTimeout(() => {
      setPageLoading(false);
    }, 1000);
  }, []);

  // Display Loading Animation:
  if (pageLoading || isBookGenresLoading) {
    return <LoadingAnimation />;
  }

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
          genres?.filter((g) => g.toLowerCase().includes(searchInput)).length >
          16
        }
      >
        {genres
          ?.sort((a, b) => {
            if (a > b) return 1;
            else if (a < b) return -1;
            return 0;
          })
          .filter((g) => g.toLowerCase().startsWith(searchInput))
          .map((g) => (
            <GenreLink key={g.toLowerCase()} name={capitalizeEachWord(g)} />
          ))}
      </div>
    </section>
  );
};

export default Genres;
