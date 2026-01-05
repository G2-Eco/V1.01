# Use the official MySQL 8.0 image as the base
FROM mysql:8.0

COPY 01_schema.sql /docker-entrypoint-initdb.d/
COPY 02_data.sql /docker-entrypoint-initdb.d/

# You can add more configuration here if needed