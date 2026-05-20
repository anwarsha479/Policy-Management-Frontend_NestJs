import { Box, Typography, Avatar, IconButton, Button } from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";

import LogoutIcon from "@mui/icons-material/Logout";

interface Props {
  collapsed?: boolean;
}

function Topbar({ collapsed = true }: Props) {
  // ✅ SIDEBAR WIDTH

  const sidebarWidth = collapsed ? 80 : 240;

  // ✅ USER EMAIL

  const email = localStorage.getItem("email");

  // ✅ LOGOUT

  const handleLogout = () => {
    localStorage.clear();

    window.location.href = "/";
  };

  return (
    <Box
      sx={{
        height: "70px",

        backgroundColor: "#0f172a",

        display: "flex",

        alignItems: "center",

        justifyContent: "space-between",

        padding: {
          xs: "0 16px",
          md: "0 24px",
        },

        position: "fixed",

        top: 0,

        right: 0,

        left: `${sidebarWidth}px`,

        transition: "left 0.3s ease",

        zIndex: 1200,

        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",

        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* LEFT SIDE */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "white",

            fontWeight: "bold",

            letterSpacing: "0.3px",

            display: {
              xs: "none",
              sm: "block",
            },
          }}
        >
          Policy Management System
        </Typography>
      </Box>

      {/* RIGHT SIDE */}

      <Box
        sx={{
          display: "flex",

          alignItems: "center",

          gap: {
            xs: "10px",
            md: "18px",
          },
        }}
      >
        {/* NOTIFICATION */}

        <IconButton
          sx={{
            color: "white",

            backgroundColor: "rgba(255,255,255,0.08)",

            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.15)",
            },

            width: "40px",
            height: "40px",
          }}
        >
          <NotificationsIcon />
        </IconButton>

        {/* USER */}

        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            gap: "10px",
          }}
        >
          <Avatar
            sx={{
              backgroundColor: "#2563eb",

              width: "38px",
              height: "38px",

              fontSize: "16px",

              fontWeight: "bold",
            }}
          >
            {email?.charAt(0).toUpperCase()}
          </Avatar>

          <Typography
            sx={{
              color: "white",

              fontWeight: 500,

              fontSize: "15px",

              display: {
                xs: "none",
                md: "block",
              },
            }}
          >
            {email}
          </Typography>
        </Box>

        {/* LOGOUT */}

        <Button
          variant="contained"
          color="error"
          size="small"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            borderRadius: "10px",

            textTransform: "none",

            fontWeight: "bold",

            padding: "6px 14px",

            boxShadow: "none",

            "&:hover": {
              boxShadow: "none",
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
}

export default Topbar;
