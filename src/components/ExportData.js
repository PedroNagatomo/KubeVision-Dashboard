import React, { useState } from 'react';
import { 
  Button, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText 
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CodeIcon from '@mui/icons-material/Code';
import TableChartIcon from '@mui/icons-material/TableChart';

const ExportData = ({ pods, nodes }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const exportJSON = () => {
    const data = { 
      pods, 
      nodes, 
      exportDate: new Date().toISOString(),
      totalPods: pods.length,
      totalNodes: nodes.length
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kubevision-export-${Date.now()}.json`;
    a.click();
    setAnchorEl(null);
  };

  const exportCSV = () => {
    const headers = ['Name', 'Namespace', 'Status', 'Node', 'Containers'];
    const rows = pods.map(p => [
      p.name,
      p.namespace,
      p.status,
      p.node,
      p.containers.map(c => c.name).join('; ')
    ]);
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pods-${Date.now()}.csv`;
    a.click();
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        startIcon={<FileDownloadIcon />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ mr: 1 }}
      >
        Exportar
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={exportJSON}>
          <ListItemIcon><CodeIcon fontSize="small" /></ListItemIcon>
          <ListItemText>JSON</ListItemText>
        </MenuItem>
        <MenuItem onClick={exportCSV}>
          <ListItemIcon><TableChartIcon fontSize="small" /></ListItemIcon>
          <ListItemText>CSV</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ExportData;
