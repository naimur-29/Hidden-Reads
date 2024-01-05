import React, { useState } from "react";

import "./styles/NavMenu.css";

// Components:
import ToggleModal from "./ToggleModal";
import MenuItem from "./MenuItem";

const NavMenu: React.FC = () => {
  // States:
  const [isMenuActive, setIsMenuActive] = useState(false);

  return (
    <ToggleModal
      containerClass="menu-container"
      isModalActive={isMenuActive}
      toggler={
        <button
          className="menu-icon"
          onClick={() => setIsMenuActive((prev) => !prev)}
        >
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </button>
      }
    >
      <ul className="menu-list">
        <MenuItem setMenuState={setIsMenuActive} linkTo="/" context="Home" />

        <MenuItem
          setMenuState={setIsMenuActive}
          linkTo="/genres"
          context="Genres"
        />

        <MenuItem
          setMenuState={setIsMenuActive}
          linkTo="/most-popular"
          context="Most Popular"
        />

        <MenuItem
          setMenuState={setIsMenuActive}
          linkTo="/recently-added"
          context="Recently Added"
        />
      </ul>
    </ToggleModal>
  );
};

export default NavMenu;
