import React, { ReactNode } from "react";

// Components:
import Navbar from "../components/Navbar";

// Types:
type ComponentPropTypes = {
  children: ReactNode;
};

const BuildPage: React.FC<ComponentPropTypes> = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="container" style={{ marginTop: "50px" }}>
        {children}
      </div>
    </>
  );
};

export default BuildPage;
