import React, { useState, useEffect } from 'react';
import { 
  Badge, 
  IconButton, 
  Popover, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Typography 
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

const AlertSystem = ({ pods }) => {
  const [alerts, setAlerts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const newAlerts = [];
    
    const failedPods = pods.filter(p => p.status === 'Failed');
    if (failedPods.length > 0) {
      newAlerts.push({
        type: 'error',
        message: `${failedPods.length} pods com falha`,
        icon: <ErrorIcon color="error" />
      });
    }

    const pendingPods = pods.filter(p => p.status === 'Pending');
    if (pendingPods.length > 0) {
      newAlerts.push({
        type: 'warning',
        message: `${pendingPods.length} pods pendentes`,
        icon: <WarningIcon color="warning" />
      });
    }

    setAlerts(newAlerts);
  }, [pods]);

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Badge badgeContent={alerts.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <List sx={{ width: 300 }}>
          {alerts.length === 0 ? (
            <ListItem>
              <ListItemText primary="✅ Nenhum alerta" />
            </ListItem>
          ) : (
            alerts.map((alert, index) => (
              <ListItem key={index}>
                <ListItemIcon>{alert.icon}</ListItemIcon>
                <ListItemText primary={alert.message} />
              </ListItem>
            ))
          )}
        </List>
      </Popover>
    </>
  );
};

export default AlertSystem;
