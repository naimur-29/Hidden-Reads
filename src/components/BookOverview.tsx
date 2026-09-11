import React, { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { increment } from "firebase/firestore";
import { abbreviateNumberForStats, isAllowedSourceLink } from "../utility/commonFunctions";
import "./styles/BookOverview.css";
import BookLoadingGif from "../assets/bookLoading.gif";
import LoadingAnimation from "./LoadingAnimation";
import useGetDoc from "../hooks/useGetDoc";
import useUpdateDoc from "../hooks/useUpdateDoc";

const BookOverview: React.FC = () => {
  const { info } = useParams();
  const bookInfoLoaded = useRef(false);
  const viewsUpdated = useRef(false);
  const [getBookInfo, bookInfo, isBookInfoLoading] = useGetDoc();
  const [updateBookInfo] = useUpdateDoc();

  useEffect(() => {
    if (!bookInfoLoaded.current) {
      getBookInfo("books", info?.split("_")[1]);
      bookInfoLoaded.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!viewsUpdated.current && bookInfo.title?.length) {
      updateBookInfo("books", info?.split("_")[1], { views: increment(1) });
      viewsUpdated.current = true;
    }
  }, [info, bookInfo, updateBookInfo]);

  if (isBookInfoLoading) return <LoadingAnimation />;
  if (!bookInfo?.title) {
    return <h2 style={{ width: "100%", textAlign: "center", padding: "20px 0" }}>404 Error! Book Not Found!</h2>;
  }

  const hasSourceLink = Boolean(bookInfo.info_link?.trim()) && isAllowedSourceLink(bookInfo.info_link);
  return (
    <div className="book-overview-container">
      <div className="inner-container">
        <div className="book-container">
          <div className="cover-container">
            <img
              src={bookInfo.cover_link?.includes("http") ? bookInfo.cover_link : BookLoadingGif}
              alt={bookInfo.title}
              className="cover"
              style={{ backgroundImage: `linear-gradient(0deg, ${bookInfo.cover_shade}99, ${bookInfo.cover_shade}00, ${bookInfo.cover_shade}99)` }}
            />
            <div className="stats" style={{ background: `linear-gradient(to bottom, ${bookInfo.cover_shade}00 10%, ${bookInfo.cover_shade} 80%)` }}>
              <p className="views"><span>Views:</span>{` ${abbreviateNumberForStats(bookInfo.views)}`}</p>
            </div>
          </div>
          <div className="info-container">
            <div className="top">
              <h3 className="title">{bookInfo.title}</h3>
              <article className="synopsis">
                {hasSourceLink ? <>{`${bookInfo.synopsis?.slice(0, 300)}... `}<a href={bookInfo.info_link} target="_blank" rel="noreferrer">See more</a></> : bookInfo.synopsis?.slice(0, 300)}
              </article>
            </div>
            <div className="bottom">
              <div className="status item"><span>Status:</span><span>{bookInfo.status}</span></div>
              <div className="author item"><span>Author:</span><span>{bookInfo.author}</span></div>
              <div className="volumes item"><span>Volumes/Chapters:</span><span>{abbreviateNumberForStats(bookInfo.volumes)}</span></div>
              <div className="genres item"><span>Genres: </span><span>{bookInfo.genres?.split(", ").map((genre: string) => <Link className="link" key={genre.toLowerCase()} to={`/genres/${genre.toLowerCase()}`}>{genre}</Link>)}</span></div>
            </div>
          </div>
        </div>
        <p className="policy-notice">Hidden Reads provides book information only. It does not host or distribute book files.</p>
      </div>
    </div>
  );
};

export default BookOverview;
