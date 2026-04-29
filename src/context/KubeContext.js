import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const KubeContext = createContext();

export const useKube = () => useContext(KubeContext);

export const KubeProvider = ({ children }) => {
  const [pods, setPods] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:3001/api';

  const fetchPods = async () => {
    try {
      const response = await axios.get(`${API_URL}/pods`);
      setPods(response.data);
    } catch (err) {
      setError('Failed to fetch pods');
    }
  };

  const fetchNodes = async () => {
    try {
      const response = await axios.get(`${API_URL}/nodes`);
      setNodes(response.data);
    } catch (err) {
      setError('Failed to fetch nodes');
    }
  };

  const deletePod = async (name) => {
    try {
      await axios.delete(`${API_URL}/pods/${name}`);
      await fetchPods();
    } catch (err) {
      setError('Failed to delete pod');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchPods(), fetchNodes()]);
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <KubeContext.Provider value={{ pods, nodes, loading, error, deletePod, fetchPods }}>
      {children}
    </KubeContext.Provider>
  );
};