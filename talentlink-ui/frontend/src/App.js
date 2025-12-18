import { useState } from "react";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import "./styles.css";

function App() {
  const [page, setPage] = useState("landing");

  return (
    <>
      {page === "landing" && <Landing setPage={setPage} />}
      {page === "login" && <Login setPage={setPage} />}
      {page === "register" && <Register setPage={setPage} />}
      {page === "otp" && <VerifyOTP setPage={setPage} />}
      {page === "forgot" && <ForgotPassword setPage={setPage} />}
      {page === "profile" && <Profile />}
    </>
  );
}

export default App;
