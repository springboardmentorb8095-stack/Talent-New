
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api";
// import { useAuth } from "../context/AuthContext";
// import {
//   Container,
//   Typography,
//   TextField,
//   Button,
//   Box,
//   Chip,
//   Stack,
//   Alert,
//   AppBar,
//   Toolbar,
//   IconButton,
//   Avatar,
// } from "@mui/material";
// import { Add, ArrowBack, Logout } from "@mui/icons-material";

// const NewProject = () => {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     budget: "",
//     duration: "",
//     skills: [],
//   });

//   const [newSkill, setNewSkill] = useState("");
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleAddSkill = () => {
//     if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
//       setFormData({
//         ...formData,
//         skills: [...formData.skills, newSkill.trim()],
//       });
//       setNewSkill("");
//     }
//   };

//   const handleRemoveSkill = (skillToRemove) => {
//     setFormData({
//       ...formData,
//       skills: formData.skills.filter((s) => s !== skillToRemove),
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     if (
//       !formData.title ||
//       !formData.description ||
//       !formData.budget ||
//       !formData.duration
//     ) {
//       setError("Please fill in all required fields.");
//       setLoading(false);
//       return;
//     }

//     try {
//       await api.post("http://127.0.0.1:8000/api/projects/", {
//         title: formData.title,
//         description: formData.description,
//         budget: parseFloat(formData.budget),
//         duration: formData.duration,
//         skills: formData.skills,
//       });

//       setSuccess("Project posted successfully!");
//       setTimeout(() => {
//         navigate("/dashboard");
//       }, 1500);
//     } catch (err) {
//       console.error("API Error:", err.response?.data || err.message);
//       setError(
//         err.response?.data?.detail ||
//           err.response?.data?.non_field_errors?.[0] ||
//           "Failed to create project. Please login again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const avatarLetter = user?.username?.charAt(0)?.toUpperCase() || "U";

//   const darkInputStyles = {
//     "& .MuiInputBase-input": { color: "#EAF6F7" },
//     "& .MuiOutlinedInput-notchedOutline": { borderColor: "#5E9FA6" },
//     "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#A0C4C9" },
//     "& .MuiInputLabel-root": { color: "#A0C4C9" },
//     backgroundColor: "rgba(255,255,255,0.05)",
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <>
//       <AppBar
//         position="static"
//         sx={{
//           background: "linear-gradient(90deg, #0F2E35 0%, #2F6F78 100%)",
//           boxShadow: "none",
//         }}
//       >
//         <Toolbar sx={{ justifyContent: "space-between" }}>
//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <IconButton color="inherit" onClick={() => navigate("/dashboard")}>
//               <ArrowBack />
//             </IconButton>
//             <Typography variant="h6" fontWeight="bold" color="#EAF6F7">
//               TalentLink
//             </Typography>
//           </Box>

//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <Avatar sx={{ bgcolor: "#5E9FA6", fontWeight: "bold" }}>
//               {avatarLetter}
//             </Avatar>
//             <Box>
//               <Typography variant="body1" color="#EAF6F7">
//                 {user?.username || "User"}
//               </Typography>
//               <Typography variant="caption" color="#A0C4C9">
//                 Client
//               </Typography>
//             </Box>
//             <IconButton color="inherit" onClick={handleLogout}>
//               <Logout />
//             </IconButton>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       <Box
//         sx={{
//           minHeight: "calc(100vh - 64px)",
//           background: "linear-gradient(135deg, #0F2E35 0%, #2F6F78 100%)",
//           py: 6,
//         }}
//       >
//         <Container maxWidth="md">
//           <Box textAlign="center" mb={5}>
//             <Typography variant="h4" fontWeight="bold" color="#EAF6F7">
//               Post a New Project
//             </Typography>
//             <Typography color="#A0C4C9">
//               Describe your project and find the right talent
//             </Typography>
//           </Box>

//           {(error || success) && (
//             <Alert
//               severity={success ? "success" : "error"}
//               sx={{ mb: 3 }}
//               onClose={() => {
//                 setError(null);
//                 setSuccess(null);
//               }}
//             >
//               {error || success}
//             </Alert>
//           )}

//           <Box
//             component="form"
//             onSubmit={handleSubmit}
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               gap: 3,
//               background: "rgba(15, 46, 53, 0.85)",
//               p: 4,
//               borderRadius: 3,
//             }}
//           >
//             <TextField
//               required
//               label="Project Title"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               fullWidth
//               sx={darkInputStyles}
//             />

//             <TextField
//               required
//               label="Project Description"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               fullWidth
//               multiline
//               rows={4}
//               sx={darkInputStyles}
//             />

//             <TextField
//               required
//               label="Budget"
//               name="budget"
//               type="number"
//               value={formData.budget}
//               onChange={handleChange}
//               fullWidth
//               sx={darkInputStyles}
//             />

//             <TextField
//               required
//               label="Duration"
//               name="duration"
//               value={formData.duration}
//               onChange={handleChange}
//               fullWidth
//               sx={darkInputStyles}
//             />

//             <Box>
//               <Typography color="#EAF6F7" mb={1}>
//                 Skills Required
//               </Typography>
//               <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
//                 {formData.skills.map((skill) => (
//                   <Chip
//                     key={skill}
//                     label={skill}
//                     onDelete={() => handleRemoveSkill(skill)}
//                   />
//                 ))}
//               </Stack>

//               <TextField
//                 label="Add skill"
//                 value={newSkill}
//                 onChange={(e) => setNewSkill(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") {
//                     e.preventDefault();
//                     handleAddSkill();
//                   }
//                 }}
//                 fullWidth
//                 sx={darkInputStyles}
//                 InputProps={{
//                   endAdornment: (
//                     <IconButton onClick={handleAddSkill}>
//                       <Add />
//                     </IconButton>
//                   ),
//                 }}
//               />
//             </Box>

//             <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
//               <Button variant="outlined" onClick={() => navigate("/dashboard")}>
//                 Cancel
//               </Button>
//               <Button type="submit" variant="contained" disabled={loading}>
//                 {loading ? "Posting..." : "Post Project"}
//               </Button>
//             </Box>
//           </Box>
//         </Container>
//       </Box>
//     </>
//   );
// };

// export default NewProject;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Chip,
  Stack,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Fade,
  Zoom,
  InputAdornment,
  Divider,
} from "@mui/material";
import { Add, ArrowBack, Logout } from "@mui/icons-material";

const NewProject = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    duration: "",
    skills: [],
  });

  const [newSkill, setNewSkill] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (
      !formData.title ||
      !formData.description ||
      !formData.budget ||
      !formData.duration
    ) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      await api.post("http://127.0.0.1:8000/api/projects/", {
        title: formData.title,
        description: formData.description,
        budget: parseFloat(formData.budget),
        duration: formData.duration,
        skills: formData.skills,
      });

      setSuccess("Project posted successfully!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      setError(
        err.response?.data?.detail ||
          err.response?.data?.non_field_errors?.[0] ||
          "Failed to create project. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const avatarLetter = user?.username?.charAt(0)?.toUpperCase() || "U";

  const darkInputStyles = {
    "& .MuiInputBase-root": {
      bgcolor: "rgba(15, 46, 53, 0.6)",
      color: "#EAF6F7",
      borderRadius: 3,
    },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#5E9FA6" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#A0C4C9" },
    "& .MuiInputLabel-root": { color: "#A0C4C9" },
    "& .Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#5E9FA6" },
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* ===== MODERN HEADER ===== */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#0B2228" }}>
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={() => navigate("/dashboard")}
              sx={{ color: "#A0C4C9" }}
            >
              <ArrowBack fontSize="large" />
            </IconButton>
            
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{ color: "#5E9FA6", letterSpacing: 1 }}
            >
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: "#5E9FA6",
                  width: 48,
                  height: 48,
                  fontWeight: "bold",
                  fontSize: "1.4rem",
                  boxShadow: "0 0 15px rgba(94, 159, 166, 0.4)",
                }}
              >
                {avatarLetter}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ color: "#EAF6F7", fontWeight: 600 }}>
                  {user?.username || "User"}
                </Typography>
                <Typography variant="caption" sx={{ color: "#A0C4C9" }}>
                  Client
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleLogout} sx={{ color: "#E57373" }}>
              <Logout fontSize="large" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ===== MAIN CONTENT ===== */}
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0B2228 0%, #1A3D45 50%, #2F6F78 100%)",
          py: { xs: 4, md: 8 },
          color: "#EAF6F7",
        }}
      >
        <Container maxWidth="md">
          {/* Hero Section */}
          <Zoom in timeout={600}>
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                Post a New Project
              </Typography>
              <Typography variant="h6" sx={{ color: "#A0C4C9", maxWidth: "600px", mx: "auto" }}>
                Describe your project clearly to attract the best freelancers
              </Typography>
            </Box>
          </Zoom>

          {/* Alert Messages */}
          <Fade in={!!error || !!success} timeout={500}>
            <Box>
              {(error || success) && (
                <Alert
                  severity={success ? "success" : "error"}
                  sx={{
                    mb: 4,
                    bgcolor: success ? "rgba(46, 125, 50, 0.2)" : "rgba(211, 47, 47, 0.2)",
                    color: "#EAF6F7",
                    border: `1px solid ${success ? "#4CAF50" : "#F44336"}`,
                  }}
                  onClose={() => {
                    setError(null);
                    setSuccess(null);
                  }}
                >
                  {error || success}
                </Alert>
              )}
            </Box>
          </Fade>

          {/* Form Card */}
          <Fade in timeout={800}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                bgcolor: "rgba(15, 46, 53, 0.85)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(94, 159, 166, 0.3)",
                borderRadius: 4,
                p: { xs: 3, md: 5 },
                boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
                transition: "all 0.3s",
                "&:hover": {
                  borderColor: "#5E9FA6",
                  boxShadow: "0 20px 45px rgba(0,0,0,0.5)",
                },
              }}
            >
              <Stack spacing={4}>
                <TextField
                  required
                  label="Project Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  fullWidth
                  placeholder="e.g. Build a modern e-commerce website"
                  sx={darkInputStyles}
                />

                <TextField
                  required
                  label="Project Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={6}
                  placeholder="Provide detailed information about your project, goals, and expectations..."
                  sx={darkInputStyles}
                />

                <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>
                  <TextField
                    required
                    label="Budget (USD)"
                    name="budget"
                    type="number"
                    value={formData.budget}
                    onChange={handleChange}
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    sx={darkInputStyles}
                  />

                  <TextField
                    required
                    label="Expected Duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    fullWidth
                    placeholder="e.g. 2 weeks, 1 month"
                    sx={darkInputStyles}
                  />
                </Box>

                <Divider sx={{ bgcolor: "rgba(94, 159, 166, 0.3)" }} />

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ color: "#EAF6F7", fontWeight: 600 }}>
                    Skills Required
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#A0C4C9", mb: 2 }}>
                    Add relevant skills to help freelancers find your project
                  </Typography>

                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} mb={3}>
                    {formData.skills.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        onDelete={() => handleRemoveSkill(skill)}
                        color="primary"
                        sx={{
                          bgcolor: "#5E9FA6",
                          color: "#0B2228",
                          fontWeight: 600,
                          "&:hover": { bgcolor: "#4A858C" },
                        }}
                      />
                    ))}
                    {formData.skills.length === 0 && (
                      <Typography variant="body2" color="#A0C4C9">
                        No skills added yet
                      </Typography>
                    )}
                  </Stack>

                  <TextField
                    label="Add a skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    fullWidth
                    placeholder="Type a skill and press Enter or click +"
                    sx={darkInputStyles}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleAddSkill}
                            disabled={!newSkill.trim()}
                            sx={{ color: "#E57373" }}
                          >
                            <Add />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 3, mt: 4 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate("/dashboard")}
                    sx={{
                      borderColor: "#A0C4C9",
                      color: "#A0C4C9",
                      px: 4,
                      "&:hover": { borderColor: "#5E9FA6", bgcolor: "rgba(94, 159, 166, 0.1)" },
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      bgcolor: "#5E9FA6",
                      px: 6,
                      py: 1.8,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      boxShadow: "0 8px 25px rgba(94, 159, 166, 0.4)",
                      "&:hover": {
                        bgcolor: "#4A858C",
                        transform: "translateY(-3px)",
                      },
                      "&:disabled": {
                        bgcolor: "#3A6D74",
                      },
                      transition: "all 0.3s",
                    }}
                  >
                    {loading ? "Posting Project..." : "Post Project"}
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Fade>
        </Container>
      </Box>
    </>
  );
};

export default NewProject;