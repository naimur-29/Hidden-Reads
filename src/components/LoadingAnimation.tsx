import React from "react";

import "./styles/LoadingAnimation.css";

const LoadingAnimation: React.FC = () => {
  return (
    <div className="loading-animation-container">
      <ul className="list1">
        <li>R</li>
        <li>E</li>
        <li>A</li>
        <li>D</li>
        <li>S</li>
      </ul>

      <ul className="list2">
        <li>H</li>
        <li>I</li>
        <li>D</li>
        <li>D</li>
        <li>E</li>
        <li>N</li>
      </ul>
    </div>
  );
};

export default LoadingAnimation;
