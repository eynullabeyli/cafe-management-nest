# Rəsmi Next.js image-dən istifadə edirik
FROM node:20-alpine

# Build zamanı gələcək dəyişən
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# İş qovluğu təyin edirik
WORKDIR /app

# package.json və lock fayllarını kopyalayırıq
COPY package*.json ./

# Lazımi bağımlılıqları quraşdırırıq
RUN npm install

# Bütün layihəni kopyalayırıq
COPY . .

# Tətbiqi build edirik
RUN npm run build

# Next.js üçün default port
EXPOSE 3000

# Tətbiqi işə salırıq
CMD ["npm", "run", "start"]
