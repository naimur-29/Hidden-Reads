import React, { useState, useEffect, useRef } from "react";
import { getDoc } from "firebase/firestore";
import { getStatsRef } from "../config/firebase";

import "./styles/Navbar.css";

// Components:
// import SearchBar from "./SearchBar";
import NavMenu from "./NavMenu";

const Navbar: React.FC = () => {
  // States:
  const [booksCount, setBooksCount] = useState(null);

  // HOOKS:
  const firstLoadRef = useRef(false);

  // get books Count:
  const getPreload = async () => {
    try {
      console.log("----GETTING BOOKS COUNT----");
      const statsRef = getStatsRef("stats");
      const statsSnapshot = await getDoc(statsRef);
      const statsRes = statsSnapshot.data();

      if (statsRes) {
        setBooksCount(statsRes.booksCount || 0);
      }
      console.log("----GOT BOOKS COUNT----");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (firstLoadRef.current === false) {
      getPreload();
      firstLoadRef.current = true;
    }
  }, []);

  return (
    <nav className="navbar-container">
      <section className="left-container">
        {booksCount !== null ? (
          <p className="books-count">
            {booksCount < 10 && booksCount > 0 ? `0${booksCount}` : booksCount}{" "}
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
