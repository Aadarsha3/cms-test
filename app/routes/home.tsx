import { Box, Container } from "@mui/material";
import { Fragment } from "react/jsx-runtime";
import HomePage from "~/components/Home";
import HeaderPublic from "~/layout/HeaderPublic";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Edu Portal" },
    { name: "description", content: "Welcome to Edu Portal!" },
  ];
}

export default function Home() {
  return (
    <Fragment>
      <Box sx={{ bgcolor: 'background.paper' }}>
        <Container>
          <HeaderPublic onDrawerToggle={() => { }} />
        </Container>
      </Box>
      <Box sx={{ bgcolor: '#E3F2FD' }}>
        <HomePage />
      </Box>
    </Fragment>
  );
}
