import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Box, Stack, ThemeProvider, Typography, useTheme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import * as React from "react";
import ProfileMenu from "~/components/ProfileMenu";
import { useTokens } from "~/hooks/localstorage-hooks";
import { createThemeHelper } from "~/providers";

const lightColor = "rgba(255, 255, 255, 0.7)";

interface HeaderProps {
  onDrawerToggle: () => void;
}

export default function HeaderUser(props: HeaderProps) {
  const theme = useTheme();
  const [auth] = useTokens();

  const { onDrawerToggle } = props;

  return (
    <React.Fragment>
      <ThemeProvider theme={createThemeHelper("dark")}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{ bgcolor: theme.palette.primary.light }}
        >
          <Toolbar>
            <IconButton
              sx={{ display: { sm: "none", xs: "block" }, mr: 2 }}
              color="inherit"
              aria-label="open drawer"
              onClick={onDrawerToggle}
              edge="start"
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ flexGrow: 1 }}></Box>
            <Stack direction="row">
              <Tooltip title="Alerts • No alerts">
                <IconButton size="large">
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title={auth?.userinfo?.sub}>
                <ThemeProvider theme={theme}>
                  <ProfileMenu />
                </ThemeProvider>
              </Tooltip>
            </Stack>
          </Toolbar>
        </AppBar>
        <AppBar
          color="primary"
          position="static"
          elevation={0}
          sx={{ bgcolor: theme.palette.primary.light }}
        >
          <Toolbar>
            <Typography variant="h5" sx={{ flexGrow: 1 }}>
              Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </React.Fragment>
  );
}
