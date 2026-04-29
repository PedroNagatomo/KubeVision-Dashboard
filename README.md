# 🚀 KubeVision - Kubernetes Real-Time Dashboard


Dashboard em tempo real para monitoramento de clusters Kubernetes, construído com React 18 e Material-UI.

## ✨ Funcionalidades

- 📊 **Dashboard em tempo real** com métricas de pods e nodes
- 📋 **Lista de Pods** com status, logs e ações
- 🖥️ **Monitoramento de Nodes** com capacidade e status
- 📈 **Gráficos de recursos** (CPU/Memória) por pod
- 🗑️ **Gerenciamento de Pods** (visualizar logs, deletar)
- 🔄 **Atualizações em tempo real** via WebSocket
- 🎨 **Interface moderna** com Material-UI Dark Theme
- 🐳 **Containerizado** com Docker
- ☸️ **Deploy no Kubernetes** com RBAC e Service Account

## 🛠️ Tecnologias

- **Frontend:** React 18, Material-UI, Recharts, React Router
- **Backend:** Node.js, Express, WebSocket
- **Kubernetes:** @kubernetes/client-node API
- **DevOps:** Docker, Kind, kubectl

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- Docker
- kubectl
- Kind (ou Minikube)

### Passos

1. **Criar cluster Kubernetes**
```bash
kind create cluster --name kubevision-cluster
```
2. Criar namespace
```bash
kubectl create namespace kubevision
```
3. Build da imagem
```bash
docker build -t kubevision:latest .
kind load docker-image kubevision:latest --name kubevision-cluster
```
4. Deploy
```bash
kubectl apply -f k8s/dashboard-deployment.yaml
kubectl apply -f k8s/sample-apps.yaml
```
5. Acessar
```bash
kubectl port-forward -n kubevision svc/kubevision-service 8080:80
# Abrir http://localhost:8080
🎯 Aprendizados
Este projeto demonstra conhecimentos em:
```
✅ Desenvolvimento React moderno (Hooks, Context API)

✅ Integração com API Kubernetes

✅ Comunicação em tempo real (WebSocket)

✅ Containerização com Docker

✅ Orquestração com Kubernetes (Deployments, Services, RBAC)

✅ Monitoramento e observabilidade

✅ Arquitetura de microsserviços

📝 Licença
MIT

Desenvolvido como projeto de estudos em Kubernetes e React
