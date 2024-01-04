import { useState } from "react";
import { setDoc, DocumentData } from "firebase/firestore";
import { getRef } from "../config/firebase";

const useSetDoc = () => {
  // STATES:
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const add = async (
    collectionName: string,
    id: string | undefined,
    data: DocumentData
  ) => {
    if (!id) {
      setError("Invalid ID!");
      return;
    }

    try {
      setIsLoading(true);
      const docRef = getRef(collectionName, id);
      await setDoc(docRef, data);
    } catch (error) {
      if (error instanceof Error) setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return [add, isLoading, error, setError] as const;
};

export default useSetDoc;
