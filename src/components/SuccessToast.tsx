import { useState, useEffect, useRef, SetStateAction } from "react";

import "./styles/SuccessToast.css";

// TYPES:
type propType = {
  message: string;
  setMessage: React.Dispatch<SetStateAction<string>>;
};

const ErrorToast: React.FC<propType> = ({ message, setMessage }) => {
  // STATES:
  const [isVisible, setIsVisible] = useState(false);

  // REFS:
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    if (message?.length) {
      setIsVisible(true);
      timeoutRef.current = window.setTimeout(() => {
        setIsVisible(false);
        setMessage("");
      }, 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  return isVisible ? (
    <div className="error-toast-container">
      <p className="error-text">{message}</p>
    </div>
  ) : (
    <></>
  );
};

export default ErrorToast;
