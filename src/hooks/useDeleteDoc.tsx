import { useState } from "react";
import { deleteDoc } from "firebase/firestore";
import { getRef } from "../config/firebase";

const useDeleteDoc = () => {
  // STATES:
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | unknown>("");

  const deleteData = async (collectionName: string, id: string | undefined) => {
    if (!id) {
      setError("Invalid Id!");
      return;
    }

    try {
      setIsLoading(true);
      const docRef = getRef(collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  return [deleteData, isLoading, error] as const;
};

export default useDeleteDoc;
