import React, { useEffect, useRef, useState } from "react";
import LoadingAnimation from "../../components/LoadingAnimation";

import "./RequestBooks.css";

const RequestBooks: React.FC = () => {
  // States:
  const [pageLoading, setPageLoading] = useState(true);

  // hooks:
  const pageLoadingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // handle page loading animation:
    if (pageLoadingTimeoutRef.current !== null) {
      window.clearTimeout(pageLoadingTimeoutRef.current);
    }
    pageLoadingTimeoutRef.current = window.setTimeout(() => {
      setPageLoading(false);
    }, 1000);
  }, []);

  // Display Loading Animation:
  if (pageLoading) {
    return <LoadingAnimation />;
  }

  return (
    <section
      className="request-books-page-container"
      style={{
        height: "calc(100vh - 100px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1
        style={{
          fontSize: "10vw",
          width: "100vw",
          textAlign: "center",
        }}
      >
        🚧in construction🚧
      </h1>
    </section>
  );
};

export default RequestBooks;
