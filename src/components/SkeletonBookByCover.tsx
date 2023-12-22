import React from "react";

// assets:
import BookLoadingGif from "../assets/bookLoading.gif";

const dummyBook = {
  id: "",
  title: "",
  cover_link: BookLoadingGif,
  cover_shade: "",
  views: 0,
};

const SkeletonBookByCover: React.FC = () => {
  return (
    <div key={dummyBook.id} className="cover-container loading">
      <img className="cover" src={dummyBook.cover_link} alt={dummyBook.title} />
      <div className="overlay1"></div>
    </div>
  );
};

export default SkeletonBookByCover;
