import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useKube } from '../context/KubeContext';
import PodsList from '../components/PodsList';
import NodesStatus from '../components/NodesStatus';
import ResourceChart from '../components/ResourceChart';
import PodFilters from '../components/PodFilters';
import MetricsChart from '../components/MetricsChart';
import ExportData from '../components/ExportData';
import AnimatedCard from '../components/AnimatedCard';
import AlertSystem from '../components/AlertSystem';

const Dashboard = () => {
  const { pods, nodes, loading, fetchPods } = useKube();
  const [filteredPods, setFilteredPods] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <Typography variant="h4">🔄 Carregando dados do Kubernetes...</Typography>
    </Box>
  );

  const runningPods = pods.filter(p => p.status === 'Running').length;
  const failedPods = pods.filter(p => p.status === 'Failed').length;
  const pendingPods = pods.filter(p => p.status === 'Pending').length;

  const handleFilter = (filters) => {
    let filtered = [...pods];
    
    if (filters.search) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(p => p.status === filters.status);
    }
    
    if (filters.namespace !== 'all') {
      filtered = filtered.filter(p => p.namespace === filters.namespace);
    }
    
    setFilteredPods(filtered);
  };

  const displayPods = filteredPods.length > 0 ? filteredPods : pods;

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header com ações */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h3">
          🚀 KubeVision Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Atualizar dados">
            <IconButton onClick={fetchPods} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <AlertSystem pods={pods} />
          <ExportData pods={pods} nodes={nodes} />
          <Tooltip title="Filtros">
            <IconButton 
              onClick={() => setShowFilters(!showFilters)}
              color={showFilters ? 'secondary' : 'default'}
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Cards Animados */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <AnimatedCard
            title="Total Pods"
            value={pods.length}
            color="#1976d2"
            delay={0.1}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <AnimatedCard
            title="Running"
            value={runningPods}
            color="#4caf50"
            delay={0.2}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <AnimatedCard
            title="Failed"
            value={failedPods}
            color="#f44336"
            delay={0.3}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AnimatedCard
            title="Nodes"
            value={nodes.length}
            color="#ff9800"
            delay={0.4}
          />
        </Grid>
      </Grid>

      {/* Filtros */}
      {showFilters && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            🔍 Filtros Avançados
          </Typography>
          <PodFilters onFilter={handleFilter} pods={pods} />
          {filteredPods.length > 0 && (
            <Typography variant="body2" color="textSecondary">
              Mostrando {filteredPods.length} de {pods.length} pods
            </Typography>
          )}
        </Paper>
      )}

      {/* Conteúdo Principal */}
      <Grid container spacing={3}>
        {/* Gráfico de Métricas em Tempo Real */}
        <Grid item xs={12}>
          <MetricsChart pods={pods} />
        </Grid>

        {/* Lista de Pods */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">
                📦 Pods ({displayPods.length})
              </Typography>
            </Box>
            <PodsList pods={displayPods} />
          </Paper>
        </Grid>

        {/* Status dos Nodes */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              🖥️ Nodes Status
            </Typography>
            <NodesStatus nodes={nodes} />
          </Paper>
        </Grid>

        {/* Gráfico de Recursos */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              📊 Resource Usage
            </Typography>
            <ResourceChart pods={pods} />
          </Paper>
        </Grid>
      </Grid>

      {/* Footer */}
      <Box sx={{ textAlign: 'center', mt: 4, py: 2, borderTop: '1px solid #333' }}>
        <Typography variant="body2" color="textSecondary">
          KubeVision v1.0 • {pods.length} pods • {nodes.length} nodes • 
          Última atualização: {new Date().toLocaleString('pt-BR')}
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
