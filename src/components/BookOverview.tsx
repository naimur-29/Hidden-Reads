import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";

import "./styles/BookOverview.css";

// Data:
const book = {
  id: "<id>",
  genres: "Isekai,Fantasy,Slice of Life,Action,Ecci,Harem,Horror",
  name: "86 - Eighty Six",
  author: "John Smith",
  synopsis:
    "A War Without Casualties. The Republic of San Magnolia has long been under attack from the neighbouring Giadian Empire's army of unmanned drones known as the Legion. After years of painstaking research, the Republic finally developed autonomous drones of their own, turning the one-sided struggle int",
  infoLink: "https://www.novelupdates.com/series/86/",
  cover:
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi0.wp.com%2Fjnovels.com%2Fwp-content%2Fuploads%2F2019%2F03%2F86-Eighty-Six-Light-Novel-Volume-1.jpg%3Ffit%3D500%252C750%26ssl%3D1&f=1&nofb=1&ipt=d7c771ae4a0a60dd8ebdf71ca50a8f0cbf6c74ce69d16d608e8a78e78bb3131d&ipo=images",
  coverShade: "#261a3e",
  startedPublishing: "2023",
  status: "Ongoing",
  volumes: "03",
  views: 104,
  download: [
    {
      context: "Volume 1",
      epub: "https://google.com/",
      pdf: "https://google.com/",
    },
    {
      context: "Volume 2",
      epub: "https://google.com/",
      pdf: "https://google.com/",
    },
    {
      context: "Volume 3",
      epub: "https://google.com/",
      pdf: "https://google.com/",
    },
    {
      context: "Volume 3.5",
      epub: "https://google.com/",
      pdf: "https://google.com/",
    },
    {
      context: "Volume 4",
      epub: "https://google.com/",
      pdf: "https://google.com/",
    },
    {
      context: "Short Stories",
      epub: "https://google.com/",
      pdf: "https://google.com/",
    },

    {
      context: "Volume 4",
      epub: "https://google.com/",
      pdf: "https://google.com/",
    },
    {
      context: "Short Stories",
      epub: "https://google.com/",
      pdf: "https://google.com/",
    },

    {
      context: "Volume 4",
      epub: "https://google.com/",
      pdf: "https://google.com/",
    },
    {
      context: "Short Stories",
      epub: "https://google.com/",
      pdf: "https://google.com/",
    },

    {
      context: "Volume 4",
      epub: "https://google.com/",
      pdf: "https://google.com/",
    },
    {
      context: "Short Stories",
      epub: "https://google.com/",
      pdf: "https://google.com/",
    },
  ],
};

// const commentsCount = 12;

const BookOverview: React.FC = () => {
  // STATES:
  const [isDownloadRevealed, setIsDownloadRevealed] = useState(false);

  // const { info } = useParams();

  return (
    <div className="book-overview-container">
      <div className="inner-container">
        <div className="book-container">
          <div className="cover-container">
            <img src={book.cover} alt={book.name} className="cover" />

            <div
              className="stats"
              style={{
                background: `linear-gradient(to bottom, ${book.coverShade}00 10%, ${book.coverShade} 80%)`,
              }}
            >
              <p className="views">{`Views: ${book.views}`}</p>
              <p className="downloads">{`Downloads: ${book.views}`}</p>
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
              <h3 className="title">{book.name}</h3>

              <article className="synopsis">
                {`${book.synopsis.slice(0, 300)}... `}
                <a href={book.infoLink} target="_blank">
                  See more
                </a>
              </article>
            </div>

            <div className="bottom">
              <div className="volumes item">
                <span>Volumes:</span>
                <span>{book.volumes}</span>
              </div>

              <div className="status item">
                <span>Status:</span>
                <span>{book.status}</span>
              </div>

              <div className="author item">
                <span>Author:</span>
                <span>{book.author}</span>
              </div>

              <div className="genres item">
                <span>Genres: </span>
                <span>
                  {book.genres.split(",").map((g) => (
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
                <div className="links-container">
                  {book.download.map((link) => (
                    <a href={link.epub}>{link.context}</a>
                  ))}
                </div>
              </div>

              <div className="pdf-container">
                PDF
                <div className="links-container">
                  {book.download.map((link) => (
                    <a href={link.pdf}>{link.context}</a>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookOverview;
