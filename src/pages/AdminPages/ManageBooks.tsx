import React, { useState, useEffect, useRef } from "react";
import {
  query,
  collection,
  DocumentData,
  orderBy,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "../../config/firebase";

import "./styles/ManageBooks.css";

// COMPONENTS:
import LoadingAnimation from "../../components/LoadingAnimation";
import LinkTo from "../../components/LinkTo";
import useGetDocs from "../../hooks/useGetDocs";

// TYPES:
type bookType = {
  id: string;
  title: string;
};

const ManageBooks: React.FC = () => {
  // STATES:
  const [searchInput, setSearchInput] = useState("");

  // HOOKS:
  const firstCallRef = useRef(false);
  const [getBooks, books, isBooksLoading] = useGetDocs();

  const filterBooksBySearchInput = (b: bookType) =>
    b.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .includes(
        searchInput
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "")
      );

  const handleGetBooks = async () => {
    const q = query(collection(db, "books"), orderBy("title"));

    const filterBooks = (
      snapshot: QuerySnapshot<DocumentData, DocumentData>
    ) => {
      const res: bookType[] = [];
      snapshot.forEach((doc) => {
        res.push({
          id: doc.id,
          title: doc.data().title,
        });
      });
      return res as DocumentData[];
    };

    await getBooks(q, filterBooks);
  };

  useEffect(() => {
    if (!firstCallRef.current) {
      handleGetBooks();
      firstCallRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isBooksLoading) return <LoadingAnimation />;

  return (
    <section className="manage-books-section">
      <div className="header-container">
        <div className="title-container">
          <h1 className="title">Manage Books</h1>
        </div>

        <div className="search-container">
          <input
            className="search-field"
            value={searchInput}
            onChange={(e) => {
              e.preventDefault();
              setSearchInput(e.target.value);
            }}
            type="text"
            placeholder="search by titles.."
          />
        </div>
      </div>

      <div className="books-list">
        {!isBooksLoading && books.length === 0 ? (
          <h2 style={{ textAlign: "center" }}>No Books!</h2>
        ) : (
          books
            .filter((b) => filterBooksBySearchInput(b as bookType))
            .map((b) => (
              <LinkTo
                key={b.id}
                context={b.title}
                link={`${b.title.slice(0, 10)}===${b.id}`}
              />
            ))
        )}
      </div>
    </section>
  );
};

export default ManageBooks;
