import React, { useState } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  IconButton,
  InputAdornment,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const PodFilters = ({ onFilter, pods }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [namespaceFilter, setNamespaceFilter] = useState('all');

  const namespaces = [...new Set(pods.map(p => p.namespace))];
  const statuses = [...new Set(pods.map(p => p.status))];

  const applyFilters = () => {
    onFilter({
      search,
      status: statusFilter,
      namespace: namespaceFilter
    });
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setNamespaceFilter('all');
    onFilter({ search: '', status: 'all', namespace: 'all' });
  };

  const hasActiveFilters = search || statusFilter !== 'all' || namespaceFilter !== 'all';

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
      <TextField
        size="small"
        placeholder="Buscar pods por nome..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          applyFilters();
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: search && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => {
                setSearch('');
                applyFilters();
              }}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
        sx={{ minWidth: 250 }}
      />
      
      <FormControl size="small" sx={{ minWidth: 130 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={statusFilter}
          label="Status"
          onChange={(e) => {
            setStatusFilter(e.target.value);
            applyFilters();
          }}
        >
          <MenuItem value="all">Todos</MenuItem>
          {statuses.map(s => (
            <MenuItem key={s} value={s}>{s}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Namespace</InputLabel>
        <Select
          value={namespaceFilter}
          label="Namespace"
          onChange={(e) => {
            setNamespaceFilter(e.target.value);
            applyFilters();
          }}
        >
          <MenuItem value="all">Todos</MenuItem>
          {namespaces.map(n => (
            <MenuItem key={n} value={n}>{n}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {hasActiveFilters && (
        <Chip 
          label="Limpar filtros" 
          onDelete={clearFilters}
          color="primary"
          variant="outlined"
        />
      )}
    </Box>
  );
};

export default PodFilters;
