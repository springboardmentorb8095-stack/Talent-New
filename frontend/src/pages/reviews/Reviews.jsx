import { useEffect, useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";

export default function Reviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!user) return;

    api
      .get(`/reviews/freelancer/${user.id}/`)
      .then((res) => setReviews(res.data));
  }, [user]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Reviews Received
      </h2>

      {reviews.length === 0 ? (
        <p className="text-gray-500">
          No reviews yet.
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-white p-5 rounded shadow"
            >
              <p className="font-medium">
                Rating: {r.rating} ⭐
              </p>
              {r.comment && (
                <p className="text-gray-700 mt-2">
                  {r.comment}
                </p>
              )}
              <p className="text-sm text-gray-400 mt-2">
                By {r.client_username}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
