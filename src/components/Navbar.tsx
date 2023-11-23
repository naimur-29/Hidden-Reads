import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./styles/Navbar.css";

const Navbar: React.FC = () => {
  // States:
  const [isMenuActive, setIsMenuActive] = useState(false);

  return (
    <nav className="navbar-container">
      <section className="left-container">LEFT</section>
      <section className="right-container">
        <div className="menu-container">
          <button
            className="menu-icon"
            onClick={() => setIsMenuActive((prev) => !prev)}
          >
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </button>

          {isMenuActive ? (
            <ul className="menu-list">
              <li className="menu-item">
                <Link className="link" to="most-popular">
                  Most Popular
                </Link>
              </li>
              <li className="menu-item">
                <Link className="link" to="categories">
                  Categories
                </Link>
              </li>
              <li className="menu-item">
                <Link className="link" to="recently-added">
                  Recently Added
                </Link>
              </li>
              <li className="menu-item">
                <Link className="link" to="book-request">
                  Book Request
                </Link>
              </li>
            </ul>
          ) : (
            <></>
          )}
        </div>
      </section>
    </nav>
  );
};

export default Navbar;
