import React from "react";
// import { Link } from "react-router-dom";

import "./Home.css";

// Components:
import Navbar from "../../components/Navbar";

const Home: React.FC = () => {
  return (
    <section className="home-page">
      <Navbar />
    </section>
  );
};

export default Home;
