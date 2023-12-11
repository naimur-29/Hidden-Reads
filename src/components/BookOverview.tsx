import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Download } from "lucide-react";
import { getBooksRef } from "../config/firebase";
import { getDoc, DocumentData } from "firebase/firestore";

import "./styles/BookOverview.css";

const BookOverview: React.FC = () => {
  // STATES:
  const [isDownloadRevealed, setIsDownloadRevealed] = useState(false);
  const [book, setBook] = useState<DocumentData>({
    title: "",
    author: "",
    synopsis: "",
    published: "",
    status: "",
    volumes: 0,
    genres: "",
    views: 0,
    downloads: 0,
    info_link: "",
    cover_link: "",
    cover_shade: "",
  });

  // HOOKS:
  const { info } = useParams();

  // get book data:
  const getBook = async (id: string | undefined) => {
    if (id) {
      try {
        console.log("book loading...");
        const bookRef = getBooksRef(id);
        const bookSnapshot = await getDoc(bookRef);
        const res = bookSnapshot.data();
        if (res) {
          setBook(res);
          console.log(res);
        }
        console.log("book Loaded!");
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Invalid ID!", id);
    }
  };

  useEffect(() => {
    const id = info?.split("_")[1];
    console.log(info, id);

    getBook(id);
  }, [info]);

  return (
    <div className="book-overview-container">
      <div className="inner-container">
        <div className="book-container">
          <div className="cover-container">
            <img src={book?.cover_link} alt={book?.title} className="cover" />

            <div
              className="stats"
              style={{
                background: `linear-gradient(to bottom, ${book?.cover_shade}00 10%, ${book?.cover_shade} 80%)`,
              }}
            >
              <p className="views">{`Views: ${book?.views}`}</p>
              <p className="downloads">{`Downloads: ${book?.downloads}`}</p>
              {/* <a href="#comments-container" className="comments">
                <MessageSquare />
                {`${commentsCount} Comments`}
              </a> */}
              {/* <p className="comments">
                <MessageSquare style={{ translate: "0px 3px" }} />
                {`Comments Coming Soon...`}
              </p> */}
            </div>
          </div>

          <div className="info-container">
            <div className="top">
              <h3 className="title">{book?.title}</h3>
              {/* <h4 className="title" style={{ fontSize: "1.2rem" }}>
                {book?.og_title}
              </h4> */}

              <article className="synopsis">
                {`${book?.synopsis.slice(0, 300)}... `}
                <a href={book?.info_link} target="_blank">
                  See more
                </a>
              </article>
            </div>

            <div className="bottom">
              <div className="status item">
                <span>Status:</span>
                <span>{book?.status}</span>
              </div>

              <div className="author item">
                <span>Author:</span>
                <span>{book?.author}</span>
              </div>

              <div className="volumes item">
                <span>Volumes/Chapters:</span>
                <span>{book?.volumes}</span>
              </div>

              <div className="genres item">
                <span>Genres: </span>
                <span>
                  {book?.genres.split(",").map((g: string) => (
                    <Link
                      className="link"
                      key={g.toLowerCase()}
                      to={`/genres/${g.toLowerCase()}`}
                    >
                      {g}
                    </Link>
                  ))}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="download-container">
          {!isDownloadRevealed ? (
            <button
              onClick={() => {
                setIsDownloadRevealed(true);
                const timeoutRef = setTimeout(() => {
                  window.scrollTo({
                    top: 1000,
                    left: 0,
                    behavior: "auto",
                  });
                  clearTimeout(timeoutRef);
                }, 1);
              }}
              className="download-reveal-btn"
            >
              Download <Download size={27} />
            </button>
          ) : (
            <>
              <div className="epub-container">
                EPUB
                {/* <div className="links-container">
                  {book.download.map((link) => (
                    <a href={link.epub}>{link.context}</a>
                  ))}
                </div> */}
              </div>

              <div className="pdf-container">
                PDF
                {/* <div className="links-container">
                  {book.download.map((link) => (
                    <a href={link.pdf}>{link.context}</a>
                  ))}
                </div> */}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookOverview;
