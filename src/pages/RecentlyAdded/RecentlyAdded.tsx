import React, { useState, useEffect } from "react";
import { db } from "../../config/firebase";
import {
  collection,
  query as fireStoreQuery,
  orderBy,
  getDocs,
  limit,
} from "firebase/firestore";

import "./RecentlyAdded.css";

// COMPONENTS:
import BookByCoverContainer from "../../components/BooksByCoverContainer";

// TYPES:
type bookType = {
  id: string;
  title: string;
  cover_link: string;
  cover_shade: string;
  views: number;
};

const RecentlyAdded: React.FC = () => {
  // States:
  const [filteredBooks, setFilteredBooks] = useState<bookType[]>([]);
  const [isSearchResultLoading, setIsSearchResultLoading] = useState(false);

  // get data:
  const getSearchData = async () => {
    setIsSearchResultLoading(true);
    const q = fireStoreQuery(
      collection(db, "books"),
      limit(20),
      orderBy("createdAt", "desc")
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
    getSearchData();
  }, []);

  return (
    <section className="most-popular-page-container">
      <div className="title-container">
        <h2 className="title">
          {isSearchResultLoading ? "Loading..." : "Recently Added"}
        </h2>
      </div>

      <BookByCoverContainer
        filteredBooks={filteredBooks}
        isLoading={isSearchResultLoading}
      />
    </section>
  );
};

export default RecentlyAdded;
