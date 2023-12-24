import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Download } from "lucide-react";
import { getBooksRef, getBookDownloadsRef } from "../config/firebase";
import { getDoc, updateDoc, DocumentData } from "firebase/firestore";
import { abbreviateNumberForStats } from "../misc/commonFunctions";

import "./styles/BookOverview.css";

// ASSETS:
import BookLoadingGif from "../assets/bookLoading.gif";
import LoadingAnimation from "./LoadingAnimation";

// Types:
type bookDownloadLinkType = {
  context: string;
  epub_link: string;
  pdf_link: string;
};

const BookOverview: React.FC = () => {
  // STATES:
  const [pageLoading, setPageLoading] = useState(true);
  const [isDownloadRevealed, setIsDownloadRevealed] = useState(false);
  const [book, setBook] = useState<DocumentData>({
    title: "",
    author: "",
    synopsis: "",
    published: "",
    status: "",
    volumes: null,
    genres: "",
    views: null,
    downloads: null,
    info_link: "",
    cover_link: "",
    cover_shade: "",
  });
  const [bookDownloadLinks, setBookDownloadLinks] = useState<
    bookDownloadLinkType[]
  >([]);
  const [downloadLinksLoading, setDownloadLinksLoading] = useState(false);
  const [isBookLoading, setIsBookLoading] = useState(false);

  // HOOKS:
  const pageLoadingTimeoutRef = useRef<number | null>(null);
  const { info } = useParams();

  // update downloads count:
  const updateDownloadCounts = async (
    info: string | undefined,
    prevDownloadCount: number
  ) => {
    if (info) {
      console.log("updating download counts....");
      const id = info?.split("_")[1];
      const bookRef = getBooksRef(id);
      await updateDoc(bookRef, {
        downloads: prevDownloadCount + 1,
      });
      console.log("updated updated download counts!");
    } else {
      console.log("Invalid info!");
    }
  };

  // get downloads info:
  const getDownloadsInfo = async (info: string | undefined) => {
    if (info) {
      console.log("fetching downloads info....");
      const id = info?.split("_")[1];
      const bookDownloadsRef = getBookDownloadsRef(id);
      const snapshot = await getDoc(bookDownloadsRef);
      const res = snapshot.data();
      if (res && res?.links.length) {
        await updateDownloadCounts(info, book.downloads);
        setBookDownloadLinks([...res.links]);
      }
      console.log("fetched downloads info!");
    } else {
      console.log("Invalid info!");
    }
  };

  // handle download button click:
  const handleDownload = async () => {
    setDownloadLinksLoading(true);

    await getDownloadsInfo(info);

    setIsDownloadRevealed(true);
    const timeoutRef = setTimeout(() => {
      window.scrollTo({
        top: 1000,
        left: 0,
        behavior: "auto",
      });
      clearTimeout(timeoutRef);
    }, 1);

    setDownloadLinksLoading(true);
  };

  // get book data:
  const getBook = async (id: string | undefined) => {
    if (id) {
      setIsBookLoading(true);
      try {
        console.log("book loading...");
        const bookRef = getBooksRef(id);
        const bookSnapshot = await getDoc(bookRef);
        const res = bookSnapshot.data();
        if (res) {
          const updatedViews = Number(res.views) + 1;
          // update views:
          console.log("updating views....");
          await updateDoc(bookRef, {
            views: updatedViews,
          });
          console.log("updated views!");

          setBook({ ...res, views: updatedViews });
          console.log(res);
        }
        console.log("book Loaded!");
      } catch (error) {
        console.log(error);
      }
      setIsBookLoading(false);
    } else {
      console.log("Invalid ID!", id);
    }
  };

  useEffect(() => {
    const id = info?.split("_")[1];
    console.log(info, id);

    getBook(id);

    // handle page loading animation:
    if (pageLoadingTimeoutRef.current !== null) {
      window.clearTimeout(pageLoadingTimeoutRef.current);
    }
    pageLoadingTimeoutRef.current = window.setTimeout(() => {
      setPageLoading(false);
    }, 1000);
  }, [info]);

  if (!isBookLoading && book.title.length <= 0) {
    return (
      <h2
        style={{
          width: "100%",
          textAlign: "center",
          padding: "20px 0",
        }}
      >
        404 Error! Book Not Found!
      </h2>
    );
  }

  // Display Loading Animation:
  if (pageLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="book-overview-container">
      <div className="inner-container">
        <div className="book-container">
          <div className="cover-container">
            <img
              src={isBookLoading ? BookLoadingGif : book?.cover_link}
              alt={book?.title}
              className="cover"
            />

            <div
              className="stats"
              style={{
                background: `linear-gradient(to bottom, ${book?.cover_shade}00 10%, ${book?.cover_shade} 80%)`,
              }}
            >
              {isBookLoading ? (
                <></>
              ) : (
                <p className="views">
                  <span>Views:</span>
                  {` ${abbreviateNumberForStats(book.views)}`}
                </p>
              )}

              {isBookLoading ? (
                <></>
              ) : (
                <p className="downloads">
                  <span>Downloads:</span>
                  {` ${abbreviateNumberForStats(book.downloads)}`}
                </p>
              )}
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

          {isBookLoading ? (
            <h3
              style={{ fontSize: "2.2rem", width: "100%", textAlign: "center" }}
            >
              Loading...
            </h3>
          ) : (
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
                  <span>{abbreviateNumberForStats(book?.volumes)}</span>
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
          )}
        </div>

        <div className="download-container">
          {!isDownloadRevealed ? (
            <button onClick={handleDownload} className="download-reveal-btn">
              {downloadLinksLoading ? (
                "Loading..."
              ) : (
                <>
                  Download <Download size={27} />
                </>
              )}
            </button>
          ) : bookDownloadLinks.length === 0 ? (
            <p className="download-reveal-btn">Not Available!</p>
          ) : (
            <>
              <div
                className="epub-container"
                style={{
                  background: `linear-gradient(to bottom, ${book?.cover_shade}00 10%, ${book?.cover_shade}77 80%)`,
                }}
              >
                EPUB
                <div className="links-container">
                  {bookDownloadLinks.map((link, i) =>
                    !link.epub_link.includes("http") ? (
                      <></>
                    ) : (
                      <a key={i + "epub"} href={link.epub_link} target="_blank">
                        {link.context}
                      </a>
                    )
                  )}
                </div>
              </div>

              <div
                className="pdf-container"
                style={{
                  background: `linear-gradient(to bottom, ${book?.cover_shade}00 10%, ${book?.cover_shade}77 80%)`,
                }}
              >
                PDF
                <div className="links-container">
                  {bookDownloadLinks.map((link, i) =>
                    !link.pdf_link.includes("http") ? (
                      <></>
                    ) : (
                      <a key={i + "pdf"} href={link.pdf_link} target="_blank">
                        {link.context}
                      </a>
                    )
                  )}
                </div>
              </div>

              <div
                className="notice-container"
                style={{
                  background: `linear-gradient(to bottom, ${book?.cover_shade}00 10%, ${book?.cover_shade}77 80%)`,
                }}
              >
                <article className="notice">
                  Please note that some download links may not work properly.
                  So, if you face the issue, request an update in{" "}
                  <Link className="link" to="/request-books">
                    Request Books Page
                  </Link>
                  !
                </article>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookOverview;
