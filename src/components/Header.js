import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import KubernetesIcon from '@mui/icons-material/Cloud';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit">
          <KubernetesIcon />
        </IconButton>
        <Typography variant="h6">
          KubeVision Dashboard
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="body2">
          Kubernetes Monitoring
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;