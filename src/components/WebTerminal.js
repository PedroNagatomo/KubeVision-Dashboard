import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Select,
  MenuItem,
  Button
} from '@mui/material';
import TerminalIcon from '@mui/icons-material/Terminal';
import CloseIcon from '@mui/icons-material/Close';

const WebTerminal = ({ podName }) => {
  const [open, setOpen] = useState(false);
  const [container, setContainer] = useState('');
  const terminalRef = useRef(null);
  const term = useRef(null);
  const ws = useRef(null);

  const connectTerminal = () => {
    if (ws.current) ws.current.close();

    const socket = new WebSocket(`ws://localhost:3001/terminal/${podName}/${container}`);
    ws.current = socket;

    const fitAddon = new FitAddon();
    term.current = new Terminal({
      cursorBlink: true,
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4'
      }
    });

    term.current.loadAddon(fitAddon);
    term.current.open(terminalRef.current);
    fitAddon.fit();

    term.current.onData(data => {
      socket.send(JSON.stringify({ type: 'stdin', data }));
    });

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'stdout') {
        term.current.write(msg.data);
      }
    };
  };

  useEffect(() => {
    return () => {
      if (ws.current) ws.current.close();
      if (term.current) term.current.dispose();
    };
  }, []);

  return (
    <>
      <IconButton onClick={() => setOpen(true)} size="small">
        <TerminalIcon />
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Terminal - {podName}
          <IconButton onClick={() => setOpen(false)} sx={{ float: 'right' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
            <Select
              size="small"
              value={container}
              onChange={(e) => setContainer(e.target.value)}
            >
              <MenuItem value="">Selecionar container</MenuItem>
              <MenuItem value="dashboard">Dashboard</MenuItem>
            </Select>
            <Button 
              variant="contained" 
              onClick={connectTerminal}
              disabled={!container}
            >
              Conectar
            </Button>
          </Box>
          <div ref={terminalRef} style={{ height: '400px' }} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WebTerminal;
