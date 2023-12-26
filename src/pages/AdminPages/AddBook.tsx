import React, { useState } from "react";
import { v4 as uuid4 } from "uuid";
import {
  setDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  increment,
} from "firebase/firestore";
import {
  getBooksRef,
  getBookDownloadsRef,
  getStatsRef,
} from "../../config/firebase";

import "./styles/AddBook.css";

// COMPONENTS:
import LoadingAnimation from "../../components/LoadingAnimation";

// TYPES:
type bookInfoType = {
  id?: string;
  title: string;
  author: string;
  synopsis: string;
  published: string;
  status: string;
  volumes: number;
  genres: string;
  views: number;
  downloads: number;
  info_link: string;
  cover_link: string;
  cover_shade: string;
  searchme: string[];
  createdAt: unknown;
};

type linksType = {
  context: string;
  epub_link: string;
  pdf_link: string;
};

type bookDownloadsType = {
  title: string;
  links: linksType[];
};

const AddBook: React.FC = () => {
  // STATES:
  const [isBookSubmitLoading, setIsBookSubmitLoading] = useState(false);
  const [bookInfo, setBookInfo] = useState<bookInfoType>({
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
    searchme: [],
    createdAt: serverTimestamp(),
  });
  const [linksInfo, setLinksInfo] = useState<linksType>({
    context: "",
    epub_link: "",
    pdf_link: "",
  });
  const [bookDownloadsInfo, setBookDownloadsInfo] = useState<bookDownloadsType>(
    {
      title: "",
      links: [],
    }
  );

  // handle add volume download links:
  const handleAddVolume = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    let alreadyExists = false;
    bookDownloadsInfo.links.map((ele) => {
      if (ele.context === linksInfo.context.trim()) {
        alreadyExists = true;
        return;
      }
    });

    // check data validity:
    if (
      !(linksInfo.context && linksInfo.epub_link && linksInfo.pdf_link) ||
      alreadyExists
    ) {
      console.log("Invalid Volume Data!");
      return;
    }

    // trim whitespace:
    const linkData = {
      context: linksInfo.context.trim(),
      epub_link: linksInfo.epub_link.trim(),
      pdf_link: linksInfo.pdf_link.trim(),
    };

    // add new volume:
    setBookDownloadsInfo((prev) => ({
      title: "",
      links: [...prev.links, linkData],
    }));
    // clear that volume info:
    setLinksInfo({
      context: "",
      epub_link: "",
      pdf_link: "",
    });
  };

  // handle bookInfo submit:
  const handleBookSubmit = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setIsBookSubmitLoading(true);

    // check if all values are present:
    if (
      !(
        bookInfo.title &&
        bookInfo.author &&
        bookInfo.synopsis &&
        bookInfo.published &&
        bookInfo.status
      )
    ) {
      console.log("Invalid Info!");
      return;
    }

    // trim white spaces for bookData:
    const bookData = {
      ...bookInfo,
      title: bookInfo.title.trim(),
      author: bookInfo.author.trim(),
      synopsis: bookInfo.synopsis.trim().slice(0, 310),
      published: bookInfo.published.trim(),
      status: bookInfo.status.trim(),
      volumes: bookDownloadsInfo.links.length,
      genres: bookInfo.genres.trim(),
      info_link: bookInfo.info_link.trim(),
      cover_link: bookInfo.cover_link.trim(),
      cover_shade: bookInfo.cover_shade.trim(),
      searchme: [
        ...bookInfo.title
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "")
          .split(" ")
          .filter((e) => e !== ""),
        bookInfo.published.trim(),
        ...bookInfo.genres.trim().toLowerCase().split(", "),
        bookInfo.status.trim().toLowerCase(),
        ...bookInfo.author.trim().toLowerCase().split(" "),
      ],
    };

    // trim white spaces for bookDownloadsData:
    const bookDownloadsData: bookDownloadsType = {
      title: bookInfo.title.trim(),
      links: [],
    };
    bookDownloadsInfo.links.forEach((e) => {
      const res = {
        context: e.context.trim(),
        epub_link: e.epub_link.trim(),
        pdf_link: e.pdf_link.trim(),
      };
      bookDownloadsData.links.push(res);
    });

    // add new item to book database:
    console.log(bookInfo);
    try {
      // add new book:
      console.log("adding book...");
      const id = uuid4();
      console.log(id);
      const bookRef = getBooksRef(id);
      await setDoc(bookRef, bookData);

      // add new bookWithDownload:
      console.log("adding bookDownload...");
      const bookDownloadRef = getBookDownloadsRef(id);
      await setDoc(bookDownloadRef, bookDownloadsData);
      setBookDownloadsInfo({
        title: "",
        links: [],
      });
      console.log("added bookDownload!");

      // updating stats:
      console.log("updating Stats...");
      const statsRef = getStatsRef("stats");
      await updateDoc(statsRef, {
        booksCount: increment(1),
      });

      const genresRef = getStatsRef("genres");
      const genresList = bookInfo.genres.trim().toLowerCase().split(", ");
      await updateDoc(genresRef, { genres: arrayUnion(...genresList) });
      console.log("Updated Stats");

      setBookInfo({
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
        searchme: [],
        createdAt: serverTimestamp(),
      });
      console.log("book added!");
    } catch (error) {
      console.log(error);
    }
    setIsBookSubmitLoading(false);
  };

  // show loading animation:
  if (isBookSubmitLoading) <LoadingAnimation />;

  return (
    <section className="add-book-page">
      <h1 className="title">Add Book</h1>

      {/* Add Book Infos */}
      <div className="form-container">
        <div className="item">
          <label htmlFor="">Title </label>
          <input
            placeholder="book title.."
            value={bookInfo.title}
            onChange={(e) => {
              e.preventDefault();
              setBookInfo((prev) => ({
                ...prev,
                title: e.target.value,
              }));
            }}
            type="text"
          />
        </div>
        <div className="item">
          <label htmlFor="">Author </label>
          <input
            placeholder="author name.."
            value={bookInfo.author}
            onChange={(e) => {
              e.preventDefault();
              setBookInfo((prev) => ({
                ...prev,
                author: e.target.value,
              }));
            }}
            type="text"
          />
        </div>
        <div className="item">
          <label htmlFor="">Synopsis </label>
          <textarea
            placeholder="short description.."
            value={bookInfo.synopsis}
            onChange={(e) => {
              e.preventDefault();
              setBookInfo((prev) => ({
                ...prev,
                synopsis: e.target.value,
              }));
            }}
            name=""
            id=""
            rows={4}
          ></textarea>
        </div>
        <div className="item">
          <label htmlFor="">Published </label>
          <input
            placeholder="ex: 2023.."
            value={bookInfo.published}
            onChange={(e) => {
              e.preventDefault();
              setBookInfo((prev) => ({
                ...prev,
                published: e.target.value,
              }));
            }}
            type="text"
          />
        </div>
        <div className="item">
          <label htmlFor="">Status </label>
          <input
            placeholder="ex: ongoing.."
            value={bookInfo.status}
            onChange={(e) => {
              e.preventDefault();
              setBookInfo((prev) => ({
                ...prev,
                status: e.target.value,
              }));
            }}
            type="text"
          />
        </div>
        <div className="item">
          <label htmlFor="">Genres </label>
          <input
            placeholder="ex: comedy,school life,sci-fi.."
            value={bookInfo.genres}
            onChange={(e) => {
              e.preventDefault();
              setBookInfo((prev) => ({
                ...prev,
                genres: e.target.value,
              }));
            }}
            type="text"
          />
        </div>
        <div className="item">
          <label htmlFor="">Info Link </label>
          <input
            placeholder="ex: https://something.com.."
            value={bookInfo.info_link}
            onChange={(e) => {
              e.preventDefault();
              setBookInfo((prev) => ({
                ...prev,
                info_link: e.target.value,
              }));
            }}
            type="text"
          />
        </div>
        <div className="item">
          <label htmlFor="">Cover Link </label>
          <input
            placeholder="ex: https://something.com.."
            value={bookInfo.cover_link}
            onChange={(e) => {
              e.preventDefault();
              setBookInfo((prev) => ({
                ...prev,
                cover_link: e.target.value,
              }));
            }}
            type="text"
          />
        </div>
        <div className="item">
          <label htmlFor="">Cover Shade </label>
          <input
            placeholder="ex: #ff7f38.."
            value={bookInfo.cover_shade}
            onChange={(e) => {
              e.preventDefault();
              setBookInfo((prev) => ({
                ...prev,
                cover_shade: e.target.value,
              }));
            }}
            type="text"
          />
        </div>

        {/* Added Volumes */}
        {bookDownloadsInfo.links.length === 0 ? (
          <></>
        ) : (
          <div className="volumes-added-container">
            <span>Download Links: </span>
            {bookDownloadsInfo.links.map((e, i) => (
              <span className="context" key={`e-${i}`}>{`${e.context}`}</span>
            ))}
          </div>
        )}

        {/* Add Volumes */}
        <div className="add-volumes-container">
          <h3 className="title">Add Book Download Links</h3>
          <div className="item">
            <label htmlFor="">Context </label>
            <input
              placeholder="ex: Volume 1.."
              value={linksInfo.context}
              onChange={(e) => {
                e.preventDefault();
                setLinksInfo((prev) => ({
                  ...prev,
                  context: e.target.value,
                }));
              }}
              type="text"
            />
          </div>
          <div className="item">
            <label htmlFor="">EPUB Link </label>
            <input
              placeholder="ex: https://something.com.."
              value={linksInfo.epub_link}
              onChange={(e) => {
                e.preventDefault();
                setLinksInfo((prev) => ({
                  ...prev,
                  epub_link: e.target.value,
                }));
              }}
              type="text"
            />
          </div>
          <div className="item">
            <label htmlFor="">PDF Link </label>
            <input
              placeholder="ex: https://something.com.."
              value={linksInfo.pdf_link}
              onChange={(e) => {
                e.preventDefault();
                setLinksInfo((prev) => ({
                  ...prev,
                  pdf_link: e.target.value,
                }));
              }}
              type="text"
            />
          </div>
          <button className="add-volume-btn" onClick={handleAddVolume}>
            Add
          </button>
        </div>
      </div>

      <button className="book-submit-btn" onClick={handleBookSubmit}>
        {isBookSubmitLoading ? "Loading..." : "Submit Book"}
      </button>
    </section>
  );
};

export default AddBook;
