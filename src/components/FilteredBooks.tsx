import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../config/firebase";
import {
  collection,
  query as fireStoreQuery,
  where,
  getDocs,
  limit,
  orderBy,
} from "firebase/firestore";
import { abbreviateNumberForStats } from "../misc/commonFunctions";

import "./styles/FilteredBooks.css";

// Components:
import BookByCoverContainer from "./BooksByCoverContainer";

// TYPES:
type bookType = {
  id: string;
  title: string;
  cover_link: string;
  cover_shade: string;
  views: number;
};

const FilteredBooks: React.FC = () => {
  // States:
  const [filteredBooks, setFilteredBooks] = useState<bookType[]>([]);
  const [isSearchResultLoading, setIsSearchResultLoading] = useState(true);

  // hooks:
  const { genre } = useParams();

  // get search data:
  const getSearchData = async (query: string) => {
    const q = fireStoreQuery(
      collection(db, "books"),
      limit(20),
      orderBy("views", "desc"),
      where("searchme", "array-contains", query)
    );

    try {
      console.log("book search data loading...");
      setFilteredBooks([]);
      const querySnapshot = await getDocs(q);
      const res: bookType[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        res.push({
          id: doc.id || "",
          title: data.title || "",
          cover_link: data.cover_link || "",
          cover_shade: data.cover_shade || "",
          views: data.views || 0,
        });
      });
      if (res.length) {
        setFilteredBooks(res);
      }
      console.log("book search data loaded!");
    } catch (error) {
      console.log(error);
    }
    setIsSearchResultLoading(false);
  };

  useEffect(() => {
    if (genre) {
      const queryText = genre.toLowerCase();
      getSearchData(queryText);
    }
  }, [genre]);

  return (
    <section className="most-popular-page-container">
      <div className="title-container">
        <h2 className="title">
          {isSearchResultLoading
            ? "Loading..."
            : `${genre} (${abbreviateNumberForStats(filteredBooks.length)})`}
        </h2>
      </div>

      <BookByCoverContainer
        filteredBooks={filteredBooks}
        isLoading={isSearchResultLoading}
      />
    </section>
  );
};

export default FilteredBooks;
