import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

import "./styles/SearchBar.css";

// Components:
import ToggleModal from "./ToggleModal";

const SearchBar: React.FC = () => {
  // States:
  const [isSearchBarActive, setIsSearchBarActive] = useState(false);

  // Refs:
  const searchFieldRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isSearchBarActive && searchFieldRef.current)
      searchFieldRef.current.focus();
  }, [isSearchBarActive]);

  return (
    <ToggleModal
      containerClass="search-bar-container"
      isModalActive={isSearchBarActive}
      toggler={
        <div
          className="search-icon"
          onClick={() => setIsSearchBarActive((prev) => !prev)}
        >
          <Search />
        </div>
      }
    >
      <div className="search-bar">
        <input
          ref={searchFieldRef}
          className="search-field"
          type="text"
          placeholder="Search for title.."
        />
      </div>
    </ToggleModal>
  );
};

export default SearchBar;
