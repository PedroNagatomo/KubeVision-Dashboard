import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Paper, Typography, Box } from '@mui/material';

const MetricsChart = ({ pods }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const addDataPoint = () => {
      const now = new Date().toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
      
      const newPoint = {
        time: now,
        running: pods.filter(p => p.status === 'Running').length,
        failed: pods.filter(p => p.status === 'Failed').length,
        pending: pods.filter(p => p.status === 'Pending').length,
        total: pods.length
      };

      setData(prev => {
        const updated = [...prev, newPoint];
        return updated.slice(-20); // Manter últimos 20 pontos
      });
    };

    addDataPoint();
    const interval = setInterval(addDataPoint, 5000);
    return () => clearInterval(interval);
  }, [pods]);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        📈 Métricas em Tempo Real
      </Typography>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="running" 
            stroke="#4caf50" 
            fill="#4caf50" 
            fillOpacity={0.3} 
            name="Running"
          />
          <Area 
            type="monotone" 
            dataKey="failed" 
            stroke="#f44336" 
            fill="#f44336" 
            fillOpacity={0.3} 
            name="Failed"
          />
          <Area 
            type="monotone" 
            dataKey="pending" 
            stroke="#ff9800" 
            fill="#ff9800" 
            fillOpacity={0.3} 
            name="Pending"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default MetricsChart;
