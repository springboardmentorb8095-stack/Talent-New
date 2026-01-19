
// BrowseProjects.js
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Stack,
  Card,
  CardContent,
  Button,
} from "@mui/material";

function BrowseProjects() {

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("http://127.0.0.1:8000/api/projects/") // Replace with your open projects endpoint if needed
      .then((res) => {
        setProjects(res.data.results || res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #0F2E35 0%, #2F6F78 100%)", py: 6 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 5, textAlign: "center" }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom color="#EAF6F7">
            Browse Projects
          </Typography>
          <Typography variant="body1" color="#A0C4C9">
            Find new opportunities to apply for
          </Typography>
        </Box>

        {loading ? (
          <Typography align="center" color="#A0C4C9">Loading...</Typography>
        ) : projects.length === 0 ? (
          <Typography align="center" color="#A0C4C9">No open projects available</Typography>
        ) : (
          <Stack spacing={3}>
            {projects.map((project) => (
              <Card
                key={project.id}
                elevation={6}
                sx={{ background: "rgba(15, 46, 53, 0.85)", borderRadius: 3, color: "#EAF6F7" }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" gutterBottom>{project.title}</Typography>
                  <Typography variant="body2" color="#A0C4C9" sx={{ mb: 2 }}>
                    Budget: ${project.budget} • Duration: {project.duration} days
                  </Typography>
                  <Typography variant="body2" color="#A0C4C9" sx={{ mb: 3 }}>
                    Skills: {project.skills_required?.join(", ") || "Not specified"}
                  </Typography>
                  <Button
                    component={Link}
                    to={`/projects/${project.id}`}
                    variant="contained"
                    sx={{ backgroundColor: "#5E9FA6", "&:hover": { backgroundColor: "#2F6F78" } }}
                  >
                    View Details & Apply
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
}

export default BrowseProjects;
