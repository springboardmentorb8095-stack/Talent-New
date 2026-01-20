import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";


export default function ContractDetail() {
  const { user } = useAuth();
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
   const { contractId } = useParams();
  // const [contract, setContract] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axiosInstance
      .get(`/contracts/${id}/`)
      .then(res => setContract(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));

    const fetchContract = async () => {
      try {
        const res = await axiosInstance.get("/contracts/my-contracts/");
        const c = res.data.find((x) => x.id === parseInt(id));
        setContract(c);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchContract();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    if (!contract) return;

    setUpdating(true);
    setMessage("");

    try {
      const res = await axiosInstance.patch(
        `/contracts/${contract.id}/status/`,
        { status: newStatus }
      );
      setContract((prev) => ({ ...prev, status: res.data.status }));
      setMessage(`Contract ${newStatus} successfully.`);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p>Loading contract...</p>;
  if (!contract) return <p>Contract not found.</p>;

  const isClient = user.role === "client";
  const isFreelancer = user.role === "freelancer";


  return (
    <div style={{ padding: "20px" }} className="list-card">
    <h2>Contract: {contract.project_title}</h2>
      <p>
        <b>Client:</b> {contract.client} | <b>Freelancer:</b> {contract.freelancer}
      </p>
      <p>
        <b>Start:</b> {contract.start_date} | <b>End:</b> {contract.end_date}
      </p>
      <p>
        <b>Status:</b> {contract.status}
      </p>

      {contract.status === "active" && (
        <div style={{ marginTop: "10px" }}>
          {isClient && (
            <button
              onClick={() => handleStatusChange("completed")}
              disabled={updating}
            >
              {updating ? "Updating..." : "Mark as Completed"}
            </button>
          )}

          {isFreelancer && (
            <button
              onClick={() => handleStatusChange("cancelled")}
              disabled={updating}
            >
              {updating ? "Updating..." : "Cancel Contract"}
            </button>
          )}
        </div>
      )}

      {message && <p style={{ marginTop: "10px" }}>{message}</p>}

      {contract.status === "completed" && user.role === "client" && !contract.review && (
        <div style={{ marginTop: "10px" }}>
          <a href={`/contracts/${contract.id}/review`}>Leave Review</a>
        </div>
      )}

      {contract.status === "completed" && contract.review && (
        <p style={{ marginTop: "10px" }}>Review Submitted ✔</p>
      )}

      <div style={{ marginTop: "20px" }}>
        <a href={`/messages/${contract.id}/`} disabled={contract.status==="completed"}>Go to Chat</a>
      </div>
    </div>
  );
}