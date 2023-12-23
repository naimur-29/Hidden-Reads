import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../config/firebase";
import {
  collection,
  query as fireStoreQuery,
  where,
  getDocs,
} from "firebase/firestore";

import "./styles/BookSearchResults.css";

// Components:
import BookSearchItem from "./BookSearchItem";

// TYPES:
type bookType = {
  id: string;
  title: string;
  author: string;
  cover_link: string;
  cover_shade: string;
  published: string;
  status: string;
  volumes: number;
  views: number;
  searchme: string[];
};

const BookSearchResults: React.FC = () => {
  // States:
  const [filteredBooks, setFilteredBooks] = useState<bookType[]>([]);
  const [isSearchResultLoading, setIsSearchResultLoading] = useState(false);

  // hooks:
  const { query } = useParams();

  // get search data:
  // process: filter by first word (back) then filter by the whole query(front):
  const getSearchData = async (query: string) => {
    setIsSearchResultLoading(true);
    // back (DB) filter:
    const queryArr = query.trim().split(" ");
    const q = fireStoreQuery(
      collection(db, "books"),
      where("searchme", "array-contains", queryArr[0])
    );

    try {
      console.log("book search data loading...");
      setFilteredBooks([]);
      const querySnapshot = await getDocs(q);
      const res: bookType[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        // front (Static) filter:
        let canInclude = true;
        queryArr.map((q) => {
          if (!data.searchme.includes(q)) {
            canInclude = false;
            return;
          }
        });

        if (canInclude) {
          res.push({
            id: doc.id || "",
            title: data.title || "",
            author: data.author || "",
            cover_link: data.cover_link || "",
            cover_shade: data.cover_shade || "",
            published: data.published || "",
            status: data.status || "",
            volumes: data.volumes || 0,
            views: data.views || 0,
            searchme: data.searchme || [],
          });
        }
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
    if (query) {
      const queryText = query.toLowerCase().slice(2);
      getSearchData(queryText);
    }
  }, [query]);

  return (
    <div className="books-list-container">
      <h3 className="main-title">{`Results (${filteredBooks.length})`}</h3>
      <div className="list-container">
        {filteredBooks.length ? (
          filteredBooks
            .sort((a, b) => b.views - a.views)
            .slice(0, 20)
            .map((b, index) => <BookSearchItem book={b} key={index} />)
        ) : (
          <p style={{ padding: "8px" }}>
            {isSearchResultLoading ? "Books Loading..." : "No Books Found!"}
          </p>
        )}
      </div>
    </div>
  );
};

export default BookSearchResults;
