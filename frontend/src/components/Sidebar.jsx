import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();

  const freelancerMenu = [
    { name: "Dashboard", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: "Proposals", path: "/proposals" }, // ✅ freelancer only
    { name: "Contracts", path: "/contracts" },
    { name: "Messages", path: "/messages" },
    { name: "Reviews", path: "/reviews" },
  ];

  const clientMenu = [
    { name: "Dashboard", path: "/client/dashboard" },
    { name: "Projects", path: "/projects" },
    // ❌ NO PROPOSALS HERE
    { name: "Contracts", path: "/contracts" },
    { name: "Messages", path: "/messages" },
  ];

  const menu =
    user?.role === "client" ? clientMenu : freelancerMenu;

  return (
    <aside className="w-64 bg-white shadow-lg">
      <div className="p-6 text-2xl font-bold text-indigo-600">
        TalentLink
      </div>

      <nav className="px-4 space-y-1">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end
            className={({ isActive }) =>
              `block rounded-lg px-4 py-2 ${
                isActive
                  ? "bg-indigo-100 text-indigo-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
