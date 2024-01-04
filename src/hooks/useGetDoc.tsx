import { useState } from "react";
import { getDoc, DocumentData } from "firebase/firestore";
import { getRef } from "../config/firebase";

const useGetDoc = () => {
  const [data, setData] = useState<DocumentData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | unknown>("");

  const getData = async (collectionName: string, id: string | undefined) => {
    if (!id) {
      setError("Invalid Id!");
      return;
    }

    try {
      setIsLoading(true);
      setData({});
      const docRef = getRef(collectionName, id);
      const docSnapshot = await getDoc(docRef);
      const res = docSnapshot.data();

      if (res !== undefined) setData(res);
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  return [getData, data, isLoading, error, setData] as const;
};

export default useGetDoc;
