import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { increment } from "firebase/firestore";
import { isAllowedSourceLink } from "../../utility/commonFunctions";
import "./styles/ManageBookEdit.css";
import LoadingAnimation from "../../components/LoadingAnimation";
import ErrorToast from "../../components/ErrorToast";
import SuccessToast from "../../components/SuccessToast";
import useGetDoc from "../../hooks/useGetDoc";
import useUpdateDoc from "../../hooks/useUpdateDoc";
import useDeleteDoc from "../../hooks/useDeleteDoc";

interface BookInfo { cover_link: string; cover_shade: string; info_link: string; volumes?: number; title?: string; }

const ManageBookEdit: React.FC = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isDeleteBookConfirm, setIsDeleteBookConfirm] = useState(false);
  const [bookInfo, setBookInfo] = useState<BookInfo>({ cover_link: "", cover_shade: "", info_link: "" });
  const [volumeInput, setVolumeInput] = useState("0");
  const id = useParams().id?.split("===")[1];
  const navigate = useNavigate();
  const deleteBookConfirmTimeoutRef = useRef<number | null>(null);
  const [getBookInfo, loadedBookInfo, isBookInfoLoading] = useGetDoc();
  const [updateBookInfo, isUpdateBookInfoLoading] = useUpdateDoc();
  const [deleteData, isDeleteDataLoading] = useDeleteDoc();
  const [updateStats, isUpdateStatsLoading] = useUpdateDoc();

  useEffect(() => {
    if (!id) { navigate("/control/manage"); return; }
    getBookInfo("books", id);
    const timeout = window.setTimeout(() => setIsPageLoading(false), 1000);
    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  useEffect(() => {
    setBookInfo({ cover_link: loadedBookInfo.cover_link || "", cover_shade: loadedBookInfo.cover_shade || "", info_link: loadedBookInfo.info_link || "", volumes: loadedBookInfo.volumes, title: loadedBookInfo.title });
    if (loadedBookInfo.title) setVolumeInput(String(loadedBookInfo.volumes ?? 0));
  }, [loadedBookInfo]);

  useEffect(() => {
    if (!isDeleteBookConfirm) return;
    deleteBookConfirmTimeoutRef.current = window.setTimeout(() => setIsDeleteBookConfirm(false), 1000);
    return () => { if (deleteBookConfirmTimeoutRef.current) window.clearTimeout(deleteBookConfirmTimeoutRef.current); };
  }, [isDeleteBookConfirm]);

  const handleUpdateBookInfo = async (context: "COVER" | "INFO") => {
    if (!id) return;
    if (context === "INFO") {
      if (!isAllowedSourceLink(bookInfo.info_link)) { setErrorMsg("Invalid Info Link!"); return; }
      await updateBookInfo("books", id, { info_link: bookInfo.info_link.trim() });
    } else {
      if (!bookInfo.cover_link.trim() || !bookInfo.cover_shade.trim()) { setErrorMsg("Invalid Cover Link!"); return; }
      await updateBookInfo("books", id, { cover_link: bookInfo.cover_link, cover_shade: bookInfo.cover_shade });
    }
  };

  const handleUpdateVolumes = async () => {
    const volumes = Number(volumeInput);
    if (!id || !Number.isInteger(volumes) || volumes < 0) { setErrorMsg("Invalid Volumes/Chapters!"); return; }
    try { await updateBookInfo("books", id, { volumes }); setSuccessMsg("Updated!"); } catch { setErrorMsg("Failed To Update!"); }
  };

  const handleDeleteBook = async () => {
    try { await deleteData("books", id); await updateStats("stats", "stats", { booksCount: increment(-1) }); navigate(-1); } catch { setErrorMsg("Failed To Delete Book!"); }
    setIsDeleteBookConfirm(false);
  };

  if (isPageLoading || isBookInfoLoading || isUpdateBookInfoLoading || isDeleteDataLoading || isUpdateStatsLoading) return <LoadingAnimation />;
  return <div className="manage-book-edit-container"><h2 className="title">{bookInfo.title || "Update Book"}</h2><ErrorToast message={errorMsg} setMessage={setErrorMsg} /><SuccessToast message={successMsg} setMessage={setSuccessMsg} />
    <div className="update-book-info-container"><div className="info-container"><h3 className="context">Info Link</h3><div className="item"><input placeholder="ex: https://something.com.." value={bookInfo.info_link} onChange={(e) => setBookInfo((prev) => ({ ...prev, info_link: e.target.value }))} /></div></div><button className="update-book-info-btn" onClick={() => handleUpdateBookInfo("INFO")}>Update</button></div>
    <div className="update-book-info-container"><div className="info-container"><h3 className="context">Cover Link & Shade</h3><div className="item"><input placeholder="ex: https://something.com.." value={bookInfo.cover_link} onChange={(e) => setBookInfo((prev) => ({ ...prev, cover_link: e.target.value }))} /></div><div className="item"><input placeholder="ex: #002302.." value={bookInfo.cover_shade} onChange={(e) => setBookInfo((prev) => ({ ...prev, cover_shade: e.target.value }))} /></div></div><button className="update-book-info-btn" onClick={() => handleUpdateBookInfo("COVER")}>Update</button></div>
    <div className="update-book-info-container"><div className="info-container"><h3 className="context">Volumes/Chapters</h3><div className="item"><input type="number" min="0" step="1" value={volumeInput} onChange={(e) => setVolumeInput(e.target.value)} /></div></div><button className="update-book-info-btn" onClick={handleUpdateVolumes}>Update</button></div>
    <button className="delete-book-btn" onClick={() => isDeleteBookConfirm ? handleDeleteBook() : setIsDeleteBookConfirm(true)}>{isDeleteBookConfirm ? "Sure?" : "Delete Book"}</button>
  </div>;
};

export default ManageBookEdit;
