FROM mysql:8.0

# Copier les scripts d'initialisation
COPY 01_schema_utf8.sql /docker-entrypoint-initdb.d/01_schema.sql
COPY 02_data_utf8.sql /docker-entrypoint-initdb.d/02_data.sql

# Configurer UTF-8 par défaut
RUN echo "[client]\ndefault-character-set=utf8mb4\n[mysql]\ndefault-character-set=utf8mb4\n[mysqld]\ncharacter-set-server=utf8mb4\ncollation-server=utf8mb4_unicode_ci" >> /etc/mysql/conf.d/charset.cnf