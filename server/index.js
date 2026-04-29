const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const k8s = require('@kubernetes/client-node');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());

// Configuração do cliente Kubernetes
const kc = new k8s.KubeConfig();
kc.loadFromDefault();

// Namespace fixo
const NAMESPACE = 'kubevision';

console.log('==================================================');
console.log('🚀 KubeVision Backend Iniciando');
console.log('📦 Namespace:', NAMESPACE);
console.log('==================================================');

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

wss.on('connection', (ws) => {
  console.log('🟢 WebSocket conectado');
  ws.on('close', () => console.log('🔴 WebSocket desconectado'));
});

// Rota: Listar Pods
app.get('/api/pods', async (req, res) => {
  try {
    console.log('📋 GET /api/pods - Namespace:', NAMESPACE);
    
    // SOLUÇÃO: Passar como string template ou garantir que é string pura
    const namespaceStr = String(NAMESPACE);
    console.log('📋 Valor do namespaceStr:', namespaceStr, '| tipo:', typeof namespaceStr);
    
    const response = await k8sApi.listNamespacedPod(namespaceStr);
    
    console.log('✅ Response body:', typeof response.body);
    console.log('✅ Pods encontrados:', response.body?.items?.length || 0);
    
    const pods = response.body.items.map(pod => ({
      name: pod.metadata.name,
      namespace: pod.metadata.namespace,
      status: pod.status.phase,
      node: pod.spec.nodeName,
      containers: pod.spec.containers.map(c => ({
        name: c.name,
        image: c.image
      })),
      createdAt: pod.metadata.creationTimestamp
    }));
    
    res.json(pods);
  } catch (error) {
    console.error('❌ ERRO em /api/pods:', error.message);
    console.error('❌ Detalhes:', JSON.stringify(error, null, 2));
    res.status(500).json({ 
      error: error.message,
      namespace_used: NAMESPACE
    });
  }
});

// Rota: Listar Nodes
app.get('/api/nodes', async (req, res) => {
  try {
    console.log('🖥️  GET /api/nodes');
    const response = await k8sApi.listNode();
    console.log('✅ Response status:', response.response?.statusCode);
    console.log('✅ Response body type:', typeof response.body);
    console.log('✅ Items:', response.body?.items?.length);
    
    if (!response.body || !response.body.items) {
      console.error('❌ Response body inválido:', response.body);
      return res.status(500).json({ error: 'Resposta inválida da API Kubernetes' });
    }
    
    const nodes = response.body.items.map(node => ({
      name: node.metadata.name,
      status: node.status.conditions.find(c => c.type === 'Ready')?.status,
      capacity: node.status.capacity,
      allocatable: node.status.allocatable
    }));
    
    res.json(nodes);
  } catch (error) {
    console.error('❌ ERRO em /api/nodes:', error.message);
    console.error('❌ Detalhes:', JSON.stringify(error, null, 2));
    res.status(500).json({ error: error.message });
  }
});

// Rota: Logs do Pod
app.get('/api/pods/:name/logs', async (req, res) => {
  try {
    const { name } = req.params;
    console.log('📜 GET /api/pods/' + name + '/logs');
    const response = await k8sApi.readNamespacedPodLog(name, NAMESPACE);
    res.send(response.body);
  } catch (error) {
    console.error('❌ ERRO em logs:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Rota: Deletar Pod
app.delete('/api/pods/:name', async (req, res) => {
  try {
    const { name } = req.params;
    console.log('🗑️  DELETE /api/pods/' + name);
    await k8sApi.deleteNamespacedPod(name, NAMESPACE);
    res.json({ message: 'Pod ' + name + ' deletado' });
  } catch (error) {
    console.error('❌ ERRO ao deletar:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    namespace: NAMESPACE,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log('✅ Backend ouvindo na porta', PORT);
});
