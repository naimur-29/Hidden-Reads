import React, { useState } from "react";
import { v4 as uuid4 } from "uuid";
import { setDoc } from "firebase/firestore";
import {
  getBooksRef,
  getBookDownloadsRef,
  // getStatsRef,
} from "../config/firebase";

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
};

type linksType = {
  context: string;
  epub_link: string;
  pdf_link: string;
};

type bookDownloadsType = {
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
  });
  const [linksInfo, setLinksInfo] = useState<linksType>({
    context: "",
    epub_link: "",
    pdf_link: "",
  });
  const [bookDownloadsInfo, setBookDownloadsInfo] = useState<bookDownloadsType>(
    {
      links: [],
    }
  );

  // handle add volume download links:
  const handleAddVolume = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    // check data validity:
    if (!(linksInfo.context && linksInfo.epub_link && linksInfo.pdf_link)) {
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

    // trim white spaces:
    const bookData = {
      ...bookInfo,
      title: bookInfo.title.trim(),
      author: bookInfo.author.trim(),
      synopsis: bookInfo.synopsis.trim().slice(0, 310),
      published: bookInfo.published.trim(),
      status: bookInfo.status.trim(),
      genres: bookInfo.genres.trim(),
      info_link: bookInfo.info_link.trim(),
      cover_link: bookInfo.cover_link.trim(),
      cover_shade: bookInfo.cover_shade.trim(),
      searchme: [
        ...bookInfo.title
          .trim()
          .toLowerCase()
          .replace(/[^a-z\s]/g, "")
          .split(" "),
        bookInfo.published.trim(),
        ...bookInfo.genres.trim().toLowerCase().split(","),
        bookInfo.status.trim().toLowerCase(),
        bookInfo.author.trim().toLowerCase(),
      ],
    };

    // add new item to book database:
    console.log(bookInfo);
    try {
      // add new book:
      console.log("adding book...");
      const id = uuid4();
      console.log(id);
      const bookRef = getBooksRef(id);
      await setDoc(bookRef, bookData);
      // const statsRef = getStatsRef("books");

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
      });
      console.log("book added!");

      // add new bookDownload:
      console.log("adding bookDownload...");
      const bookDownloadRef = getBookDownloadsRef(id);
      await setDoc(bookDownloadRef, bookDownloadsInfo);
      setBookDownloadsInfo({
        links: [],
      });
      console.log("added bookDownload!");
    } catch (error) {
      console.log(error);
    }
    setIsBookSubmitLoading(false);
  };

  return (
    <section className="add-book-page">
      <h1>Add Book</h1>

      {/* Add Book Infos */}
      <div className="form-container">
        <div className="item">
          <label htmlFor="">Title: </label>
          <input
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
          <label htmlFor="">Author: </label>
          <input
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
          <label htmlFor="">Synopsis: </label>
          <textarea
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
            cols={50}
            rows={10}
          ></textarea>
        </div>
        <div className="item">
          <label htmlFor="">Published: </label>
          <input
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
          <label htmlFor="">Status: </label>
          <input
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
          <label htmlFor="">Volumes/Chapters: </label>
          <input
            value={bookInfo.volumes}
            onChange={(e) => {
              e.preventDefault();
              e.target.value = e.target.value.replace("0", "");
              setBookInfo((prev) => ({
                ...prev,
                volumes: Number(e.target.value),
              }));
            }}
            type="number"
          />
        </div>
        <div className="item">
          <label htmlFor="">Genres: </label>
          <input
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
          <label htmlFor="">Info Link: </label>
          <input
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
          <label htmlFor="">Cover Link: </label>
          <input
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
          <label htmlFor="">Cover Shade: </label>
          <input
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
        <div className="volumes-added-container">
          <span>Download Links: </span>
          {bookDownloadsInfo.links.map((e, i) => (
            <span key={`e-${i}`}>{`${e.context}, `}</span>
          ))}
        </div>

        {/* Add Volumes */}
        <div className="add-volumes-container">
          <h3>Add Book Download Links</h3>
          <div className="item">
            <label htmlFor="">Context: </label>
            <input
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
            <label htmlFor="">EPUB Link: </label>
            <input
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
            <label htmlFor="">PDF Link: </label>
            <input
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
          <button onClick={handleAddVolume}>Add Volume</button>
        </div>
      </div>

      <button onClick={handleBookSubmit}>
        {isBookSubmitLoading ? "Loading..." : "Submit Book"}
      </button>
    </section>
  );
};

export default AddBook;
