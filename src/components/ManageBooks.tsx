import React, { useState, useEffect, useRef } from "react";
import {
  getDocs,
  query,
  collection,
  DocumentData,
  orderBy,
} from "firebase/firestore";
import { db } from "../config/firebase";

import "./styles/ManageBooks.css";

// TYPES:
import { bookType } from "./BookSearchItem";
import LoadingAnimation from "./LoadingAnimation";
import LinkTo from "./LinkTo";

const ManageBooks: React.FC = () => {
  // STATES:
  const [books, setBooks] = useState<DocumentData[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [isBooksLoading, setIsBooksLoading] = useState(false);

  // HOOKS:
  const firstCallRef = useRef(false);

  const filterBooksBySearchInput = (b: bookType) =>
    b.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .includes(searchInput.trim().toLowerCase());

  const getBooks = async () => {
    setIsBooksLoading(true);
    const q = query(collection(db, "books"), orderBy("title"));

    try {
      const snapshot = await getDocs(q);
      const booksData: DocumentData[] = [];
      snapshot.forEach((doc) => {
        booksData.push({
          id: doc.id,
          title: doc.data().title,
        });
      });

      if (booksData.length > 0) {
        setBooks(booksData);
      }
    } catch (error) {
      console.error(error);
    }
    setIsBooksLoading(false);
  };

  useEffect(() => {
    if (firstCallRef.current === false) {
      getBooks();
      firstCallRef.current = true;
    }
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
        {books.length === 0 ? (
          <h2 style={{ textAlign: "center" }}>No Books!</h2>
        ) : (
          books
            .filter((b) => filterBooksBySearchInput(b as bookType))
            .map((b) => (
              <LinkTo key={b.id} context={b.title} link={`${b.id}`} />
            ))
        )}
      </div>
    </section>
  );
};

export default ManageBooks;
