import {
  DocumentData,
  Query,
  QuerySnapshot,
  getDocs,
} from "firebase/firestore";
import { useState } from "react";

const useGetDocs = () => {
  // STATES:
  const [data, setData] = useState<DocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const getData = async (
    query: Query<DocumentData, DocumentData>,
    filterDocs: (
      snapshot: QuerySnapshot<DocumentData, DocumentData>
    ) => DocumentData[]
  ) => {
    try {
      setIsLoading(true);
      setData([]);
      const docSnapshot = await getDocs(query);
      const res = filterDocs(docSnapshot);

      if (res.length > 0) setData(res);
    } catch (error) {
      if (error instanceof Error) setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return [getData, data, isLoading, error, setError] as const;
};

export default useGetDocs;
