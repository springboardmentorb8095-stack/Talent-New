import { useState } from "react";

/* ================= AUTH ================= */
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword";

/* ================= CORE ================= */
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Settings from "./pages/Settings";

/* ================= CLIENT ================= */
import CreateProject from "./pages/CreateProject";
import ProjectProposals from "./pages/ProjectProposals";
import EditProject from "./pages/EditProject"; // ✅ ADDED
import ClientProjectsForProposals from "./pages/ClientProjectsForProposals";

/* ================= FREELANCER ================= */
import ProjectFeed from "./pages/ProjectFeed";
import ProjectDetails from "./pages/ProjectDetails";
import SubmitProposal from "./pages/SubmitProposal";
import MyProposals from "./pages/MyProposals";

/* ================= WEEK 5 & 6 ================= */
import Contracts from "./pages/Contracts";
import Messages from "./pages/Messages";
import SubmitReview from "./pages/SubmitReview";
import LeaveReview from "./pages/LeaveReview";
import Notifications from "./pages/Notifications";

import "./styles.css";

function App() {
  const [page, setPage] = useState("landing");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedContractId, setSelectedContractId] = useState(null);

  return (
    <>
      {/* ================= AUTH FLOW ================= */}
      {page === "landing" && <Landing setPage={setPage} />}
      {page === "login" && <Login setPage={setPage} />}
      {page === "register" && <Register setPage={setPage} />}
      {page === "otp" && <VerifyOTP setPage={setPage} />}
      {page === "forgot" && <ForgotPassword setPage={setPage} />}

      {/* ================= DASHBOARD ================= */}
      {page === "dashboard" && (
        <Dashboard
          setPage={setPage}
          setSelectedProjectId={setSelectedProjectId}
        />
      )}

      {/* ================= SETTINGS ================= */}
      {page === "settings" && <Settings setPage={setPage} />}

      {/* ================= PROFILE ================= */}
      {page === "profile" && <Profile setPage={setPage} />}
      {page === "edit-profile" && <EditProfile setPage={setPage} />}

      {/* ================= CLIENT FLOW ================= */}
      {page === "create-project" && <CreateProject setPage={setPage} />}
      {page === "view-proposals" && (
  <ClientProjectsForProposals
    setPage={setPage}
    setSelectedProjectId={setSelectedProjectId}
  />
)}


      {page === "edit-project" && selectedProjectId && (
        <EditProject
          projectId={selectedProjectId}
          setPage={setPage}
        />
      )}

      {page === "project-proposals" && selectedProjectId && (
  <ProjectProposals
    projectId={selectedProjectId}
    setPage={setPage}
    setSelectedContractId={setSelectedContractId} // ✅ ADD
  />
)}



      {page === "leave-review" && <LeaveReview setPage={setPage} />}

      {/* ================= FREELANCER FLOW ================= */}
      {page === "project-feed" && (
        <ProjectFeed
          setPage={setPage}
          setSelectedProjectId={setSelectedProjectId}
        />
      )}

      {page === "project-details" && selectedProjectId && (
        <ProjectDetails
          projectId={selectedProjectId}
          setPage={setPage}
          setSelectedProjectId={setSelectedProjectId}
        />
      )}

      {page === "submit-proposal" && selectedProjectId && (
        <SubmitProposal
          projectId={selectedProjectId}
          setPage={setPage}
        />
      )}

      {page === "my-proposals" && <MyProposals setPage={setPage} />}

      {/* ================= CONTRACTS ================= */}
      {page === "contracts" && (
        <Contracts
          setPage={setPage}
          setSelectedContractId={setSelectedContractId}
        />
      )}

      {/* ================= REVIEWS ================= */}
      {page === "submit-review" && selectedContractId && (
        <SubmitReview
          contractId={selectedContractId}
          setPage={setPage}
        />
      )}

      {/* ================= NOTIFICATIONS ================= */}
      {page === "notifications" && <Notifications setPage={setPage} />}

      {/* ================= MESSAGES ================= */}
      {page === "messages" && <Messages setPage={setPage} />}
    </>
  );
}

export default App;
