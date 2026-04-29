import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArticleIcon from '@mui/icons-material/Article';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useKube } from '../context/KubeContext';
import axios from 'axios';

const PodsList = ({ pods }) => {
  const { deletePod } = useKube();
  const [selectedPod, setSelectedPod] = useState(null);
  const [logs, setLogs] = useState('');
  const [logOpen, setLogOpen] = useState(false);

  const fetchLogs = async (podName) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/pods/${podName}/logs`);
      setLogs(response.data);
      setSelectedPod(podName);
      setLogOpen(true);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Running': return 'success';
      case 'Pending': return 'warning';
      case 'Failed': return 'error';
      default: return 'default';
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Pod Name</TableCell>
              <TableCell>Namespace</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Node</TableCell>
              <TableCell>Containers</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pods.map((pod) => (
              <TableRow key={pod.name}>
                <TableCell>{pod.name}</TableCell>
                <TableCell>{pod.namespace}</TableCell>
                <TableCell>
                  <Chip 
                    label={pod.status} 
                    color={getStatusColor(pod.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{pod.node}</TableCell>
                <TableCell>
                  {pod.containers.map(c => c.name).join(', ')}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => fetchLogs(pod.name)} size="small">
                    <ArticleIcon />
                  </IconButton>
                  <IconButton onClick={() => deletePod(pod.name)} size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={logOpen} onClose={() => setLogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Logs for {selectedPod}
          <IconButton onClick={() => selectedPod && fetchLogs(selectedPod)}>
            <RefreshIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Paper sx={{ p: 2, bgcolor: '#1e1e1e', color: '#fff', maxHeight: '400px', overflow: 'auto' }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {logs || 'No logs available'}
            </pre>
          </Paper>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PodsList;