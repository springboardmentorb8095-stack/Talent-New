


import React, { useState } from "react";
import { Box, Typography, Card, CardContent, Button, TextField, Rating, Alert } from "@mui/material";
import api from "../services/api";

const ReviewForm = ({ contractId, onReviewSubmitted, submittedReview }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // If review already exists → show it
  if (submittedReview || success) {
    return (
      <Card sx={{ mt: 2, borderRadius: 3, background: "rgba(15,46,53,0.85)" }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: "#EAF6F7" }}>
            Review Submitted
          </Typography>

          {submittedReview && (
            <>
              <Alert
                severity="success"
                sx={{
                  mb: 3,
                  backgroundColor: "rgba(46, 125, 50, 0.35)",
                  color: "#C8E6C9",
                  border: "1px solid #4CAF50",
                  "& .MuiAlert-icon": { color: "#81C784" },
                }}
              >
                Review by <strong>{submittedReview.reviewer.username}</strong>!
              </Alert>

              <Typography variant="body2" sx={{ color: "#A0C4C9", mb: 1 }}>
                Rating:
              </Typography>
              <Rating
                value={submittedReview.rating}
                readOnly
                precision={1}
                sx={{
                  "& .MuiRating-iconFilled": { color: "#FFD700" },
                  "& .MuiRating-iconEmpty": { color: "#FFD70033" },
                }}
              />

              {submittedReview.comment && (
                <>
                  <Typography variant="body2" sx={{ color: "#A0C4C9", mt: 2, mb: 1 }}>
                    Comment:
                  </Typography>
                  <Typography color="#EAF6F7">"{submittedReview.comment}"</Typography>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }

    setLoading(true);

    api
      .post(`/reviews/add/${contractId}/`, { rating, comment })
      .then((res) => {
        setSuccess(true);
        setRating(0);
        setComment("");
        onReviewSubmitted?.(); // refresh contracts/reviews
      })
      .catch(() => alert("Failed to submit review."))
      .finally(() => setLoading(false));
  };

  return (
    <Card sx={{ mt: 2, borderRadius: 3, background: "rgba(15,46,53,0.85)" }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: "#EAF6F7" }}>
          Add Review
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Typography sx={{ color: "#A0C4C9" }}>Rating:</Typography>
          <Rating
            name={`rating-${contractId}`}
            value={rating}
            onChange={(e, newValue) => setRating(newValue)}
            precision={1}
            sx={{ color: "#FFD700" }}
          />
        </Box>

        <TextField
          label="Comment (optional)"
          variant="outlined"
          fullWidth
          multiline
          minRows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              color: "#EAF6F7",
              backgroundColor: "rgba(15,46,53,0.9)",
              "& fieldset": { borderColor: "#5E9FA6" },
              "&:hover fieldset": { borderColor: "#2F6F78" },
              "&.Mui-focused fieldset": { borderColor: "#5E9FA6" },
            },
            "& .MuiInputLabel-root": { color: "#A0C4C9", "&.Mui-focused": { color: "#5E9FA6" } },
          }}
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          fullWidth
          sx={{
            backgroundColor: "#5E9FA6",
            "&:hover": { backgroundColor: "#2F6F78" },
            "&:disabled": { backgroundColor: "#3A5F65", color: "#8AA8AD" },
          }}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
