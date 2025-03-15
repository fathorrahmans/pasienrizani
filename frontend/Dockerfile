# Gunakan image Node.js 18
    FROM node:18-alpine

    WORKDIR /app

    COPY package*.json ./

    RUN npm install

    COPY . .

    RUN npm run build

    # Gunakan Nginx untuk menyajikan file build
    FROM nginx:alpine

    # Modifikasi baris ini untuk menggunakan /app/dist
    COPY dist /usr/share/nginx/html

    EXPOSE 80

    CMD ["nginx", "-g", "daemon off;"]