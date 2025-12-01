FROM node:20-alpine
WORKDIR /app
COPY package.json vite.config.js tsconfig.json ./
RUN npm install
COPY index.html ./
COPY postcss.config.js ./
COPY tailwind.config.ts ./
COPY src ./src
RUN npm run build || true
EXPOSE 5173
CMD ["npm","run","dev"]
