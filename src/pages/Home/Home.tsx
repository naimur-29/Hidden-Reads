import React from "react";

import "./Home.css";

// Components:

const Home: React.FC = () => {
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
            type="text"
            placeholder="Search for titles.."
          />
          <button className="search-btn">Search</button>
        </div>
      </div>
    </section>
  );
};

export default Home;
