import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const ResourceChart = ({ pods }) => {
  const data = pods
    .filter(pod => pod.status === 'Running')
    .map(pod => ({
      name: pod.name.substring(0, 20),
      containers: pod.containers.length,
      memory: pod.containers.reduce((acc, c) => {
        if (c.resources?.requests?.memory) {
          const mem = c.resources.requests.memory;
          return acc + (mem.includes('Mi') ? parseInt(mem) : 0);
        }
        return acc;
      }, 0),
      cpu: pod.containers.reduce((acc, c) => {
        if (c.resources?.requests?.cpu) {
          const cpu = c.resources.requests.cpu;
          return acc + (cpu.includes('m') ? parseInt(cpu) : parseInt(cpu) * 1000);
        }
        return acc;
      }, 0),
    }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="memory" fill="#8884d8" name="Memory (Mi)" />
        <Bar dataKey="cpu" fill="#82ca9d" name="CPU (m)" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ResourceChart;