import React from "react";

import "./styles/Navbar.css";

// Components:
// import SearchBar from "./SearchBar";
import NavMenu from "./NavMenu";

const Navbar: React.FC = () => {
  // States:

  return (
    <nav className="navbar-container">
      <section className="left-container">
        <p className="books-count">100,23,232 Books</p>
      </section>
      <section className="right-container">
        {/* <SearchBar /> */}
        <NavMenu />
      </section>
    </nav>
  );
};

export default Navbar;
