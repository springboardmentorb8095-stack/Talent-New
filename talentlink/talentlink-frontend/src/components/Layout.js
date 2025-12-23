// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { Link } from "react-router-dom";

// const Layout = ({ children }) => {
//   const { user, logout } = useContext(AuthContext);

//   return (
//     <div>
//       <header style={{ padding: "1rem", backgroundColor: "#eee" }}>
//         {user ? (
//           <>
//             <Link to="/dashboard" style={{ marginRight: 16 }}>Dashboard</Link>
//             <button onClick={logout}>Logout</button>
//           </>
//         ) : (
//           <>
//             <Link to="/" style={{ marginRight: 16 }}>Login</Link>
//             <Link to="/register">Register</Link>
//           </>
//         )}
//       </header>

//       <main style={{ padding: "2rem" }}>{children}</main>
//     </div>
//   );
// };

// export default Layout;
