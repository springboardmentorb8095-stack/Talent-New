

// // import React, { useState, useEffect, useCallback } from "react";
// // import {
// //   Box,
// //   Typography,
// //   Card,
// //   CardContent,
// //   Grid,
// //   Button,
// //   Avatar,
// //   Chip,
// //   AppBar,
// //   Toolbar,
// //   // IconButton,
// //   FormControl,
// //   InputLabel,
// //   Select,
// //   MenuItem,
// //   Rating,
// //   TextField,
// //   Alert,
 
// // } from "@mui/material";
// // // import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// // import { useAuth } from "../context/AuthContext";
// // import { useNavigate } from "react-router-dom";
// // import api from "../services/api";




// // /* ================= REVIEW FORM / SUCCESS COMPONENT ================= */
// // const ReviewForm = ({ contractId, onReviewSubmitted, submittedReview }) => {
 
// //   const [rating, setRating] = useState(0);
// //   const [comment, setComment] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [success, setSuccess] = useState(false);
// //   const [newReview] = useState(null);

// //   // Combine existing review or newly submitted review
// //   const displayReview = submittedReview || newReview;

// //   // If review already exists → show success view
// //   if (submittedReview || success) {
// //     return (
// //       <Card sx={{ mt: 2, borderRadius: 3, background: "rgba(15,46,53,0.85)" }}>
// //         <CardContent>
// //           <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: "#EAF6F7" }}>
// //           Review Submitted
// //          {displayReview?.reviewer?.username && (
// //             <> by <strong>{displayReview.reviewer.username}</strong></>
// //         )}
// //         </Typography>

// //           <Alert
// //             severity="success"
// //             sx={{
// //               mb: 3,
// //               backgroundColor: "rgba(46, 125, 50, 0.35)",
// //               color: "#C8E6C9",
// //               border: "1px solid #4CAF50",
// //               "& .MuiAlert-icon": { color: "#81C784" },
// //             }}
// //           >
// //             Review Submitted Successfully!
            
// //           </Alert>

// //           {submittedReview && (
// //             <Box sx={{ mt: 2 }}>
// //               <Typography variant="body2" sx={{ color: "#A0C4C9", mb: 1 }}>
// //                 Your rating:
// //               </Typography>
// //               <Rating
// //                 value={submittedReview.rating}
// //                 readOnly
// //                 precision={1}
// //                 sx={{
// //                   "& .MuiRating-iconFilled": {
// //                     color: "#FFD700",
// //                     filter: "drop-shadow(0 0 3px #FFD70077)",
// //                   },
// //                   "& .MuiRating-iconEmpty": { color: "#FFD70033" },
// //                 }}
// //               />
// //               {submittedReview.comment && (
// //                 <>
// //                   <Typography variant="body2" sx={{ color: "#A0C4C9", mt: 2, mb: 1 }}>
// //                     Your comment:
// //                   </Typography>
// //                   <Typography color="#EAF6F7">
// //                     "{submittedReview.comment}"
// //                   </Typography>
// //                 </>
// //               )}
// //             </Box>
// //           )}
// //         </CardContent>
// //       </Card>
// //     );
// //   }

// //   const handleSubmit = () => {
// //     if (rating === 0) {
// //       alert("Please select a rating.");
// //       return;
// //     }

// //     setLoading(true);

// //     api
// //       .post(`/reviews/add/${contractId}/`, { rating, comment })
// //       .then(() => {
// //         setSuccess(true);
// //         setRating(0);
// //         setComment("");
// //         onReviewSubmitted?.(); // Trigger reload of contracts
// //       })
// //       .catch((err) => {
// //         console.error("Review submission failed:", err);
// //         alert("Failed to submit review. Please try again.");
// //       })
// //       .finally(() => setLoading(false));
// //   };

// //   return (
// //     <Card sx={{ mt: 2, borderRadius: 3, background: "rgba(15,46,53,0.85)" }}>
// //       <CardContent>
// //         <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: "#EAF6F7" }}>
// //           Add Your Review
// //         </Typography>

// //         <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
// //           <Typography sx={{ color: "#A0C4C9" }}>Rating:</Typography>
// //           <Rating
// //             name={`rating-${contractId}`}
// //             value={rating}
// //             onChange={(e, newValue) => setRating(newValue)}
// //             precision={1}
// //             icon={<span style={{ fontSize: "2rem" }}>★</span>}
// //             emptyIcon={<span style={{ fontSize: "2rem", opacity: 0.3 }}>★</span>}
// //             sx={{
// //               "& .MuiRating-iconFilled": {
// //                 color: "#FFD700",
// //                 filter: "drop-shadow(0 0 4px #FFD70088)",
// //               },
// //               "& .MuiRating-iconHover": {
// //                 color: "#FFEB3B",
// //                 filter: "drop-shadow(0 0 6px #FFEB3Baa)",
// //               },
// //               "& .MuiRating-iconEmpty": {
// //                 color: "#FFD70044",
// //               },
// //             }}
// //           />
// //         </Box>

// //         <TextField
// //           label="Comment (optional)"
// //           variant="outlined"
// //           fullWidth
// //           multiline
// //           minRows={3}
// //           value={comment}
// //           onChange={(e) => setComment(e.target.value)}
// //           sx={{
// //             mb: 3,
// //             "& .MuiOutlinedInput-root": {
// //               color: "#EAF6F7",
// //               backgroundColor: "rgba(10, 35, 42, 0.6)",
// //               borderRadius: 2,
// //               "& fieldset": { borderColor: "#5E9FA6" },
// //               "&:hover fieldset": { borderColor: "#7ABAC6" },
// //               "&.Mui-focused fieldset": {
// //                 borderColor: "#5E9FA6",
// //                 boxShadow: "0 0 0 1px #5E9FA650",
// //               },
// //             },
// //             "& .MuiInputLabel-root": {
// //               color: "#A0C4C9",
// //               "&.Mui-focused": { color: "#5E9FA6" },
// //             },
// //           }}
// //         />

// //         <Button
// //           variant="contained"
// //           onClick={handleSubmit}
// //           disabled={loading}
// //           fullWidth
// //           sx={{
// //             py: 1.5,
// //             backgroundColor: "#5E9FA6",
// //             "&:hover": { backgroundColor: "#2F6F78" },
// //             "&:disabled": {
// //               backgroundColor: "#3A5F65",
// //               color: "#8AA8AD",
// //             },
// //           }}
// //         >
// //           {loading ? "Submitting..." : "Submit Review"}
// //         </Button>
// //       </CardContent>
// //     </Card>
// //   );
// // };

// // /* ================= MAIN CONTRACTS PAGE ================= */
// // const ContractsPage = () => {
// //   const { user } = useAuth();
// //   const navigate = useNavigate();

// //   const [contracts, setContracts] = useState([]);
// //   const [acceptedProposals, setAcceptedProposals] = useState([]);
// //   const [selectedProposal, setSelectedProposal] = useState("");
// //   const [loading, setLoading] = useState(true);

// //   const isClient = user?.role === "client";
// //   const avatarLetter = user?.username?.[0]?.toUpperCase() || "U";

// //   const loadContracts = useCallback(() => {
// //     api
// //       .get("http://127.0.0.1:8000/api/contracts/my/")
// //       .then((res) => {
// //         const data = res.data.results || res.data || [];
// //         setContracts(data);
// //       })
// //       .catch((err) => console.error("Failed to fetch contracts:", err));
// //   }, []);

// //   const loadAcceptedProposals = useCallback(() => {
// //     if (!user || !isClient) {
// //       setLoading(false);
// //       return;
// //     }

// //     api
// //       .get("http://127.0.0.1:8000/api/projects/")
// //       .then((res) => {
// //         const projects = res.data.results || res.data || [];
// //         const proposalPromises = projects.map((project) =>
// //           api
// //             .get(`http://127.0.0.1:8000/api/proposals/projects/${project.id}/proposals/`)
// //             .then((res) => {
// //               const proposals = res.data.results || [];
// //               return proposals
// //                 .filter((p) => p.status.toLowerCase() === "accepted")
// //                 .map((p) => ({
// //                   ...p,
// //                   project_title: project.title,
// //                 }));
// //             })
// //             .catch(() => [])
// //         );

// //         Promise.all(proposalPromises)
// //           .then((allProposals) => {
// //             setAcceptedProposals(allProposals.flat());
// //             setLoading(false);
// //           })
// //           .catch(() => setLoading(false));
// //       })
// //       .catch(() => setLoading(false));
// //   }, [user, isClient]);

// //   useEffect(() => {
// //     loadContracts();
// //     loadAcceptedProposals();
// //   }, [loadContracts, loadAcceptedProposals]);

// //   const createContract = () => {
// //     if (!selectedProposal) return;

// //     api
// //       .post(`http://127.0.0.1:8000/api/contracts/create/${selectedProposal}/`)
// //       .then(() => {
// //         alert("Contract created successfully!");
// //         setSelectedProposal("");
// //         loadContracts();
// //         loadAcceptedProposals();
// //       })
// //       .catch(() => alert("Failed to create contract."));
// //   };

// //   const updateContractStatus = (contractId, status) => {
// //     api
// //       .patch(`http://127.0.0.1:8000/api/contracts/${contractId}/status/`, { status })
// //       .then(() => loadContracts())
// //       .catch(() => alert("Failed to update contract status."));
// //   };

// //   return (
// //     <>
// //       <AppBar position="static" elevation={0} sx={{ background: "#0B2228" }}>
// //         <Toolbar sx={{ justifyContent: "space-between" , py:1}}>
// //           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
// //             {/* <IconButton color="inherit" onClick={() => navigate("/dashboard")}>
// //               <ArrowBackIcon />
// //             </IconButton> */}
// //             {/* <Typography variant="h6" sx={{ fontWeight: "bold", color: "#5E9FA6" }}>
// //               My Contracts
// //             </Typography> */}
// //           </Box>

// //           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
// //             <Avatar sx={{  bgcolor: "#5E9FA6",
// //                 width: 48,
// //                 height: 48,
// //                 fontWeight: "bold",
// //                 fontSize: "1.4rem",
// //                 boxShadow: "0 0 15px rgba(94, 159, 166, 0.4)",}}>{avatarLetter}</Avatar>
// //             <Box>
// //               <Typography sx={{ color: "#EAF6F7" }}>{user?.username}</Typography>
// //               <Typography variant="caption" sx={{ color: "#A0C4C9" }}>
// //                 {user?.role?.toLowerCase()}
// //               </Typography>
// //             </Box>
           
// //           </Box>
// //         </Toolbar>
// //       </AppBar>

// //       <Box
// //         sx={{
// //           minHeight: "calc(100vh - 64px)",
// //           background: "linear-gradient(135deg, #0F2E35, #2F6F78)",
// //           p: 4,
// //         }}
// //       >
// //         {/* CLIENT: CREATE CONTRACT SECTION */}
// //         {isClient && (
// //           <Card sx={{ mb: 5, borderRadius: 3, background: "rgba(15,46,53,0.9)" }}>
// //             <CardContent sx={{ p: 4 }}>
// //               <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: "#EAF6F7" }}>
// //                 Create Contract
// //               </Typography>
// //               <Typography variant="body2" color="#A0C4C9" mb={3}>
// //                 Create a contract from an accepted proposal
// //               </Typography>

// //               {loading ? (
// //                 <Typography color="#A0C4C9">Loading accepted proposals...</Typography>
// //               ) : acceptedProposals.length === 0 ? (
// //                 <Typography color="#A0C4C9">No accepted proposals available.</Typography>
// //               ) : (
// //                 <Box sx={{ display: "flex", gap: 2, alignItems: "end" }}>
// //                   <FormControl fullWidth>
// //                     <InputLabel sx={{ color: "#A0C4C9" }}>Select Proposal</InputLabel>
// //                     <Select
// //                       value={selectedProposal}
// //                       onChange={(e) => setSelectedProposal(e.target.value)}
// //                       sx={{
// //                         color: "#EAF6F7",
// //                         ".MuiOutlinedInput-notchedOutline": { borderColor: "#5E9FA6" },
// //                         "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#7ABAC6" },
// //                       }}
// //                     >
// //                       {acceptedProposals.map((proposal) => (
// //                         <MenuItem key={proposal.id} value={proposal.id}>
// //                           {proposal.project_title} – {proposal.freelancer_username} (₹{proposal.proposed_rate})
// //                         </MenuItem>
// //                       ))}
// //                     </Select>
// //                   </FormControl>

// //                   <Button
// //                     variant="contained"
// //                     onClick={createContract}
// //                     disabled={!selectedProposal}
// //                     sx={{
// //                       px: 4,
// //                       py: 1.5,
// //                       backgroundColor: "#5E9FA6",
// //                       "&:hover": { backgroundColor: "#2F6F78" },
// //                     }}
// //                   >
// //                     Create
// //                   </Button>
// //                 </Box>
// //               )}
// //             </CardContent>
// //           </Card>
// //         )}

// //         <Typography variant="h5" fontWeight="bold" sx={{ color: "#EAF6F7", mb: 3 }}>
// //           My Contracts
// //         </Typography>

// //         {contracts.length === 0 ? (
// //           <Typography color="#A0C4C9">No contracts found.</Typography>
// //         ) : (
// //           <Grid container spacing={4}>
// //             {contracts.map((contract) => {
// //               const projectTitle = contract.project_title || contract.project?.title || "Untitled Project";
// //               const status = (contract.status || "pending").toLowerCase();
// //               const isActive = status === "active";

// //               return (
// //                 <Grid item xs={12} md={6} key={contract.id}>
// //                   <Card sx={{ height: "100%", borderRadius: 3, background: "rgba(15,46,53,0.85)" }}>
// //                     <CardContent>
// //                       <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: "#EAF6F7" }}>
// //                         {projectTitle}
// //                       </Typography>

// //                       <Typography variant="body2" color="#A0C4C9" mb={2}>
// //                         Start Date: {contract.start_date ? new Date(contract.start_date).toLocaleDateString() : "-"}
// //                       </Typography>

// //                       <Chip
// //                         label={status.toUpperCase()}
// //                         color={status === "completed" ? "primary" : status === "cancelled" ? "error" : "success"}
// //                         sx={{ mb: 3 }}
// //                       />

// //                       {isActive && (
// //                         <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
// //                           <Button
// //                             variant="contained"
// //                             onClick={() => navigate(`/messages?user_id=${contract.freelancer_id || contract.proposal?.freelancer?.id}`)}
// //                             sx={{ backgroundColor: "#5E9FA6", "&:hover": { backgroundColor: "#2F6F78" } }}
// //                           >
// //                             Message
// //                           </Button>

// //                           <Button
// //                             variant="contained"
// //                             onClick={() => updateContractStatus(contract.id, "completed")}
// //                             sx={{ backgroundColor: "#4CAF50", "&:hover": { backgroundColor: "#388E3C" } }}
// //                           >
// //                             Complete
// //                           </Button>

// //                           <Button
// //                             variant="contained"
// //                             onClick={() => updateContractStatus(contract.id, "cancelled")}
// //                             sx={{ backgroundColor: "#D32F2F", "&:hover": { backgroundColor: "#B71C1C" } }}
// //                           >
// //                             Cancel
// //                           </Button>
// //                         </Box>
// //                       )}

// //                       {/* ================= REVIEW SECTION ================= */}
// //                       {status === "completed" && (
// //                         <ReviewForm
// //                           contractId={contract.id}
// //                           onReviewSubmitted={loadContracts}
// //                           submittedReview={contract.review}
// //                         />
// //                       )}
// //                     </CardContent>
// //                   </Card>
// //                 </Grid>
// //               );
// //             })}
// //           </Grid>
// //         )}
// //       </Box>
// //     </>
// //   );
// // };

// // export default ContractsPage;



// import React, { useState, useEffect, useCallback } from "react";
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Grid,
//   Button,
//   Avatar,
//   Chip,
//   AppBar,
//   Toolbar,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Rating,
//   TextField,
//   Alert,
// } from "@mui/material";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api";
// import { Logout } from "@mui/icons-material";

// /* ================= REVIEW FORM / SUCCESS COMPONENT ================= */
// const ReviewForm = ({ contractId, onReviewSubmitted, submittedReview }) => {
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [newReview] = useState(null);

//   const displayReview = submittedReview || newReview;

//   if (submittedReview || success) {
//     return (
//       <Card sx={{ mt: 2, borderRadius: 3, background: "rgba(15,46,53,0.85)" }}>
//         <CardContent>
//           <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: "#EAF6F7" }}>
//             Review Submitted
//             {displayReview?.reviewer?.username && (
//               <> by <strong>{displayReview.reviewer.username}</strong></>
//             )}
//           </Typography>

//           <Alert
//             severity="success"
//             sx={{
//               mb: 3,
//               backgroundColor: "rgba(46, 125, 50, 0.35)",
//               color: "#C8E6C9",
//               border: "1px solid #4CAF50",
//               "& .MuiAlert-icon": { color: "#81C784" },
//             }}
//           >
//             Review Submitted Successfully!
//           </Alert>

//           {submittedReview && (
//             <Box sx={{ mt: 2 }}>
//               <Typography variant="body2" sx={{ color: "#A0C4C9", mb: 1 }}>
//                 Your rating:
//               </Typography>
//               <Rating
//                 value={submittedReview.rating}
//                 readOnly
//                 precision={1}
//                 sx={{
//                   "& .MuiRating-iconFilled": {
//                     color: "#FFD700",
//                     filter: "drop-shadow(0 0 3px #FFD70077)",
//                   },
//                   "& .MuiRating-iconEmpty": { color: "#FFD70033" },
//                 }}
//               />
//               {submittedReview.comment && (
//                 <>
//                   <Typography variant="body2" sx={{ color: "#A0C4C9", mt: 2, mb: 1 }}>
//                     Your comment:
//                   </Typography>
//                   <Typography color="#EAF6F7">
//                     "{submittedReview.comment}"
//                   </Typography>
//                 </>
//               )}
//             </Box>
//           )}
//         </CardContent>
//       </Card>
//     );
//   }

//   const handleSubmit = () => {
//     if (rating === 0) {
//       alert("Please select a rating.");
//       return;
//     }

//     setLoading(true);

//     api
//       .post(`/reviews/add/${contractId}/`, { rating, comment })
//       .then(() => {
//         setSuccess(true);
//         setRating(0);
//         setComment("");
//         onReviewSubmitted?.(); // Trigger reload of contracts
//       })
//       .catch((err) => {
//         console.error("Review submission failed:", err);
//         alert("Failed to submit review. Please try again.");
//       })
//       .finally(() => setLoading(false));
//   };

//   return (
//     <Card sx={{ mt: 2, borderRadius: 3, background: "rgba(15,46,53,0.85)" }}>
//       <CardContent>
//         <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: "#EAF6F7" }}>
//           Add Your Review
//         </Typography>

//         <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
//           <Typography sx={{ color: "#A0C4C9" }}>Rating:</Typography>
//           <Rating
//             name={`rating-${contractId}`}
//             value={rating}
//             onChange={(e, newValue) => setRating(newValue)}
//             precision={1}
//             icon={<span style={{ fontSize: "2rem" }}>★</span>}
//             emptyIcon={<span style={{ fontSize: "2rem", opacity: 0.3 }}>★</span>}
//             sx={{
//               "& .MuiRating-iconFilled": {
//                 color: "#FFD700",
//                 filter: "drop-shadow(0 0 4px #FFD70088)",
//               },
//               "& .MuiRating-iconHover": {
//                 color: "#FFEB3B",
//                 filter: "drop-shadow(0 0 6px #FFEB3Baa)",
//               },
//               "& .MuiRating-iconEmpty": {
//                 color: "#FFD70044",
//               },
//             }}
//           />
//         </Box>

//         <TextField
//           label="Comment (optional)"
//           variant="outlined"
//           fullWidth
//           multiline
//           minRows={3}
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//           sx={{
//             mb: 3,
//             "& .MuiOutlinedInput-root": {
//               color: "#EAF6F7",
//               backgroundColor: "rgba(10, 35, 42, 0.6)",
//               borderRadius: 2,
//               "& fieldset": { borderColor: "#5E9FA6" },
//               "&:hover fieldset": { borderColor: "#7ABAC6" },
//               "&.Mui-focused fieldset": {
//                 borderColor: "#5E9FA6",
//                 boxShadow: "0 0 0 1px #5E9FA650",
//               },
//             },
//             "& .MuiInputLabel-root": {
//               color: "#A0C4C9",
//               "&.Mui-focused": { color: "#5E9FA6" },
//             },
//           }}
//         />

//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading}
//           fullWidth
//           sx={{
//             py: 1.5,
//             backgroundColor: "#5E9FA6",
//             "&:hover": { backgroundColor: "#2F6F78" },
//             "&:disabled": {
//               backgroundColor: "#3A5F65",
//               color: "#8AA8AD",
//             },
//           }}
//         >
//           {loading ? "Submitting..." : "Submit Review"}
//         </Button>
//       </CardContent>
//     </Card>
//   );
// };

// /* ================= MAIN CONTRACTS PAGE ================= */
// const ContractsPage = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const [contracts, setContracts] = useState([]);
//   const [acceptedProposals, setAcceptedProposals] = useState([]);
//   const [selectedProposal, setSelectedProposal] = useState("");
//   const [loading, setLoading] = useState(true);

//   const isClient = user?.role === "client";
//   const avatarLetter = user?.username?.[0]?.toUpperCase() || "U";

//   const loadContracts = useCallback(() => {
//     api
//       .get("http://127.0.0.1:8000/api/contracts/my/")
//       .then((res) => {
//         const data = res.data.results || res.data || [];
//         setContracts(data);
//       })
//       .catch((err) => console.error("Failed to fetch contracts:", err));
//   }, []);

//   const loadAcceptedProposals = useCallback(() => {
//     if (!user || !isClient) {
//       setLoading(false);
//       return;
//     }

//     api
//       .get("http://127.0.0.1:8000/api/projects/")
//       .then((res) => {
//         const projects = res.data.results || res.data || [];
//         const proposalPromises = projects.map((project) =>
//           api
//             .get(`http://127.0.0.1:8000/api/proposals/projects/${project.id}/proposals/`)
//             .then((res) => {
//               const proposals = res.data.results || [];
//               return proposals
//                 .filter((p) => p.status.toLowerCase() === "accepted")
//                 .map((p) => ({
//                   ...p,
//                   project_title: project.title,
//                 }));
//             })
//             .catch(() => [])
//         );

//         Promise.all(proposalPromises)
//           .then((allProposals) => {
//             setAcceptedProposals(allProposals.flat());
//             setLoading(false);
//           })
//           .catch(() => setLoading(false));
//       })
//       .catch(() => setLoading(false));
//   }, [user, isClient]);

//   useEffect(() => {
//     loadContracts();
//     loadAcceptedProposals();
//   }, [loadContracts, loadAcceptedProposals]);

//   const createContract = () => {
//     if (!selectedProposal) return;

//     api
//       .post(`http://127.0.0.1:8000/api/contracts/create/${selectedProposal}/`)
//       .then(() => {
//         alert("Contract created successfully!");
//         setSelectedProposal("");
//         loadContracts();
//         loadAcceptedProposals();
//       })
//       .catch(() => alert("Failed to create contract."));
//   };

//   const updateContractStatus = (contractId, status) => {
//     api
//       .patch(`http://127.0.0.1:8000/api/contracts/${contractId}/status/`, { status })
//       .then(() => loadContracts())
//       .catch(() => alert("Failed to update contract status."));
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <>
//       {/* ===================== HEADER ===================== */}
//       <AppBar position="static" elevation={0} sx={{ background: "#0B2228" }}>
//         <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <Typography variant="h6" sx={{ fontWeight: "bold", color: "#5E9FA6" }}>
//               My Contracts
//             </Typography>
//           </Box>

//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <Avatar
//               sx={{
//                 bgcolor: "#5E9FA6",
//                 width: 42,
//                 height: 42,
//                 fontWeight: "bold",
//               }}
//             >
//               {avatarLetter}
//             </Avatar>
//             <Box>
//               <Typography variant="body1" sx={{ color: "#EAF6F7" }}>
//                 {user?.username}
//               </Typography>
//               <Typography variant="caption" sx={{ color: "#A0C4C9" }}>
//                 {isClient ? "Client" : "Freelancer"}
//               </Typography>
//             </Box>
//             <Button onClick={handleLogout} sx={{ color: "#E57373", ml: 1 }}>
//               <Logout fontSize="large" />
//             </Button>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       {/* ===================== MAIN CONTENT ===================== */}
//       <Box
//         sx={{
//           minHeight: "calc(100vh - 64px)",
//           background: "linear-gradient(135deg, #0F2E35, #2F6F78)",
//           p: 4,
//         }}
//       >
//         {/* CLIENT: CREATE CONTRACT SECTION */}
//         {isClient && (
//           <Card sx={{ mb: 5, borderRadius: 3, background: "rgba(15,46,53,0.9)" }}>
//             <CardContent sx={{ p: 4 }}>
//               <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: "#EAF6F7" }}>
//                 Create Contract
//               </Typography>
//               <Typography variant="body2" color="#A0C4C9" mb={3}>
//                 Create a contract from an accepted proposal
//               </Typography>

//               {loading ? (
//                 <Typography color="#A0C4C9">Loading accepted proposals...</Typography>
//               ) : acceptedProposals.length === 0 ? (
//                 <Typography color="#A0C4C9">No accepted proposals available.</Typography>
//               ) : (
//                 <Box sx={{ display: "flex", gap: 2, alignItems: "end" }}>
//                   <FormControl fullWidth>
//                     <InputLabel sx={{ color: "#A0C4C9" }}>Select Proposal</InputLabel>
//                     <Select
//                       value={selectedProposal}
//                       onChange={(e) => setSelectedProposal(e.target.value)}
//                       sx={{
//                         color: "#EAF6F7",
//                         ".MuiOutlinedInput-notchedOutline": { borderColor: "#5E9FA6" },
//                         "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#7ABAC6" },
//                       }}
//                     >
//                       {acceptedProposals.map((proposal) => (
//                         <MenuItem key={proposal.id} value={proposal.id}>
//                           {proposal.project_title} – {proposal.freelancer_username} (₹{proposal.proposed_rate})
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>

//                   <Button
//                     variant="contained"
//                     onClick={createContract}
//                     disabled={!selectedProposal}
//                     sx={{
//                       px: 4,
//                       py: 1.5,
//                       backgroundColor: "#5E9FA6",
//                       "&:hover": { backgroundColor: "#2F6F78" },
//                     }}
//                   >
//                     Create
//                   </Button>
//                 </Box>
//               )}
//             </CardContent>
//           </Card>
//         )}

//         <Typography variant="h5" fontWeight="bold" sx={{ color: "#EAF6F7", mb: 3 }}>
//           My Contracts
//         </Typography>

//         {contracts.length === 0 ? (
//           <Typography color="#A0C4C9">No contracts found.</Typography>
//         ) : (
//           <Grid container spacing={4}>
//             {contracts.map((contract) => {
//               const projectTitle = contract.project_title || contract.project?.title || "Untitled Project";
//               const status = (contract.status || "pending").toLowerCase();
//               const isActive = status === "active";

//               return (
//                 <Grid item xs={12} md={6} key={contract.id}>
//                   <Card sx={{ height: "100%", borderRadius: 3, background: "rgba(15,46,53,0.85)" }}>
//                     <CardContent>
//                       <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: "#EAF6F7" }}>
//                         {projectTitle}
//                       </Typography>

//                       <Typography variant="body2" color="#A0C4C9" mb={2}>
//                         Start Date: {contract.start_date ? new Date(contract.start_date).toLocaleDateString() : "-"}
//                       </Typography>

//                       <Chip
//                         label={status.toUpperCase()}
//                         color={status === "completed" ? "primary" : status === "cancelled" ? "error" : "success"}
//                         sx={{ mb: 3 }}
//                       />

//                       {isActive && (
//                         <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
//                           <Button
//                             variant="contained"
//                             onClick={() => navigate(`/messages?user_id=${contract.freelancer_id || contract.proposal?.freelancer?.id}`)}
//                             sx={{ backgroundColor: "#5E9FA6", "&:hover": { backgroundColor: "#2F6F78" } }}
//                           >
//                             Message
//                           </Button>

//                           <Button
//                             variant="contained"
//                             onClick={() => updateContractStatus(contract.id, "completed")}
//                             sx={{ backgroundColor: "#4CAF50", "&:hover": { backgroundColor: "#388E3C" } }}
//                           >
//                             Complete
//                           </Button>

//                           <Button
//                             variant="contained"
//                             onClick={() => updateContractStatus(contract.id, "cancelled")}
//                             sx={{ backgroundColor: "#D32F2F", "&:hover": { backgroundColor: "#B71C1C" } }}
//                           >
//                             Cancel
//                           </Button>
//                         </Box>
//                       )}

//                       {/* ================= REVIEW SECTION ================= */}
//                       {status === "completed" && (
//                         <ReviewForm
//                           contractId={contract.id}
//                           onReviewSubmitted={loadContracts}
//                           submittedReview={contract.review}
//                         />
//                       )}
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               );
//             })}
//           </Grid>
//         )}
//       </Box>
//     </>
//   );
// };

// export default ContractsPage;


import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  Chip,
  AppBar,
  Toolbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  TextField,
  Alert,
  Container
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Logout } from "@mui/icons-material";

/* ================= REVIEW FORM / SUCCESS COMPONENT ================= */
const ReviewForm = ({ contractId, onReviewSubmitted, submittedReview }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newReview] = useState(null);

  const displayReview = submittedReview || newReview;

  if (submittedReview || success) {
    return (
      <Card sx={{ mt: 2, borderRadius: 3, background: "rgba(15,46,53,0.85)" }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: "#EAF6F7" }}>
            Review Submitted
            {displayReview?.reviewer?.username && (
              <> by <strong>{displayReview.reviewer.username}</strong></>
            )}
          </Typography>

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
            Review Submitted Successfully!
          </Alert>

          {submittedReview && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ color: "#A0C4C9", mb: 1 }}>
                Your rating:
              </Typography>
              <Rating
                value={submittedReview.rating}
                readOnly
                precision={1}
                sx={{
                  "& .MuiRating-iconFilled": {
                    color: "#FFD700",
                    filter: "drop-shadow(0 0 3px #FFD70077)",
                  },
                  "& .MuiRating-iconEmpty": { color: "#FFD70033" },
                }}
              />
              {submittedReview.comment && (
                <>
                  <Typography variant="body2" sx={{ color: "#A0C4C9", mt: 2, mb: 1 }}>
                    Your comment:
                  </Typography>
                  <Typography color="#EAF6F7">
                    "{submittedReview.comment}"
                  </Typography>
                </>
              )}
            </Box>
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
      .then(() => {
        setSuccess(true);
        setRating(0);
        setComment("");
        onReviewSubmitted?.(); // Trigger reload of contracts
      })
      .catch((err) => {
        console.error("Review submission failed:", err);
        alert("Failed to submit review. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <Card sx={{ mt: 2, borderRadius: 3, background: "rgba(15,46,53,0.85)" }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: "#EAF6F7" }}>
          Add Your Review
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Typography sx={{ color: "#A0C4C9" }}>Rating:</Typography>
          <Rating
            name={`rating-${contractId}`}
            value={rating}
            onChange={(e, newValue) => setRating(newValue)}
            precision={1}
            icon={<span style={{ fontSize: "2rem" }}>★</span>}
            emptyIcon={<span style={{ fontSize: "2rem", opacity: 0.3 }}>★</span>}
            sx={{
              "& .MuiRating-iconFilled": {
                color: "#FFD700",
                filter: "drop-shadow(0 0 4px #FFD70088)",
              },
              "& .MuiRating-iconHover": {
                color: "#FFEB3B",
                filter: "drop-shadow(0 0 6px #FFEB3Baa)",
              },
              "& .MuiRating-iconEmpty": {
                color: "#FFD70044",
              },
            }}
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
              backgroundColor: "rgba(10, 35, 42, 0.6)",
              borderRadius: 2,
              "& fieldset": { borderColor: "#5E9FA6" },
              "&:hover fieldset": { borderColor: "#7ABAC6" },
              "&.Mui-focused fieldset": {
                borderColor: "#5E9FA6",
                boxShadow: "0 0 0 1px #5E9FA650",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#A0C4C9",
              "&.Mui-focused": { color: "#5E9FA6" },
            },
          }}
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          fullWidth
          sx={{
            py: 1.5,
            backgroundColor: "#5E9FA6",
            "&:hover": { backgroundColor: "#2F6F78" },
            "&:disabled": {
              backgroundColor: "#3A5F65",
              color: "#8AA8AD",
            },
          }}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </Button>
      </CardContent>
    </Card>
  );
};

/* ================= MAIN CONTRACTS PAGE ================= */
const ContractsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [contracts, setContracts] = useState([]);
  const [acceptedProposals, setAcceptedProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState("");
  const [loading, setLoading] = useState(true);

  const isClient = user?.role === "client";
  const avatarLetter = user?.username?.[0]?.toUpperCase() || "U";

  const loadContracts = useCallback(() => {
    api
      .get("http://127.0.0.1:8000/api/contracts/my/")
      .then((res) => {
        const data = res.data.results || res.data || [];
        setContracts(data);
      })
      .catch((err) => console.error("Failed to fetch contracts:", err));
  }, []);

  const loadAcceptedProposals = useCallback(() => {
    if (!user || !isClient) {
      setLoading(false);
      return;
    }

    api
      .get("http://127.0.0.1:8000/api/projects/")
      .then((res) => {
        const projects = res.data.results || res.data || [];
        const proposalPromises = projects.map((project) =>
          api
            .get(`http://127.0.0.1:8000/api/proposals/projects/${project.id}/proposals/`)
            .then((res) => {
              const proposals = res.data.results || [];
              return proposals
                .filter((p) => p.status.toLowerCase() === "accepted")
                .map((p) => ({
                  ...p,
                  project_title: project.title,
                }));
            })
            .catch(() => [])
        );

        Promise.all(proposalPromises)
          .then((allProposals) => {
            setAcceptedProposals(allProposals.flat());
            setLoading(false);
          })
          .catch(() => setLoading(false));
      })
      .catch(() => setLoading(false));
  }, [user, isClient]);

  useEffect(() => {
    loadContracts();
    loadAcceptedProposals();
  }, [loadContracts, loadAcceptedProposals]);

  const createContract = () => {
    if (!selectedProposal) return;

    api
      .post(`http://127.0.0.1:8000/api/contracts/create/${selectedProposal}/`)
      .then(() => {
        alert("Contract created successfully!");
        setSelectedProposal("");
        loadContracts();
        loadAcceptedProposals();
      })
      .catch(() => alert("Failed to create contract."));
  };

  const updateContractStatus = (contractId, status) => {
    api
      .patch(`http://127.0.0.1:8000/api/contracts/${contractId}/status/`, { status })
      .then(() => loadContracts())
      .catch(() => alert("Failed to update contract status."));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* ===================== HEADER ===================== */}
      <AppBar position="static" elevation={0} sx={{ background: "#0B2228" }}>
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#5E9FA6" }}>
            </Typography>
            <Typography
                        variant="h5"
                        sx={{ fontWeight: 800, letterSpacing: 1, color: "#5E9FA6" }}
                      >
                        Contracts
                      </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: "#5E9FA6",
                width: 42,
                height: 42,
                fontWeight: "bold",
              }}
            >
              {avatarLetter}
            </Avatar>
            <Box>
              <Typography variant="body1" sx={{ color: "#EAF6F7" }}>
                {user?.username}
              </Typography>
              <Typography variant="caption" sx={{ color: "#A0C4C9" }}>
                {isClient ? "Client" : "Freelancer"}
              </Typography>
            </Box>
            <Button onClick={handleLogout} sx={{ color: "#E57373", ml: 1 }}>
              <Logout fontSize="large" />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ===================== MAIN CONTENT ===================== */}
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          background: "linear-gradient(135deg, #0F2E35, #2F6F78)",
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          {/* CLIENT: CREATE CONTRACT SECTION */}
          {isClient && (
            
            <Card sx={{ mb: 5, borderRadius: 3, background: "rgba(15,46,53,0.9)" }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: "#EAF6F7" }}>
                  Create Contract
                </Typography>
                <Typography variant="body2" color="#A0C4C9" mb={3}>
                  Create a contract from an accepted proposal
                </Typography>

                {loading ? (
                  <Typography color="#A0C4C9">Loading accepted proposals...</Typography>
                ) : acceptedProposals.length === 0 ? (
                  <Typography color="#A0C4C9">No accepted proposals available.</Typography>
                ) : (
                  <Box sx={{ display: "flex", gap: 2, alignItems: "end" }}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: "#A0C4C9" }}>Select Proposal</InputLabel>
                      <Select
                        value={selectedProposal}
                        onChange={(e) => setSelectedProposal(e.target.value)}
                        sx={{
                          color: "#EAF6F7",
                          ".MuiOutlinedInput-notchedOutline": { borderColor: "#5E9FA6" },
                          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#7ABAC6" },
                        }}
                      >
                        {acceptedProposals.map((proposal) => (
                          <MenuItem key={proposal.id} value={proposal.id}>
                            {proposal.project_title} – {proposal.freelancer_username} (₹{proposal.proposed_rate})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Button
                      variant="contained"
                      onClick={createContract}
                      disabled={!selectedProposal}
                      sx={{
                        px: 4,
                        py: 1.5,
                        backgroundColor: "#5E9FA6",
                        "&:hover": { backgroundColor: "#2F6F78" },
                      }}
                    >
                      Create
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          <Typography variant="h5" fontWeight="bold" sx={{ color: "#EAF6F7", mb: 3 }}>
            My Contracts
          </Typography>

          {contracts.length === 0 ? (
            <Typography color="#A0C4C9">No contracts found.</Typography>
          ) : (
            <Grid container spacing={4}>
              {contracts.map((contract) => {
                const projectTitle = contract.project_title || contract.project?.title || "Untitled Project";
                const status = (contract.status || "pending").toLowerCase();
                const isActive = status === "active";

                return (
                  <Grid item xs={12} md={6} key={contract.id}>
                    <Card sx={{ height: "100%", borderRadius: 3, background: "rgba(15,46,53,0.85)" }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: "#EAF6F7" }}>
                          {projectTitle}
                        </Typography>

                        <Typography variant="body2" color="#A0C4C9" mb={2}>
                          Start Date: {contract.start_date ? new Date(contract.start_date).toLocaleDateString() : "-"}
                        </Typography>

                        <Chip
                          label={status.toUpperCase()}
                          color={status === "completed" ? "primary" : status === "cancelled" ? "error" : "success"}
                          sx={{ mb: 3 }}
                        />

                        {isActive && (
                          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
                            <Button
                              variant="contained"
                              onClick={() => navigate(`/messages?user_id=${contract.freelancer_id || contract.proposal?.freelancer?.id}`)}
                              sx={{ backgroundColor: "#5E9FA6", "&:hover": { backgroundColor: "#2F6F78" } }}
                            >
                              Message
                            </Button>

                            <Button
                              variant="contained"
                              onClick={() => updateContractStatus(contract.id, "completed")}
                              sx={{ backgroundColor: "#4CAF50", "&:hover": { backgroundColor: "#388E3C" } }}
                            >
                              Complete
                            </Button>

                            <Button
                              variant="contained"
                              onClick={() => updateContractStatus(contract.id, "cancelled")}
                              sx={{ backgroundColor: "#D32F2F", "&:hover": { backgroundColor: "#B71C1C" } }}
                            >
                              Cancel
                            </Button>
                          </Box>
                        )}

                        {/* ================= REVIEW SECTION ================= */}
                        {status === "completed" && (
                          <ReviewForm
                            contractId={contract.id}
                            onReviewSubmitted={loadContracts}
                            submittedReview={contract.review}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Container>
      </Box>
    </>
  );
};

export default ContractsPage;
