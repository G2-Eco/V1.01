# Dockerfile inside mysql-image/
FROM mysql:8.0
# Copy your SQL files into the initialization directory
COPY ./init/01_schema.sql /docker-entrypoint-initdb.d/
COPY ./init/02_data.sql /docker-entrypoint-initdb.d/
# You may also want to set environment variables here
ENV MYSQL_DATABASE=ecom
# ... others