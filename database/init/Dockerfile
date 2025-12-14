# Use the official MySQL 8.0 image as the base
FROM mysql:8.0

# Copy the initialization scripts into the directory where MySQL looks for them.
# The `initdb.d` folder is special and executes any .sql, .sh, or .gz files 
# found there when the container starts for the *first* time.
COPY 01_schema.sql /docker-entrypoint-initdb.d/
COPY 02_data.sql /docker-entrypoint-initdb.d/

# You can add more configuration here if needed