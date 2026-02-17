import { Box, Container } from "@mui/material";
import { Outlet } from "react-router";
import HeaderUser from "~/layout/HeaderUser";
import Sidebar from "~/layout/Sidebar";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Dashboard" },
    { name: "description", content: "Dashboard" },
  ];
}

export default function Dashboard() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box flexGrow={1}>
        <Box sx={{ bgcolor: 'background.paper' }}>
          <HeaderUser onDrawerToggle={() => { }} />
        </Box>
        <Container sx={{ pt: 10, pb: 15 }}>
          <Outlet />
        </Container>
      </Box>
    </Box >
  );
}
