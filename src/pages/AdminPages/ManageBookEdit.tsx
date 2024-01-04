import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DocumentData, increment } from "firebase/firestore";

import "./styles/ManageBookEdit.css";

// COMPONENTS:
import LoadingAnimation from "../../components/LoadingAnimation";
import ErrorToast from "../../components/ErrorToast";
import SuccessToast from "../../components/SuccessToast";

// HOOKS:
import useGetDoc from "../../hooks/useGetDoc";
import useUpdateDoc from "../../hooks/useUpdateDoc";
import useDeleteDoc from "../../hooks/useDeleteDoc";

// TYPES:
interface linkType {
  context: string;
  epub_link: string;
  pdf_link: string;
}

interface bookInfoType {
  cover_link: string;
  cover_shade: string;
  info_link: string;
}

const ManageBookEdit: React.FC = () => {
  // STATES:
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [newLink, setNewLink] = useState<linkType>({
    context: "",
    epub_link: "",
    pdf_link: "",
  });
  const [isEditDownloadInfoRevealed, setIsEditDownloadInfoRevealed] =
    useState(false);
  const [isDeleteBookConfirm, setIsDeleteBookConfirm] = useState(false);
  const [bookInfo, setBookInfo] = useState<bookInfoType>({
    cover_link: "",
    cover_shade: "",
    info_link: "",
  });

  // HOOKS:
  const deleteBookConfirmTimeoutRef = useRef<number | null>(null);
  const id = useParams().id?.split("===")[1];
  const navigate = useNavigate();
  const pageLoadingTimeoutRef = useRef<null | number>(null);
  const [updateBookInfo, isUpdateBookInfoLoading] = useUpdateDoc();
  const [
    getBookDownloadsInfo,
    bookDownloadsInfo,
    isBookDownloadsInfoLoading,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _bookDownloadsInfoError,
    setBookDownloadsInfo,
  ] = useGetDoc();
  const [updateBookDownloadsInfo, isUpdateBookDownloadsInfoLoading] =
    useUpdateDoc();
  const [deleteData, isDeleteDataLoading] = useDeleteDoc();
  const [updateStats, isUpdateStatsLoading] = useUpdateDoc();

  const handleUpdateBookInfo = async (id: string, context: string) => {
    let data;
    if (context === "COVER") {
      if (
        bookInfo.cover_link.trim().length === 0 ||
        bookInfo.cover_shade.trim().length === 0
      ) {
        setErrorMsg("Invalid Cover Link!");
        return;
      } else
        data = {
          cover_link: bookInfo.cover_link,
          cover_shade: bookInfo.cover_shade,
        };
    } else if (context === "INFO") {
      if (bookInfo.info_link.trim().length === 0) {
        setErrorMsg("Invalid Info Link!");
        return;
      } else
        data = {
          info_link: bookInfo.info_link,
        };
    }

    // update:
    await updateBookInfo("books", id, data as DocumentData);
  };

  const handleUpdateBookDownloadsInfo = async (id: string) => {
    setNewLink({
      context: "",
      epub_link: "",
      pdf_link: "",
    });

    try {
      await updateBookDownloadsInfo(
        "bookDownloads",
        id,
        bookDownloadsInfo as DocumentData
      );
      await updateBookInfo("books", id, {
        volumes: bookDownloadsInfo?.links?.length,
      } as DocumentData);

      setSuccessMsg("Updated!");
    } catch (error) {
      setErrorMsg("Failed To Update!");
    }
  };

  const handleDeleteBook = async () => {
    try {
      await deleteData("books", id);
      await deleteData("bookDownloads", id);
      // update stats:
      await updateStats("stats", "stats", {
        booksCount: increment(-1),
      });
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
    setIsDeleteBookConfirm(false);
  };

  const handleEditDownloadInfoBtn = async () => {
    await getBookDownloadsInfo("bookDownloads", id);
    setIsEditDownloadInfoRevealed(true);
  };

  const handleChangeEPUBLink = (
    event: React.ChangeEvent<HTMLInputElement>,
    linkContext: string
  ) => {
    event.preventDefault();

    setBookDownloadsInfo((prev) => {
      const res: linkType[] = [];
      prev.links.forEach((element: linkType) => {
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

    setBookDownloadsInfo((prev) => {
      const res: linkType[] = [];
      prev.links.forEach((element: linkType) => {
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
    bookDownloadsInfo?.links?.map((ele: linkType) => {
      if (ele.context === link.context) {
        alreadyExists = true;
        return;
      }
    });

    // check exceptions:
    if (
      alreadyExists ||
      link.context.length === 0 ||
      link.epub_link.length === 0 ||
      link.pdf_link.length === 0
    ) {
      setErrorMsg("Link Already Exists or Invalid Info!");
      return;
    }

    setBookDownloadsInfo((prev) => ({ ...prev, links: [...prev.links, link] }));
    setNewLink({
      context: "",
      epub_link: "",
      pdf_link: "",
    });
  };

  const handleRemoveLink = (context: string) => {
    setBookDownloadsInfo((prev) => ({
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
      setIsPageLoading(false);
    }, 1000);
  }, [navigate, id]);

  useEffect(() => {
    console.log("running...");

    if (deleteBookConfirmTimeoutRef.current) {
      window.clearTimeout(deleteBookConfirmTimeoutRef.current);
    }

    if (isDeleteBookConfirm) {
      deleteBookConfirmTimeoutRef.current = window.setTimeout(() => {
        setIsDeleteBookConfirm(false);
      }, 1000);
    }
  }, [isDeleteBookConfirm]);

  // show loading animation if something is loading:
  if (
    isPageLoading ||
    isUpdateBookInfoLoading ||
    isUpdateBookDownloadsInfoLoading ||
    isDeleteDataLoading ||
    isUpdateStatsLoading
  ) {
    return <LoadingAnimation />;
  }

  return (
    <div className="manage-book-edit-container">
      <h2 className="title">{bookDownloadsInfo?.title || "Update Book"}</h2>

      {/* ERROR TOAST */}
      <ErrorToast message={errorMsg} setMessage={setErrorMsg} />

      {/* SUCCESS TOAST */}
      <SuccessToast message={successMsg} setMessage={setSuccessMsg} />

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
                await handleUpdateBookInfo(id, "INFO");
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
                await handleUpdateBookInfo(id, "COVER");
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
          {isBookDownloadsInfoLoading ? "Loading..." : "Edit Download Info"}
        </button>
      ) : (
        <div className="edit-download-info-container">
          {bookDownloadsInfo?.links?.map((l: linkType) => (
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
                await handleUpdateBookDownloadsInfo(id);
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
          if (!isDeleteBookConfirm) {
            setIsDeleteBookConfirm(true);
            return;
          }
          await handleDeleteBook();
        }}
      >
        {isDeleteBookConfirm ? "Sure?" : "Delete Book"}
      </button>
    </div>
  );
};

export default ManageBookEdit;
