FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
# Para Nuxt 3, el comando por defecto suele ser este:
CMD ["node", ".output/server/index.mjs"]
