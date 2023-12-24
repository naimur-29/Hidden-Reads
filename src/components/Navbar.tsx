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
  const getBooksCount = async () => {
    console.log("----GETTING BOOKS COUNT----");
    const statsRef = getStatsRef("stats");
    const snapshot = await getDoc(statsRef);
    const res = snapshot.data();

    if (res) {
      setBooksCount(res.booksCount || 0);
    }
    console.log("----GOT BOOKS COUNT----");
  };

  useEffect(() => {
    if (firstLoadRef.current === false) {
      getBooksCount();
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
