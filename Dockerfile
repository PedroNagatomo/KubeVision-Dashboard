# Usar Node 20 que é compatível com react-router 7
FROM node:20-alpine

WORKDIR /app

# Instalar serve globalmente
RUN npm install -g serve

# Copiar arquivos de dependência
COPY package*.json ./

# Instalar TODAS as dependências (precisamos delas para o build)
RUN npm install

# Copiar código fonte
COPY . .

# Build do React
RUN npm run build

# Remover devDependencies para produção
RUN npm prune --production

# Expor portas
EXPOSE 3000
EXPOSE 3001

# Comando para iniciar tanto o frontend quanto o backend
CMD ["sh", "-c", "node server/index.js & serve -s build -l 3000"]