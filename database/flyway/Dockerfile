FROM flyway/flyway:9.22.3-alpine

# Installer Python pour le script de seeding
RUN apk add --no-cache python3 py3-pip
RUN pip3 install pandas mysql-connector-python

# Installer netcat pour vérifier la connexion MySQL
RUN apk add --no-cache netcat-openbsd

# Copier la configuration
COPY flyway.conf /flyway/conf/

# Copier le script d'entrée
COPY entrypoint.sh /flyway/entrypoint.sh
RUN chmod +x /flyway/entrypoint.sh

ENTRYPOINT ["/flyway/entrypoint.sh"]