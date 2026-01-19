

import React from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider
} from "@mui/material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

import { useAuth } from "../context/AuthContext"; // Import auth to get user role

const menuItems = [
  { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { label: "Projects", icon: <WorkOutlineIcon />, path: "/projects" },
  { label: "Proposals", icon: <DescriptionOutlinedIcon />, path: "/proposals" },
  { label: "Messages", icon: <MessageOutlinedIcon />, path: "/messages" },
  { label: "Contracts", icon: <DescriptionOutlinedIcon />, path: "/contracts" },
];

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); // Get logged-in user

  const portalLabel = user?.role === "client" ? "Client Portal" : "Freelancer Portal";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#0F2E35" }}>

      {/* ================= SIDEBAR ================= */}
      <Box
        sx={{
          width: 280,
          background: "linear-gradient(180deg, #0B2228 0%, #142d39 100%)",
          color: "#EAF6F7",
          display: "flex",
          flexDirection: "column",
          px: 3,
          py: 3,
          boxShadow: "6px 0 20px rgba(0,0,0,0.45)"
          
        }}
      >
        {/* ===== BRAND ===== */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            letterSpacing: 1,
            color: "#5E9FA6",
            fontSize: "1.7rem",
            textAlign: "center",
            mb: 1
          }}
        >
          TalentLink
        </Typography>

        <Typography
          sx={{
            fontSize: "0.85rem",
            textAlign: "center",
            color: "#9ECED3",
            mb: 2
          }}
        >
          {portalLabel} {/* Dynamic portal label */}
        </Typography>

        <Divider sx={{ bgcolor: "rgba(94,159,166,0.3)", mb: 3 }} />

        {/* ===== MENU ===== */}
        <List sx={{ px: 0 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);

            return (
              <ListItemButton
                key={item.label}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: "14px",
                  mb: 1.5,
                  py: 1.6,
                  px: 2.5,
                  backgroundColor: isActive
                    ? "rgba(94,159,166,0.25)"
                    : "transparent",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    backgroundColor: "rgba(94,159,166,0.18)",
                    transform: "translateX(4px)"
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 44,
                    color: isActive ? "#5E9FA6" : "#8FBFC4"
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "1.15rem",
                    fontWeight: isActive ? 700 : 500,
                    letterSpacing: "0.3px",
                    color: "#EAF6F7"
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>

        {/* ===== FOOTER ===== */}
        <Box sx={{ mt: "auto", pt: 3 }}>
          <Divider sx={{ bgcolor: "rgba(94,159,166,0.25)", mb: 2 }} />
          <Typography
            sx={{
              fontSize: "0.8rem",
              textAlign: "center",
              color: "#8FBFC4"
            }}
          >
            © 2026 TalentLink
          </Typography>
        </Box>
      </Box>

      {/* ================= PAGE CONTENT ================= */}
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <Outlet />
      </Box>

    </Box>
  );
};

export default MainLayout;
