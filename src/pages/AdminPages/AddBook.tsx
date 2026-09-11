import { useState } from "react";
import { v4 as uuid4 } from "uuid";
import { serverTimestamp, arrayUnion, increment } from "firebase/firestore";
import { removeDuplicateItemsFromArray, removeEmptyStringsFromArray, isAllowedSourceLink } from "../../utility/commonFunctions";
import "./styles/AddBook.css";
import LoadingAnimation from "../../components/LoadingAnimation";
import ErrorToast from "../../components/ErrorToast";
import SuccessToast from "../../components/SuccessToast";
import useUpdateDoc from "../../hooks/useUpdateDoc";
import useSetDoc from "../../hooks/useSetDoc";

type BookInfo = {
  title: string; author: string; synopsis: string; published: string; status: string;
  volumes: number; genres: string; views: number; info_link: string; cover_link: string;
  cover_shade: string; searchme: string[]; createdAt: unknown;
};

const initialBook: BookInfo = {
  title: "", author: "", synopsis: "", published: "", status: "", volumes: 0,
  genres: "", views: 0, info_link: "", cover_link: "", cover_shade: "",
  searchme: [], createdAt: serverTimestamp(),
};

const AddBook: React.FC = () => {
  const [successMsg, setSuccessMsg] = useState("");
  const [bookInfo, setBookInfo] = useState<BookInfo>(initialBook);
  const [volumeInput, setVolumeInput] = useState("0");
  const [setDoc, isSetDocLoading, setDocError, setSetDocError] = useSetDoc();
  const [updateStats, isUpdateStatsLoading] = useUpdateDoc();

  const handleBookSubmit = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const volumes = Number(volumeInput);
    if (!bookInfo.title || !bookInfo.author || !bookInfo.synopsis || !bookInfo.published || !bookInfo.status) {
      setSetDocError("Invalid Info!"); return;
    }
    if (!Number.isInteger(volumes) || volumes < 0 || !isAllowedSourceLink(bookInfo.info_link)) {
      setSetDocError(!isAllowedSourceLink(bookInfo.info_link) ? "Invalid Info Link!" : "Invalid Volumes/Chapters!"); return;
    }
    const bookData = {
      ...bookInfo,
      title: bookInfo.title.trim(), author: bookInfo.author.trim(), synopsis: bookInfo.synopsis.trim().slice(0, 310),
      published: bookInfo.published.trim(), status: bookInfo.status.trim(), volumes,
      genres: bookInfo.genres.trim(), info_link: bookInfo.info_link.trim(), cover_link: bookInfo.cover_link.trim(), cover_shade: bookInfo.cover_shade.trim(),
      searchme: removeEmptyStringsFromArray(removeDuplicateItemsFromArray([
        ...bookInfo.title.trim().toLowerCase().replace(/[^a-z0-9\s]/g, "").split(" ").filter(Boolean),
        bookInfo.published.trim(), ...bookInfo.genres.trim().toLowerCase().split(", "), bookInfo.status.trim().toLowerCase(), ...bookInfo.author.trim().toLowerCase().split(" "),
      ])),
    };
    try {
      const id = uuid4();
      await setDoc("books", id, bookData);
      await updateStats("stats", "stats", { booksCount: increment(1) });
      await updateStats("stats", "genres", { genres: arrayUnion(...removeEmptyStringsFromArray(removeDuplicateItemsFromArray(bookInfo.genres.trim().toLowerCase().split(", ")))) });
      setSetDocError(""); setSuccessMsg("Book Added!");
    } catch { setSuccessMsg(""); setSetDocError("Failed To Add Book!"); }
    setBookInfo(initialBook); setVolumeInput("0");
  };

  if (isSetDocLoading || isUpdateStatsLoading) return <LoadingAnimation />;
  const fields: Array<[keyof BookInfo, string, string]> = [
    ["title", "Title*", "book title.."], ["author", "Author*", "author name.."], ["published", "Published*", "ex: 2023.."],
    ["status", "Status*", "ex: ongoing.."], ["genres", "Genres", "ex: comedy, school life, sci-fi.."], ["info_link", "Info Link", "ex: https://something.com.."],
    ["cover_link", "Cover Link", "ex: https://something.com.."], ["cover_shade", "Cover Shade", "ex: #ff7f38.."],
  ];
  return <section className="add-book-page"><h1 className="title">Add Book</h1><ErrorToast message={setDocError} setMessage={setSetDocError} /><SuccessToast message={successMsg} setMessage={setSuccessMsg} /><div className="form-container">
    {fields.slice(0, 2).map(([field, label, placeholder]) => <div className="item" key={field}><label htmlFor={field}>{label}</label><input id={field} placeholder={placeholder} value={bookInfo[field] as string} onChange={(e) => setBookInfo((prev) => ({ ...prev, [field]: e.target.value }))} /></div>)}
    <div className="item"><label htmlFor="synopsis">Synopsis*</label><textarea id="synopsis" placeholder="short description.." value={bookInfo.synopsis} onChange={(e) => setBookInfo((prev) => ({ ...prev, synopsis: e.target.value }))} rows={4} /></div>
    {fields.slice(2).map(([field, label, placeholder]) => <div className="item" key={field}><label htmlFor={field}>{label}</label><input id={field} placeholder={placeholder} value={bookInfo[field] as string} onChange={(e) => setBookInfo((prev) => ({ ...prev, [field]: e.target.value }))} /></div>)}
    <div className="item"><label htmlFor="volumes">Volumes/Chapters</label><input id="volumes" type="number" min="0" step="1" value={volumeInput} onChange={(e) => setVolumeInput(e.target.value)} /></div>
  </div><button className="book-submit-btn" onClick={handleBookSubmit}>Submit Book</button></section>;
};

export default AddBook;
