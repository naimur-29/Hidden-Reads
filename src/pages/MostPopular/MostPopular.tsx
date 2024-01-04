import React, { useEffect, useRef } from "react";
import {
  collection,
  query as fireStoreQuery,
  orderBy,
  limit,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "../../config/firebase";

import "./MostPopular.css";

// COMPONENTS:
import BookByCoverContainer from "../../components/BooksByCoverContainer";
import useGetDocs from "../../hooks/useGetDocs";

// TYPES:
type bookType = {
  id: string;
  title: string;
  cover_link: string;
  cover_shade: string;
  views: number;
};

const MostPopular: React.FC = () => {
  // HOOKS:
  const firstLoadRef = useRef(false);
  const [getMostPopularBooks, mostPopularBooks, isMostPopularBooksLoading] =
    useGetDocs();

  // get data:
  const handleGetMostPopularBooks = async () => {
    const q = fireStoreQuery(
      collection(db, "books"),
      limit(20),
      orderBy("views", "desc")
    );

    const filterBooks = (
      snapshot: QuerySnapshot<DocumentData, DocumentData>
    ) => {
      const res: bookType[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        res.push({
          id: doc.id || "",
          title: data.title || "",
          cover_link: data.cover_link || "",
          cover_shade: data.cover_shade || "",
          views: data.views || 0,
        });
      });

      return res as DocumentData[];
    };

    await getMostPopularBooks(q, filterBooks);
  };

  useEffect(() => {
    if (firstLoadRef.current === false) {
      console.log("running...");
      handleGetMostPopularBooks();
      window.scrollTo(0, 0);
      firstLoadRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="most-popular-page-container">
      <div className="title-container">
        <h2 className="title">
          {isMostPopularBooksLoading
            ? "Loading..."
            : !mostPopularBooks?.length
            ? "No Books!"
            : "Most Popular"}
        </h2>
      </div>

      <BookByCoverContainer
        filteredBooks={mostPopularBooks as bookType[]}
        isLoading={isMostPopularBooksLoading}
      />
    </section>
  );
};

export default MostPopular;
