FROM php:apache
LABEL maintainer="Brad Treloar"
WORKDIR /app

# Re-create the HTTPD user with the given user and group IDs
# If USER_ID and GROUP_ID are set to those belonging to the host user, then
# HTTPD will be able to read and write files as if it were the host user.
ARG USER_ID
ARG GROUP_ID
RUN userdel -f www-data &&\ 
    if getent group www-data ; then groupdel www-data; fi &&\
    groupadd -g ${GROUP_ID} www-data &&\
    useradd -l -u ${USER_ID} -g www-data www-data &&\
    install -d -m 0755 -o www-data -g www-data /home/www-data &&\
    chown --changes --no-dereference --recursive --from=33:33 ${USER_ID}:${GROUP_ID} /home/www-data

# Link to custom vhosts.
RUN ln -s /etc/apache2/sites-available/vhosts.conf /etc/apache2/sites-enabled/vhosts.conf
RUN rm /etc/apache2/sites-enabled/000-default.conf

# Enable clean URLs.
RUN a2enmod rewrite

# Enable FastCGI proxy module.
RUN a2enmod proxy_fcgi

# Restart Apache.
RUN service apache2 restart
