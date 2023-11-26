import React from "react";
import { useParams } from "react-router-dom";

const AuthorOverview: React.FC = () => {
  const { info } = useParams();

  return <h2>{info} Books</h2>;
};

export default AuthorOverview;
