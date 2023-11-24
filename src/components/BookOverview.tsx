import React from "react";
import { useParams } from "react-router-dom";

const BookOverview: React.FC = () => {
  const { info } = useParams();

  return <h2>{info}</h2>;
};

export default BookOverview;
