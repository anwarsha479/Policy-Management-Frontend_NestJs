import { Box, Typography, IconButton,} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import PolicyIcon from "@mui/icons-material/Policy";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { NavLink,} from "react-router-dom";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const menuItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon />,
  },

  {
    title: "Employees",
    path: "/employees",
    icon: <PeopleIcon />,
  },

  {
    title: "Policies",
    path: "/policies",
    icon: <PolicyIcon />,
  },


];

function Sidebar({
  collapsed,
  setCollapsed,
}: SidebarProps) {

  return (

    <Box
      sx={{
        width: collapsed ? "80px" : "240px",
        height: "100vh",

        background:
          "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",

        color: "white",

        position: "fixed",

        top: 0,
        left: 0,

        transition: "width 0.3s ease",

        overflowX: "hidden",
        overflowY: "hidden",

        zIndex: 1300,

        boxShadow:
          "2px 0 10px rgba(0,0,0,0.15)",
      }}
    >

      {/* HEADER */}

      <Box
        sx={{
          height: "74px",

          display: "flex",

          alignItems: "center",

          justifyContent: collapsed
            ? "center"
            : "space-between",

          padding: collapsed
            ? "0"
            : "0 18px",

          borderBottom:
            "1px solid rgba(255,255,255,0.08)",
        }}
      >

        {!collapsed && (
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "white",
              letterSpacing: "0.5px",
            }}
          >
            Employee Data
          </Typography>
        )}

        <IconButton
          onClick={() =>
            setCollapsed(!collapsed)
          }
          sx={{
            color: "white",

            backgroundColor:
              "rgba(255,255,255,0.08)",

            "&:hover": {
              backgroundColor:
                "rgba(255,255,255,0.15)",
            },

            width: "36px",
            height: "36px",
          }}
        >

          {collapsed ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}

        </IconButton>

      </Box>

      {/* MENU */}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",

          marginTop: "18px",

          padding:
            collapsed
              ? "0 6px"
              : "0 10px",
        }}
      >

        {menuItems.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}

            style={({ isActive }) => ({
              display: "flex",

              alignItems: "center",

              justifyContent:
                collapsed
                  ? "center"
                  : "flex-start",

              gap: "14px",

              padding: collapsed
                ? "14px 0"
                : "14px 18px",

              borderRadius: "12px",

              color: "white",

              textDecoration: "none",

              backgroundColor:
                isActive
                  ? "#2563eb"
                  : "transparent",

              transition:
                "all 0.25s ease",

              fontWeight: 600,

              overflow: "hidden",
            })}
          >

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                minWidth: "24px",
              }}
            >
              {item.icon}
            </Box>

            {!collapsed && (
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                {item.title}
              </Typography>
            )}

          </NavLink>

        ))}

      </Box>

    </Box>

  );
}

export default Sidebar;