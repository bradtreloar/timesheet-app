FROM php:7.4-cli
LABEL maintainer="Brad Treloar"
WORKDIR /app

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql mysqli

# Install XDebug
RUN pecl install xdebug && docker-php-ext-enable xdebug

# Install Composer dependencies
RUN apt-get update -y && apt-get install -y zip unzip

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Add app directory to PATH (to allow "artisan" instead of "./artisan")
ENV PATH=${PATH}:/app
ENV PATH=${PATH}:/app/vendor/bin
