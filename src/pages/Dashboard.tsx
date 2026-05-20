import { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography, CircularProgress } from "@mui/material";
import { getDashboardStatsApi } from "../services/api";
import Layout from "../components/Layout"; // 
import PeopleIcon from "@mui/icons-material/People";
import PolicyIcon from "@mui/icons-material/Policy";
import LinkIcon from "@mui/icons-material/Link";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

interface DashboardStats {
  totalEmployees: number;
  totalPolicies: number;
  totalMappings: number;
  unassignedEmployees: number;
  unassignedPolicies: number;
  mostAssignedPolicy: {
    id: number;
    name: string;
    assignedCount: number;
  };
}

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const token = localStorage.getItem("token");

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await getDashboardStatsApi(token || "");
      setStats(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const dashboardCards = [
    {
      title: "Total Employees",
      value: stats?.totalEmployees || 0,
      icon: <PeopleIcon fontSize="medium" />,
      color: "#2563eb",
    },
    {
      title: "Total Policies",
      value: stats?.totalPolicies || 0,
      icon: <PolicyIcon fontSize="medium" />,
      color: "#059669",
    },
    {
      title: "Total Mappings",
      value: stats?.totalMappings || 0,
      icon: <LinkIcon fontSize="medium" />,
      color: "#7c3aed",
    },
    {
      title: "Unassigned Employees",
      value: stats?.unassignedEmployees || 0,
      icon: <WarningAmberIcon fontSize="medium" />,
      color: "#dc2626",
    },
  ];

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh" }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* 
         ✅ Padding Strategy: 
         pl: 3 (24px) provides a clean gutter from the sidebar.
         pr: 3 ensures balance on the right side.
      */}
      <Box sx={{ width: "100%", pt: 2, pl: 3, pr: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            marginBottom: "25px",
            color: "#0f172a",
          }}
        >
          Dashboard
        </Typography>

        <Grid container spacing={2}>
          {dashboardCards.map((card) => (
            <Grid key={card.title} size={{ xs: 12, sm: 6, md: 2.5 }}>
              <Paper
                elevation={2}
                sx={{
                  padding: "16px",
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box sx={{ color: card.color }}>{card.icon}</Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#475569" }}>
                  {card.title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#0f172a" }}>
                  {card.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* MOST ASSIGNED POLICY SECTION */}
        <Paper
          elevation={2}
          sx={{
            marginTop: "32px",
            padding: "20px",
            borderRadius: "12px",
            maxWidth: "450px", // ✅ Prevents the box from being "too big"
            border: "1px solid #e2e8f0"
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <WorkspacePremiumIcon sx={{ color: "#2563eb", fontSize: "1.4rem" }} />
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#0f172a" }}>
              Most Assigned Policy
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" sx={{ color: "#475569" }}>
              Policy Name: <strong style={{ color: "#0f172a" }}>{stats?.mostAssignedPolicy?.name || "-"}</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: "#475569" }}>
              Assigned Count: <strong style={{ color: "#0f172a" }}>{stats?.mostAssignedPolicy?.assignedCount || 0}</strong>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
}

export default Dashboard;
