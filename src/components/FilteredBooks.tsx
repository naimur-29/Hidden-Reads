import React from "react";
import { useParams } from "react-router-dom";

const FilteredBooks: React.FC = () => {
  const { genre } = useParams();

  return <h2>{genre} Books</h2>;
};

export default FilteredBooks;
