import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  query as fireStoreQuery,
  where,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";

import "./styles/BookSearchResults.css";

// Components:
import BookSearchItem from "./BookSearchItem";
import ErrorToast from "./ErrorToast";

// HOOKS:
import useGetDocs from "../hooks/useGetDocs";

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
  // HOOKS:
  const { query } = useParams();
  const [
    getSearchResults,
    searchResults,
    isSearchResultsLoading,
    searchResultsError,
    setSearchResultsError,
  ] = useGetDocs();

  // get search data:
  // process: filter by first word (back) then filter by the whole query(front):
  const handleSearchData = async (query: string) => {
    // back (DB) filter:
    const queryArr = query.trim().split(" ");
    const q = fireStoreQuery(
      collection(db, "books"),
      where("searchme", "array-contains", queryArr[0])
    );

    const filterSearchResults = (
      snapshot: QuerySnapshot<DocumentData, DocumentData>
    ) => {
      const res: bookType[] = [];
      snapshot.forEach((doc) => {
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

      return res as DocumentData[];
    };

    await getSearchResults(q, filterSearchResults);
  };

  useEffect(() => {
    if (query?.slice(2).length) {
      const queryText = query
        .trim()
        .toLowerCase()
        .slice(2)
        .replace(/[^a-z0-9\s]/g, "")
        .split(" ")
        .filter((e) => e !== "")
        .join(" ");
      handleSearchData(queryText);
    } else if (query && query?.trim() !== "") {
      setSearchResultsError("Invalid Query!");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="books-list-container">
      <h3 className="main-title">{`Results (${searchResults.length})`}</h3>

      {/* ERROR TOAST */}
      <ErrorToast
        message={searchResultsError}
        setMessage={setSearchResultsError}
      />

      <div className="list-container">
        {searchResults.length ? (
          searchResults
            .sort((a, b) => b.views - a.views)
            .slice(0, 100)
            .map((b, index) => (
              <BookSearchItem book={b as bookType} key={index} />
            ))
        ) : (
          <p style={{ padding: "8px" }}>
            {isSearchResultsLoading ? "Books Loading..." : "No Books Found!"}
          </p>
        )}
      </div>
    </div>
  );
};

export default BookSearchResults;
