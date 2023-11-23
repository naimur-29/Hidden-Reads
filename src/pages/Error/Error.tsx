import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Error: React.FC = () => {
  // Hooks:
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutRef = setTimeout(() => {
      navigate("/");

      clearTimeout(timeoutRef);
    }, 3000);
  });

  return <h2>Error! Page not found!</h2>;
};

export default Error;
