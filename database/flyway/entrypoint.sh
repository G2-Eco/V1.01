#!/bin/sh

echo "⌛ Waiting for MySQL to be ready..."

# Attendre que MySQL soit prêt avec un timeout
max_attempts=60
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if nc -z mysql 3306; then
        echo "✅ MySQL is ready!"
        break
    fi
    attempt=$((attempt + 1))
    echo "⏳ Waiting for MySQL... (attempt $attempt/$max_attempts)"
    sleep 1
done

if [ $attempt -eq $max_attempts ]; then
    echo "❌ MySQL not ready after $max_attempts seconds"
    exit 1
fi

# Attendre un peu plus pour être sûr
sleep 3

echo "🚀 Running Flyway migrations..."
/flyway/flyway -configFiles=/flyway/conf/flyway.conf migrate

# Vérifier si le CSV existe
if [ -f "/data/walmart-products.csv" ]; then
    echo "📊 CSV file found, running data seeding..."
    python3 /flyway/sql/V3__seed_products.py
else
    echo "⚠️ CSV file not found at /data/walmart-products.csv"
    echo "📁 Listing /data directory:"
    ls -la /data/ 2>/dev/null || echo "No /data directory found"
fi

echo "🎉 Database setup completed!"