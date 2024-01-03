import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Download } from "lucide-react";
import { increment } from "firebase/firestore";
import { abbreviateNumberForStats } from "../misc/commonFunctions";

import "./styles/BookOverview.css";

// ASSETS:
import BookLoadingGif from "../assets/bookLoading.gif";
import LoadingAnimation from "./LoadingAnimation";

// CUSTOM HOOKS:
import useGetDoc from "../hooks/useGetDoc";
import useUpdateDoc from "../hooks/useUpdateDoc";

// Types:
type bookDownloadLinkType = {
  context: string;
  epub_link: string;
  pdf_link: string;
};

const BookOverview: React.FC = () => {
  // STATES:
  const [isDownloadRevealed, setIsDownloadRevealed] = useState(false);

  // HOOKS:
  const { info } = useParams();
  const bookInfoLoaded = useRef(false);
  const viewsUpdated = useRef(false);
  const downloadsCountUpdated = useRef(false);
  const [getBookInfo, bookInfo, isBookInfoLoading] = useGetDoc();
  const [getBookDownloadLinks, bookDownloadLinks, isBookDownloadLinksLoading] =
    useGetDoc();
  const [updateBookInfo] = useUpdateDoc();

  // handle download button click:
  const handleDownload = async () => {
    const id = info?.split("_")[1];
    await getBookDownloadLinks("bookDownloads", id);
    setIsDownloadRevealed(true);

    const timeoutRef = setTimeout(() => {
      window.scrollTo({
        top: 2000,
        left: 0,
        behavior: "auto",
      });
      clearTimeout(timeoutRef);
    }, 1);
  };

  // get book info on page load:
  useEffect(() => {
    if (!bookInfoLoaded.current) {
      const id = info?.split("_")[1];
      getBookInfo("books", id);
      bookInfoLoaded.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update book views and downloads on action:
  useEffect(() => {
    if (!viewsUpdated.current && bookInfo.title?.length) {
      const id = info?.split("_")[1];
      updateBookInfo("books", id, {
        views: increment(1),
      });
      viewsUpdated.current = true;
    }

    if (!downloadsCountUpdated.current && bookDownloadLinks.links?.length) {
      const id = info?.split("_")[1];
      updateBookInfo("books", id, {
        downloads: increment(1),
      });
      downloadsCountUpdated.current = true;
    }
  }, [info, bookInfo, bookDownloadLinks, updateBookInfo]);

  // Display Loading Animation:
  if (isBookInfoLoading) {
    return <LoadingAnimation />;
  } else if (!bookInfo?.title) {
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

  return (
    <div className="book-overview-container">
      <div className="inner-container">
        <div className="book-container">
          <div className="cover-container">
            <img
              src={isBookInfoLoading ? BookLoadingGif : bookInfo?.cover_link}
              alt={bookInfo?.title}
              className="cover"
              style={{
                backgroundImage: `linear-gradient(0deg, ${bookInfo.cover_shade}99, ${bookInfo.cover_shade}00, ${bookInfo.cover_shade}99)`,
              }}
            />

            <div
              className="stats"
              style={{
                background: `linear-gradient(to bottom, ${bookInfo?.cover_shade}00 10%, ${bookInfo?.cover_shade} 80%)`,
              }}
            >
              {isBookInfoLoading ? (
                <></>
              ) : (
                <>
                  <p className="views">
                    <span>Views:</span>
                    {` ${abbreviateNumberForStats(bookInfo.views)}`}
                  </p>

                  <p className="downloads">
                    <span>Downloads:</span>
                    {` ${abbreviateNumberForStats(bookInfo.downloads)}`}
                  </p>
                </>
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

          {isBookInfoLoading ? (
            <h3
              style={{ fontSize: "2.2rem", width: "100%", textAlign: "center" }}
            >
              Loading...
            </h3>
          ) : (
            <div className="info-container">
              <div className="top">
                <h3 className="title">{bookInfo?.title}</h3>
                {/* <h4 className="title" style={{ fontSize: "1.2rem" }}>
                {bookInfo?.og_title}
              </h4> */}

                <article className="synopsis">
                  {`${bookInfo?.synopsis?.slice(0, 300)}... `}
                  <a href={bookInfo?.info_link} target="_blank">
                    See more
                  </a>
                </article>
              </div>

              <div className="bottom">
                <div className="status item">
                  <span>Status:</span>
                  <span>{bookInfo?.status}</span>
                </div>

                <div className="author item">
                  <span>Author:</span>
                  <span>{bookInfo?.author}</span>
                </div>

                <div className="volumes item">
                  <span>Volumes/Chapters:</span>
                  <span>{abbreviateNumberForStats(bookInfo?.volumes)}</span>
                </div>

                <div className="genres item">
                  <span>Genres: </span>
                  <span>
                    {bookInfo?.genres?.split(", ").map((g: string) => (
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
              {isBookDownloadLinksLoading ? (
                "Loading..."
              ) : (
                <>
                  Download <Download size={27} />
                </>
              )}
            </button>
          ) : bookDownloadLinks.links?.length === 0 ? (
            <p className="download-reveal-btn">Not Available!</p>
          ) : (
            <>
              <div
                className="epub-container"
                style={{
                  background: `linear-gradient(to bottom, ${bookInfo?.cover_shade}00 10%, ${bookInfo?.cover_shade}77 80%)`,
                }}
              >
                EPUB
                <div className="links-container">
                  {bookDownloadLinks.links?.map(
                    (link: bookDownloadLinkType, i: number) =>
                      !link.epub_link.includes("http") ? (
                        <React.Fragment key={i + "epub"} />
                      ) : (
                        <a
                          key={i + "epub"}
                          href={link.epub_link}
                          target="_blank"
                        >
                          {link.context}
                        </a>
                      )
                  )}
                </div>
              </div>

              <div
                className="pdf-container"
                style={{
                  background: `linear-gradient(to bottom, ${bookInfo?.cover_shade}00 10%, ${bookInfo?.cover_shade}77 80%)`,
                }}
              >
                PDF
                <div className="links-container">
                  {bookDownloadLinks.links?.map(
                    (link: bookDownloadLinkType, i: number) =>
                      !link.pdf_link.includes("http") ? (
                        <React.Fragment key={i + "pdf"} />
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
                  background: `linear-gradient(to bottom, ${bookInfo?.cover_shade}00 10%, ${bookInfo?.cover_shade}77 80%)`,
                }}
              >
                <article className="notice">
                  Please note that some download links may not work properly.
                  So, if you face the issue, kindly request an update in{" "}
                  <Link className="link" to="/request-books">
                    Request Books Page
                  </Link>
                  ! For further information contact{" "}
                  <a
                    href="https://www.facebook.com/profile.php?id=61553805444489"
                    target="_blank"
                    className="link"
                  >
                    @jack
                  </a>
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
