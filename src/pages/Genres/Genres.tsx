import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getDoc } from "firebase/firestore";
import { getStatsRef } from "../../config/firebase";

import "./Genres.css";

// Components:
import GenreLink from "../../components/GenreLink";
import LoadingAnimation from "../../components/LoadingAnimation";
import { capitalizeEachWord } from "../../misc/commonFunctions";

const Genres: React.FC = () => {
  // States:
  const [searchInput, setSearchInput] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [genres, setGenres] = useState<string[]>([]);

  // HOOKS:
  const firstLoadRef = useRef(false);
  const pageLoadingTimeoutRef = useRef<number | null>(null);

  // get books Count:
  const getPreload = async () => {
    try {
      console.log("----GETTING BOOKS GENRES----");
      const genresRef = getStatsRef("genres");
      const genresSnapshot = await getDoc(genresRef);
      const genresRes = genresSnapshot.data();

      if (genresRes) {
        setGenres(genresRes.genres || []);
      }
      console.log("----GOT BOOKS GENRES----");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("loading...");
    if (firstLoadRef.current === false) {
      getPreload();
      firstLoadRef.current = true;
    }

    // handle page loading animation:
    if (pageLoadingTimeoutRef.current !== null) {
      window.clearTimeout(pageLoadingTimeoutRef.current);
    }
    pageLoadingTimeoutRef.current = window.setTimeout(() => {
      setPageLoading(false);
    }, 1000);
  }, []);

  // Display Loading Animation:
  if (pageLoading) {
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
          genres.filter((g) => g.toLowerCase().includes(searchInput)).length >
          16
        }
      >
        {genres
          .sort((a, b) => {
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
