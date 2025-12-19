import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import "./App.css";

function App() {
  const [page, setPage] = useState("login");

  return (
    <div className="auth-container">
      <div className="auth-card">
        {page === "login" && <Login setPage={setPage} />}
        {page === "register" && <Register setPage={setPage} />}
        {page === "forgot" && <ForgotPassword setPage={setPage} />}
      </div>
    </div>
  );
}

export default App;




