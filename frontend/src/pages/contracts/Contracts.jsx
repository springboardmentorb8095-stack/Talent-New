import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";

export default function Contracts() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await api.get("/contracts/");
        setContracts(res.data);
      } catch (err) {
        setError("Failed to load contracts");
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  const updateContract = async (contractId, payload) => {
    try {
      await api.patch(`/contracts/${contractId}/`, payload);
    } catch (err) {
      alert(err.response?.data?.detail || "Action failed");
    }
  };

  const handleProgressChange = (id, value) => {
    setContracts((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, progress: value } : c
      )
    );
  };

  const handleProgressSubmit = async (contract) => {
    await updateContract(contract.id, {
      action: "progress",
      progress: contract.progress,
    });
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this contract?")) return;

    await updateContract(id, { action: "cancel" });

    setContracts((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, is_active: false } : c
      )
    );
  };

  const handleComplete = async (id) => {
    if (!window.confirm("Mark contract as completed?")) return;

    await updateContract(id, { action: "complete" });

    setContracts((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, is_active: false } : c
      )
    );
  };

  if (loading) return <p>Loading contracts...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Contracts</h2>

      {contracts.length === 0 ? (
        <p className="text-gray-500">No contracts found.</p>
      ) : (
        <div className="space-y-5">
          {contracts.map((contract) => (
            <div
              key={contract.id}
              className="bg-white p-6 rounded shadow"
            >
              <h3 className="text-lg font-semibold">
                {contract.project}
              </h3>

              <div className="mt-2 text-sm text-gray-600 space-y-1">
                {user?.role === "client" ? (
                  <p>
                    Freelancer:{" "}
                    <span className="font-medium">
                      {contract.freelancer}
                    </span>
                  </p>
                ) : (
                  <p>
                    Client:{" "}
                    <span className="font-medium">
                      {contract.client}
                    </span>
                  </p>
                )}

                <p>
                  Status:{" "}
                  <span className="font-medium">
                    {contract.is_active ? "Active" : "Closed"}
                  </span>
                </p>
              </div>

              {/* PROGRESS */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{contract.progress}%</span>
                </div>

                <div className="w-full bg-gray-200 rounded h-3">
                  <div
                    className="bg-indigo-600 h-3 rounded"
                    style={{
                      width: `${contract.progress}%`,
                    }}
                  />
                </div>
              </div>

              {/* FREELANCER: UPDATE PROGRESS */}
              {user?.role === "freelancer" &&
                contract.is_active && (
                  <div className="mt-4 flex items-center gap-3">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={contract.progress}
                      onChange={(e) =>
                        handleProgressChange(
                          contract.id,
                          Number(e.target.value)
                        )
                      }
                      className="w-24 p-1 border rounded"
                    />

                    <button
                      onClick={() =>
                        handleProgressSubmit(contract)
                      }
                      className="px-3 py-1 bg-indigo-600 text-white rounded"
                    >
                      Update %
                    </button>
                  </div>
                )}

              {/* ACTIONS */}
              {contract.is_active && (
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() =>
                      handleCancel(contract.id)
                    }
                    className="px-4 py-2 bg-red-600 text-white rounded"
                  >
                    Cancel
                  </button>

                  {user?.role === "client" &&
                    contract.progress === 100 && (
                      <button
                        onClick={() =>
                          handleComplete(contract.id)
                        }
                        className="px-4 py-2 bg-green-600 text-white rounded"
                      >
                        Mark Completed
                      </button>
                    )}
                </div>
              )}

              {/* CLIENT: LEAVE REVIEW */}
              {!contract.is_active &&
                user?.role === "client" &&
                !contract.review && (
                  <button
                    onClick={() =>
                      navigate(
                        `/reviews/create/${contract.id}`
                      )
                    }
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
                  >
                    Leave Review
                  </button>
                )}

              {!contract.is_active && (
                <p className="mt-4 text-green-600 font-medium">
                  Contract closed
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
