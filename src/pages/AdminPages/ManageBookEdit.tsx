import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getBooksRef,
  getBookDownloadsRef,
  getStatsRef,
} from "../../config/firebase";
import {
  DocumentData,
  deleteDoc,
  getDoc,
  increment,
  updateDoc,
} from "firebase/firestore";

import "./styles/ManageBookEdit.css";

// COMPONENTS:
import LoadingAnimation from "../../components/LoadingAnimation";

// TYPES:
interface linkType {
  context: string;
  epub_link: string;
  pdf_link: string;
}

interface bookDownloadInfoType {
  title: string;
  links: linkType[];
}

interface bookInfoType {
  cover_link: string;
  cover_shade: string;
  info_link: string;
}

const ManageBookEdit: React.FC = () => {
  // STATES:
  const [bookDownloadInfo, setBookDownloadInfo] =
    useState<bookDownloadInfoType>({
      title: "",
      links: [],
    });
  const [newLink, setNewLink] = useState<linkType>({
    context: "",
    epub_link: "",
    pdf_link: "",
  });
  const [isEditDownloadInfoRevealed, setIsEditDownloadInfoRevealed] =
    useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [isDeleteBookConfirm, setIsDeleteBookConfirm] = useState(false);
  const [bookInfo, setBookInfo] = useState<bookInfoType>({
    cover_link: "",
    cover_shade: "",
    info_link: "",
  });

  // HOOKS:
  const id = useParams().id?.split("===")[1];
  const navigate = useNavigate();
  const pageLoadingTimeoutRef = useRef<null | number>(null);

  const updateBookInfo = async (id: string, context: string) => {
    let data;
    if (context === "COVER") {
      if (
        bookInfo.cover_link.trim().length === 0 ||
        bookInfo.cover_shade.trim().length === 0
      ) {
        console.log("Invalid Cover Link!");
        return;
      } else
        data = {
          cover_info: bookInfo.cover_link,
          cover_shade: bookInfo.cover_shade,
        };
    } else if (context === "INFO") {
      if (bookInfo.info_link.trim().length === 0) {
        console.log("Invalid Info Link!");
        return;
      } else
        data = {
          info_link: bookInfo.info_link,
        };
    }

    try {
      setPageLoading(true);
      console.log("updating book...");
      const bookRef = getBooksRef(id);
      await updateDoc(bookRef, data as DocumentData);
      console.log("book updated!");

      setBookInfo({
        cover_link: "",
        cover_shade: "",
        info_link: "",
      });
    } catch (error) {
      console.log(error);
    }
    setPageLoading(false);
  };

  const getBookDownloadInfo = async (id: string) => {
    try {
      setPageLoading(true);
      const bookDownloadRef = getBookDownloadsRef(id);
      const snapshot = await getDoc(bookDownloadRef);

      const res = {
        title: snapshot.data()?.title || "",
        links: snapshot.data()?.links || [],
      } as bookDownloadInfoType;

      if (res) setBookDownloadInfo(res);
    } catch (error) {
      console.log(error);
    }
    setPageLoading(false);
  };

  const updateBookDownloadInfo = async (id: string) => {
    try {
      setPageLoading(true);
      setNewLink({
        context: "",
        epub_link: "",
        pdf_link: "",
      });
      const bookDownloadRef = getBookDownloadsRef(id);
      await updateDoc(bookDownloadRef, bookDownloadInfo as DocumentData);
      console.log("Book Download Info Updated!");

      console.log("updating book...");
      const bookRef = getBooksRef(id);
      await updateDoc(bookRef, {
        volumes: bookDownloadInfo.links.length,
      } as DocumentData);
      console.log("book updated!");
    } catch (error) {
      console.log(error);
    }
    setPageLoading(false);
  };

  const deleteBook = async (id: string) => {
    try {
      setPageLoading(true);
      console.log("deleting book...");
      const bookRef = getBooksRef(id);
      await deleteDoc(bookRef);
      console.log("book deleted!");

      console.log("deleting bookDownloads...");
      const bookDownloadRef = getBookDownloadsRef(id);
      await deleteDoc(bookDownloadRef);
      console.log("bookDownloads deleted!");

      // update stats:
      console.log("Updating Stats...");
      const statsRef = getStatsRef("stats");
      await updateDoc(statsRef, {
        booksCount: increment(-1),
      });
      console.log("Updated Stats");

      navigate(-1);
    } catch (error) {
      console.log(error);
    }
    setPageLoading(false);
    setIsDeleteBookConfirm(false);
  };

  const handleEditDownloadInfoBtn = async () => {
    if (!id) {
      console.log("Invalid ID!");
      return;
    }
    await getBookDownloadInfo(id);
    setIsEditDownloadInfoRevealed(true);
  };

  const handleChangeEPUBLink = (
    event: React.ChangeEvent<HTMLInputElement>,
    linkContext: string
  ) => {
    event.preventDefault();

    setBookDownloadInfo((prev) => {
      const res: linkType[] = [];
      prev.links.forEach((element) => {
        if (element.context === linkContext) {
          res.push({ ...element, epub_link: event.target.value });
        } else res.push(element);
      });
      return { ...prev, links: res };
    });
  };

  const handleChangePDFLink = (
    event: React.ChangeEvent<HTMLInputElement>,
    linkContext: string
  ) => {
    event.preventDefault();

    setBookDownloadInfo((prev) => {
      const res: linkType[] = [];
      prev.links.forEach((element) => {
        if (element.context === linkContext) {
          res.push({ ...element, pdf_link: event.target.value });
        } else res.push(element);
      });
      return { ...prev, links: res };
    });
  };

  const handleAddNewDownloadLink = () => {
    const link: linkType = {
      context: newLink.context.trim(),
      epub_link: newLink.epub_link.trim(),
      pdf_link: newLink.pdf_link.trim(),
    };

    // check if link already exists:
    let alreadyExists = false;
    bookDownloadInfo.links.map((ele) => {
      if (ele.context === link.context) {
        alreadyExists = true;
        return;
      }
    });

    // check exceptions:
    if (
      alreadyExists ||
      link.context.trim().length === 0 ||
      link.epub_link.trim().length === 0 ||
      link.pdf_link.trim().length === 0
    ) {
      console.log("Link Already Exists or Invalid Info!");
      return;
    }

    setBookDownloadInfo((prev) => ({ ...prev, links: [...prev.links, link] }));
    setNewLink({
      context: "",
      epub_link: "",
      pdf_link: "",
    });
  };

  const handleRemoveLink = (context: string) => {
    setBookDownloadInfo((prev) => ({
      ...prev,
      links: [...prev.links].filter((ele) => ele.context !== context),
    }));
  };

  useEffect(() => {
    // return back if no id:
    if (!id) {
      navigate("/control/manage");
    }

    // handle page loading animation:
    if (pageLoadingTimeoutRef.current !== null) {
      window.clearTimeout(pageLoadingTimeoutRef.current);
    }
    pageLoadingTimeoutRef.current = window.setTimeout(() => {
      setPageLoading(false);
    }, 1000);
  }, [navigate, id]);

  // show loading animation if something is loading:
  if (pageLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="manage-book-edit-container">
      <h2 className="title">{bookDownloadInfo.title || "Update Book"}</h2>

      {isEditDownloadInfoRevealed ? (
        <></>
      ) : (
        <>
          {/* UPDATE INFO LINK */}
          <div className="update-book-info-container">
            <div className="info-container">
              <h3 className="context">Info Link</h3>

              <div className="item">
                <input
                  placeholder="ex: https://something.com.."
                  type="text"
                  onChange={(event) => {
                    event.preventDefault();
                    setBookInfo((prev) => ({
                      ...prev,
                      info_link: event.target.value,
                    }));
                  }}
                />
              </div>
            </div>

            <button
              className="update-book-info-btn"
              onClick={async () => {
                if (!id) {
                  console.log("Invalid ID!");
                  return;
                }
                await updateBookInfo(id, "INFO");
              }}
            >
              Update
            </button>
          </div>

          {/* UPDATE COVER LINK AND SHADE */}
          <div className="update-book-info-container">
            <div className="info-container">
              <h3 className="context">Cover Link & Shade</h3>

              <div className="item">
                <input
                  placeholder="ex: https://something.com.."
                  type="text"
                  onChange={(event) => {
                    event.preventDefault();
                    setBookInfo((prev) => ({
                      ...prev,
                      cover_link: event.target.value,
                    }));
                  }}
                />
              </div>
              <div className="item">
                <input
                  placeholder="ex: #002302.."
                  type="text"
                  onChange={(event) => {
                    event.preventDefault();
                    setBookInfo((prev) => ({
                      ...prev,
                      cover_shade: event.target.value,
                    }));
                  }}
                />
              </div>
            </div>

            <button
              className="update-book-info-btn"
              onClick={async () => {
                if (!id) {
                  console.log("Invalid ID!");
                  return;
                }
                await updateBookInfo(id, "COVER");
              }}
            >
              Update
            </button>
          </div>
        </>
      )}

      {!isEditDownloadInfoRevealed ? (
        <button
          className="edit-download-info-btn"
          onClick={handleEditDownloadInfoBtn}
        >
          Edit Download Info
        </button>
      ) : (
        <div className="edit-download-info-container">
          {bookDownloadInfo.links.map((l) => (
            <div key={l.context} className="download-items-container">
              <div className="info-container">
                <h3 className="context">{l.context}</h3>

                {/* EPUB LINK */}
                <div className="link-item">
                  <label htmlFor="Epub Link">EPUB </label>
                  <input
                    placeholder="ex: https://something.com.."
                    type="text"
                    value={l.epub_link}
                    onChange={(event) => handleChangeEPUBLink(event, l.context)}
                  />
                </div>
                {/* PDF LINK */}
                <div className="link-item">
                  <label htmlFor="PDF">PDF </label>
                  <input
                    placeholder="ex: https://something.com.."
                    type="text"
                    value={l.pdf_link}
                    onChange={(event) => handleChangePDFLink(event, l.context)}
                  />
                </div>
              </div>
              <button
                className="remove-link-btn"
                onClick={(e) => {
                  e.preventDefault();
                  handleRemoveLink(l.context);
                }}
              >
                Remove
              </button>
            </div>
          ))}

          {/* New LINK */}
          <div className="add-new-link-container">
            <h3 className="context">Add New Link</h3>

            <div className="new-link-item">
              <label htmlFor="Context">Context </label>
              <input
                placeholder="ex: Volume 1.."
                type="text"
                value={newLink.context}
                onChange={(event) => {
                  event.preventDefault();
                  setNewLink((prev) => ({
                    ...prev,
                    context: event.target.value,
                  }));
                }}
              />
            </div>

            {/* EPUB LINK */}
            <div className="new-link-item">
              <label htmlFor="EPUB">EPUB </label>
              <input
                placeholder="ex: https://something.com.."
                type="text"
                value={newLink.epub_link}
                onChange={(event) => {
                  event.preventDefault();
                  setNewLink((prev) => ({
                    ...prev,
                    epub_link: event.target.value,
                  }));
                }}
              />
            </div>

            {/* PDF LINK */}
            <div className="new-link-item">
              <label htmlFor="PDF">PDF </label>
              <input
                placeholder="ex: https://something.com.."
                type="text"
                value={newLink.pdf_link}
                onChange={(event) => {
                  event.preventDefault();
                  setNewLink((prev) => ({
                    ...prev,
                    pdf_link: event.target.value,
                  }));
                }}
              />
            </div>
          </div>

          <div className="update-btn-container">
            <button
              className="add-download-link-btn"
              onClick={handleAddNewDownloadLink}
            >
              Add Link
            </button>
            <button
              className="update-download-info-btn"
              onClick={async () => {
                if (!id) {
                  console.log("Invalid Id!");
                  return;
                }
                await updateBookDownloadInfo(id);
              }}
            >
              Update Info
            </button>
          </div>
        </div>
      )}

      <button
        className="delete-book-btn"
        onClick={async () => {
          if (!id) {
            console.log("Invalid ID!");
            return;
          }
          if (!isDeleteBookConfirm) {
            setIsDeleteBookConfirm(true);
            return;
          }
          await deleteBook(id);
        }}
      >
        {isDeleteBookConfirm ? "Sure?" : "Delete Book"}
      </button>
    </div>
  );
};

export default ManageBookEdit;
