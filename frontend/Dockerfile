# Gunakan base image Node.js versi 18 untuk tahap build
FROM node:18 as build

# Set working directory
WORKDIR /app

# Copy package.json dan package-lock.json (atau yarn.lock jika menggunakan Yarn)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy seluruh file aplikasi
COPY . .

# Build aplikasi React menggunakan Vite
RUN npm run build

# Gunakan image Nginx untuk container akhir
FROM nginx:alpine

# Copy folder dist (hasil build Vite) ke direktori Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]
