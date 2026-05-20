import { Box } from "@mui/material";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface Props {
  children: React.ReactNode;
}

function Layout({ children }: Props) {
  // SIDEBAR STATE
  const [collapsed, setCollapsed] = useState(true);

  // SIDEBAR WIDTH
  const sidebarWidth = collapsed ? 80 : 240;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f1f5f9",
        overflowX: "hidden",
      }}
    >
      {/* SIDEBAR */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* MAIN CONTENT WRAPPER */}
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: `${sidebarWidth}px`,
          transition: "margin-left 0.3s ease",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden",
          width: `calc(100% - ${sidebarWidth}px)`,
        }}
      >
        {/* TOPBAR */}
        <Topbar collapsed={collapsed} />

        {/* PAGE CONTENT CONTAINER */}
        <Box
          component="main"
          sx={{
            padding: {
              xs: "90px 16px 16px 0px",
              md: "90px 24px 24px 0px",
            },
            flexGrow: 1,
            overflowX: "hidden",
            width: "100%",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;
