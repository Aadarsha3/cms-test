import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import WidgetsIcon from "@mui/icons-material/Widgets";
import SummarizeIcon from "@mui/icons-material/Summarize";
import SettingsIcon from "@mui/icons-material/Settings";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  useTheme,
} from "@mui/material";
import AppLogo from "~/components/AppLogo";
import { createThemeHelper } from "~/providers";

const itemCategory = {
  boxShadow: "0 -1px 0 rgb(255,255,255,0.1) inset",
  py: 1.5,
  px: 3,
};

export default function Sidebar() {
  const theme = useTheme();

  return (
    <ThemeProvider theme={createThemeHelper("dark")}>
      <Drawer
        sx={{ bgcolor: "background.primary" }}
        variant="permanent"
        open={true}
        anchor="left"
        slotProps={{
          paper: {
            sx: {
              position: "unset",
              height: "100vh",
              width: 250,
              bgcolor: theme.palette.primary.main,
            },
          },
        }}
      >
        <Box textAlign="center" sx={{ ...itemCategory, px: 1 }}>
          <AppLogo />
        </Box>
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <SpaceDashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <WidgetsIcon />
              </ListItemIcon>
              <ListItemText primary="Management" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <SummarizeIcon />
              </ListItemIcon>
              <ListItemText primary="Report" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <AdminPanelSettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Admin" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <GroupsIcon />
              </ListItemIcon>
              <ListItemText primary="Groups" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <AutoModeIcon />
              </ListItemIcon>
              <ListItemText primary="Key Rotation" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </ThemeProvider>
  );
}
