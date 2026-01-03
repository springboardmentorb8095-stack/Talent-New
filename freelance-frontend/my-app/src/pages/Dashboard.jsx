import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to Dashboard!</h1>

      {user ? (
        <>
          <p>You are logged in as <b>{user.username}</b></p>
          <button onClick={logoutUser}>Logout</button>
        </>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
};

export default Dashboard;

