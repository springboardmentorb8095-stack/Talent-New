
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Fade,
  Zoom,
} from "@mui/material";
import {
  WorkOutline,
  PeopleOutline,
  Security,
  TrendingUp,
} from "@mui/icons-material";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* ===== HEADER ===== */}
      <AppBar position="static" elevation={0} sx={{ background: "#0B2228" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, letterSpacing: 1, color: "#5E9FA6" }}
          >
            TalentLink
          </Typography>

          
        </Toolbar>
      </AppBar>

      {/* ===== HERO SECTION ===== */}
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0B2228 0%, #1A3D45 50%, #2F6F78 100%)",
          color: "#EAF6F7",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            {/* Left Content */}
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography
                    variant="h2"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ lineHeight: 1.2 }}
                  >
                    Hire Smart. <br />
                    Work Smarter.
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{ color: "#A0C4C9", mb: 4 }}
                  >
                    TalentLink connects skilled freelancers with clients
                    looking to build amazing projects — fast, secure, and
                    reliable.
                  </Typography>

                  <Box sx={{ display: "flex", gap: 3 }}>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        bgcolor: "#5E9FA6",
                        px: 5,
                        py: 1.8,
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        "&:hover": { bgcolor: "#4A858C" },
                      }}
                      onClick={() => navigate("/register")}
                    >
                      Join Now
                    </Button>

                    <Button
                      variant="outlined"
                      size="large"
                      sx={{
                        borderColor: "#5E9FA6",
                        color: "#5E9FA6",
                        px: 5,
                        py: 1.8,
                        "&:hover": {
                          bgcolor: "rgba(94,159,166,0.15)",
                          borderColor: "#5E9FA6",
                        },
                      }}
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>

            {/* Right Illustration Card */}
            <Grid item xs={12} md={6}>
              <Zoom in timeout={1200}>
                <Card
                  sx={{
                    bgcolor: "rgba(15, 46, 53, 0.85)",
                    borderRadius: 4,
                    p: 4,
                    border: "1px solid rgba(94,159,166,0.3)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.45)",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      gutterBottom
                    >
                      Why TalentLink?
                    </Typography>

                    <Grid container spacing={3} mt={1}>
                      <Grid item xs={12} sm={6}>
                        <Feature
                          icon={<WorkOutline />}
                          title="Post Projects"
                          text="Clients can post jobs and receive proposals instantly."
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Feature
                          icon={<PeopleOutline />}
                          title="Hire Talent"
                          text="Find skilled freelancers with ease."
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Feature
                          icon={<TrendingUp />}
                          title="Grow Career"
                          text="Freelancers build reputation and income."
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Feature
                          icon={<Security />}
                          title="Secure Contracts"
                          text="Transparent proposals and contract tracking."
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ===== FOOTER ===== */}
      <Box
        sx={{
          py: 3,
          textAlign: "center",
          background: "#0B2228",
          color: "#A0C4C9",
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} TalentLink. All rights reserved.
        </Typography>
      </Box>
    </>
  );
};

/* ===== FEATURE COMPONENT ===== */
const Feature = ({ icon, title, text }) => (
  <Box sx={{ display: "flex", gap: 2 }}>
    <Box
      sx={{
        bgcolor: "rgba(94,159,166,0.2)",
        p: 1.5,
        borderRadius: 2,
        color: "#5E9FA6",
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography fontWeight="bold">{title}</Typography>
      <Typography variant="body2" sx={{ color: "#A0C4C9" }}>
        {text}
      </Typography>
    </Box>
  </Box>
);

export default Home;
