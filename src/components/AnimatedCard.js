import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const AnimatedCard = ({ title, value, color, delay = 0 }) => {
  return (
    <Card 
      sx={{ 
        bgcolor: color, 
        color: 'white',
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 6
        }
      }}
    >
      <CardContent>
        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
          {title}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AnimatedCard;
