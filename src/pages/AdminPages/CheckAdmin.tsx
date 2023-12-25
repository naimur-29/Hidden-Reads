import React, { ReactNode, useEffect, useRef, useState } from "react";
import { getDoc } from "firebase/firestore";
import { getStatsRef } from "../../config/firebase";
import { useNavigate } from "react-router-dom";

// TYPES:
interface propType {
  children: ReactNode;
}

const CheckAdmin: React.FC<propType> = ({ children }) => {
  // STATES:
  const [isAdmin, setIsAdmin] = useState(false);

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
      console.log("logging...");

      const statsRef = getStatsRef("admin");
      // get stats:
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
    };

    if (firstLoadRef.current === false) {
      getAdmins();
    }
    firstLoadRef.current = true;
  }, [navigate]);

  if (isAdmin) return <>{children}</>;
};

export default CheckAdmin;
