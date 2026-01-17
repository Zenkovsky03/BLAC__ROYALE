FROM node:22-alpine

WORKDIR /app/frontend

# Kopiujemy pliki zależności specyficzne dla frontendu
COPY frontend/package*.json ./
RUN npm install

# Kopiujemy resztę plików frontendu
COPY frontend/ .

EXPOSE 5173

# Odpalamy Vite w trybie host, żeby był dostępny poza kontenerem
CMD ["npm", "run", "dev", "--", "--host"]