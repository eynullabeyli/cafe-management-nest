# 1. Rəsmi Node.js imici əsasında başlayırıq
FROM node:20-alpine

# 2. İş qovluğunu təyin edirik
WORKDIR /app

# 3. Package faylları kopyalanır və bağımlılıqlar quraşdırılır
COPY package*.json ./
RUN npm install

# 4. Bütün layihə fayllarını konteynerə kopyalayırıq
COPY . .

# 5. Təsvir edilmiş tətbiqi build edirik
RUN npm run build

# 6. Açıq port (NestJS-in default portu 3000-dir)
EXPOSE 3000

# 7. Tətbiqi işə salırıq (production üçün)
CMD ["npm", "run", "start:prod"]
