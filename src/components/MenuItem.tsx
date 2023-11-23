import React from "react";
import { Link } from "react-router-dom";

// Types:
type MenuItemTypes = {
  setMenuState: React.Dispatch<React.SetStateAction<boolean>>;
  linkTo: string;
  context: string;
};

const MenuItem: React.FC<MenuItemTypes> = ({
  setMenuState,
  linkTo,
  context,
}) => {
  return (
    <li className="menu-item" onClick={() => setMenuState((prev) => !prev)}>
      <Link className="link" to={linkTo}>
        {context}
      </Link>
    </li>
  );
};

export default MenuItem;
