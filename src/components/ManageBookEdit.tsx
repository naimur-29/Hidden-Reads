import React from "react";
import { useParams } from "react-router-dom";
// import { getDoc, deleteDoc, updateDoc } from "firebase/firestore";
// import { db, getBooksRef, getBookDownloadsRef } from "../config/firebase";

const ManageBookEdit: React.FC = () => {
  // HOOKS:
  const { id } = useParams();

  return <h3>Book ID: {id}</h3>;
};

export default ManageBookEdit;
