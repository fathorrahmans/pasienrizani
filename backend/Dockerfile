# Gunakan image PHP 8 dengan Apache
    FROM php:8-apache

    WORKDIR /var/www/html

    RUN apt-get update && apt-get install -y \
        git \
        zip \
        unzip \
        libzip-dev \
        default-mysql-client \
        && docker-php-ext-install zip pdo pdo_mysql

    COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

    COPY . .

    RUN composer install --no-dev --optimize-autoloader

    EXPOSE 80

    CMD ["apache2-foreground"]
