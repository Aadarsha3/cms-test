import MenuIcon from '@mui/icons-material/Menu';
import { Box, Link, Stack } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';
import Logo from '~/components/Logo';

const lightColor = 'rgba(255, 255, 255, 0.7)';

interface HeaderProps {
  onDrawerToggle: () => void;
}

export default function HeaderPublic(props: HeaderProps) {
  const { onDrawerToggle } = props;

  return (
    <React.Fragment>
      <AppBar color="transparent" position="sticky" elevation={0}>
        <Toolbar>
          <IconButton
            sx={{ display: { sm: 'none', xs: 'block' }, mr: 2 }}
            color="inherit"
            aria-label="open drawer"
            onClick={onDrawerToggle}
            edge="start"
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }}>
            <Logo />
          </Box>
          <Stack direction="row">
            <Link>Contact Us</Link>
          </Stack>
        </Toolbar>
      </AppBar>
    </React.Fragment >
  );
}
