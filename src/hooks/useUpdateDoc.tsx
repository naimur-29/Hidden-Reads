import { useState } from "react";
import { updateDoc, DocumentData } from "firebase/firestore";
import { getRef } from "../config/firebase";

const useUpdateDoc = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | unknown>("");

  const update = async (
    collectionName: string,
    id: string | undefined,
    updatedData: DocumentData
  ) => {
    if (!id) {
      setError("Invalid Id!");
      return;
    }

    try {
      setIsLoading(true);
      const docRef = getRef(collectionName, id);
      await updateDoc(docRef, updatedData);
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  return [update, isLoading, error] as const;
};

export default useUpdateDoc;
