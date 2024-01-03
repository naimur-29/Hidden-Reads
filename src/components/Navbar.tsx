import React, { useEffect, useRef } from "react";

import "./styles/Navbar.css";

// Components:
import NavMenu from "./NavMenu";

// HOOKS:
import useGetDoc from "../hooks/useGetDoc";

const Navbar: React.FC = () => {
  // HOOKS:
  const firstLoadRef = useRef(false);
  const [getBookStats, bookStats, isBookStatsLoading] = useGetDoc();

  useEffect(() => {
    if (firstLoadRef.current === false) {
      console.log("----GETTING BOOKS COUNT----");
      getBookStats("stats", "stats");
      firstLoadRef.current = true;
      console.log("----GOT BOOKS COUNT----");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav className="navbar-container">
      <section className="left-container">
        {isBookStatsLoading ? (
          <p className="books-count">loading...</p>
        ) : bookStats?.booksCount !== null ? (
          <p className="books-count">
            {bookStats?.booksCount < 10 && bookStats?.booksCount > 0
              ? `0${bookStats?.booksCount}`
              : bookStats?.booksCount}{" "}
            books
          </p>
        ) : (
          <></>
        )}
      </section>
      <section className="right-container">
        {/* <SearchBar /> */}
        <NavMenu />
      </section>
    </nav>
  );
};

export default Navbar;
