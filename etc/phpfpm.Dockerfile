FROM php:7.4-fpm
LABEL maintainer="Brad Treloar"
WORKDIR /app

# Re-create the FPM user with the given user and group IDs
# If USER_ID and GROUP_ID are set to those belonging to the host user, then the
# FPM will be able to read and write files as if it were the host user.
ARG USER_ID
ARG GROUP_ID
RUN userdel -f www-data &&\ 
    if getent group www-data ; then groupdel www-data; fi &&\
    groupadd -g ${GROUP_ID} www-data &&\
    useradd -l -u ${USER_ID} -g www-data www-data &&\
    install -d -m 0755 -o www-data -g www-data /home/www-data &&\
    chown --changes --no-dereference --recursive --from=33:33 ${USER_ID}:${GROUP_ID} /home/www-data

# Install PHP extensions.
RUN docker-php-ext-install pdo pdo_mysql mysqli

# Install XDebug.
RUN pecl install xdebug && docker-php-ext-enable xdebug
