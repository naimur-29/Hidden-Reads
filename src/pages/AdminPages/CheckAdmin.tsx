import React, { ReactNode, useEffect, useRef, useState } from "react";
import { getDoc } from "firebase/firestore";
import { getStatsRef } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import LoadingAnimation from "../../components/LoadingAnimation";

// TYPES:
interface propType {
  children: ReactNode;
}

const CheckAdmin: React.FC<propType> = ({ children }) => {
  // STATES:
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  // HOOKS:
  const firstLoadRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getAdmins = async () => {
      const hash = window.localStorage.getItem("control");
      if (!hash) {
        navigate("/control");
        return;
      }

      try {
        setIsPageLoading(true);
        console.log("logging...");
        // get stats:
        const statsRef = getStatsRef("admin");
        const data = (await getDoc(statsRef)).data();

        if (data?.hashes.includes(hash)) {
          setIsAdmin(true);
        } else {
          const ref = window.setTimeout(() => {
            navigate("/control");
            window.clearTimeout(ref);
          }, 1000);
          window.localStorage.removeItem("control");
        }
      } catch (error) {
        console.log(error);
      }
      setIsPageLoading(false);
    };

    if (firstLoadRef.current === false) {
      getAdmins();
    }
    firstLoadRef.current = true;
  }, [navigate]);

  if (isAdmin) return <>{children}</>;
  if (isPageLoading) return <LoadingAnimation />;
};

export default CheckAdmin;
