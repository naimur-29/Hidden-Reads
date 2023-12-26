import React, { useState } from "react";
import { sha256 } from "js-sha256";

import "./styles/AdminLogin.css";
import { useNavigate } from "react-router-dom";

const Admin: React.FC = () => {
  // STATES:
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: "",
  });

  // HOOKS:
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!loginInfo.username || !loginInfo.password) {
      console.log("Invalid Info!");
      return;
    }

    const raw = loginInfo.username.trim() + "===" + loginInfo.password.trim();
    const hash = sha256(raw);
    window.localStorage.setItem("control", hash);

    setLoginInfo({
      username: "",
      password: "",
    });

    navigate("/control/manage");
  };

  return (
    <div className="admin-login-container">
      <div className="inner-container">
        <div className="input-field">
          <label htmlFor="Username">Username</label>
          <input
            type="text"
            value={loginInfo.username}
            onChange={(event) => {
              event.preventDefault();
              setLoginInfo((prev) => ({
                ...prev,
                username: event.target.value,
              }));
            }}
          />
        </div>

        <div className="input-field">
          <label htmlFor="Password">Password</label>
          <input
            type="password"
            value={loginInfo.password}
            onChange={(event) => {
              event.preventDefault();
              setLoginInfo((prev) => ({
                ...prev,
                password: event.target.value,
              }));
            }}
          />
        </div>

        <button className="login-btn" onClick={handleLogin}>
          Login/Logout
        </button>
      </div>
    </div>
  );
};

export default Admin;
