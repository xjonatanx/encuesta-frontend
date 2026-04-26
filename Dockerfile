# Cambiamos de 18-alpine a 22-alpine
FROM node:22-alpine

WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos (ahora sin errores de versión)
RUN npm install

# Copiamos el resto del código
COPY . .

# Construimos la app de Nuxt
RUN npm run build

EXPOSE 3000

# Comando para arrancar Nuxt
CMD ["node", ".output/server/index.mjs"]
