import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, Chip } from '@mui/material';
import ComputerIcon from '@mui/icons-material/Computer';
import MemoryIcon from '@mui/icons-material/Memory';

const NodesStatus = ({ nodes }) => {
  return (
    <List>
      {nodes.map((node) => (
        <ListItem key={node.name}>
          <ListItemIcon>
            <ComputerIcon color={node.status === 'True' ? 'success' : 'error'} />
          </ListItemIcon>
          <ListItemText
            primary={node.name}
            secondary={
              <>
                <Chip 
                  label={node.status === 'True' ? 'Ready' : 'Not Ready'} 
                  color={node.status === 'True' ? 'success' : 'error'}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <MemoryIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                {node.capacity?.cpu || 'N/A'} CPU
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default NodesStatus;