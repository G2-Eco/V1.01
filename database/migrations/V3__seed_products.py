import pandas as pd
import mysql.connector
import os

def load_csv_to_db():
    # Configuration Docker MySQL
    DB_CONFIG = {
        "host": "mysql",  # Service name in docker-compose
        "user": "user",
        "password": "password",
        "database": "ecom",
        "port": 3306
    }
    
    # Chemin du CSV
    csv_path = os.getenv("CSV_PATH", "/data/walmart-products.csv")
    
    try:
        # 1. Lire le CSV
        print(f"📖 Reading CSV from {csv_path}")
        df = pd.read_csv(csv_path, dtype=str, low_memory=False)
        
        # 2. Se connecter à MySQL Docker
        print(f"🔗 Connecting to MySQL at {DB_CONFIG['host']}:{DB_CONFIG['port']}")
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # 3. Vérifier la table products
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS products (
                id BIGINT PRIMARY KEY AUTO_INCREMENT,
                item_name VARCHAR(255) NOT NULL,
                main_image VARCHAR(500),
                initial_price FLOAT NOT NULL,
                rating FLOAT,
                tags TEXT,
                categories TEXT,
                colors TEXT,
                sizes TEXT,
                ingredients TEXT,
                ingredients_full TEXT,
                customer_reviews TEXT,
                other_attributes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        """)
        conn.commit()
        
        # 4. Vider la table
        cursor.execute("DELETE FROM products")
        conn.commit()
        print("🧹 Cleared existing products")
        
        # 5. Insérer les données DANS LE BON FORMAT
        print(f"📝 Inserting {len(df)} products...")
        insert_query = """
        INSERT INTO products 
        (item_name, main_image, initial_price, rating, tags, categories, colors, sizes,
         ingredients, ingredients_full, customer_reviews, other_attributes)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        batch_size = 100
        for i in range(0, len(df), batch_size):
            batch = df.iloc[i:i+batch_size]
            batch_data = []
            
            for _, row in batch.iterrows():
                # Transformer les données pour correspondre à la table
                item_name = str(row.get('name', ''))[:255] if pd.notna(row.get('name')) else 'Unknown Product'
                main_image = str(row.get('main_image', ''))[:500] if pd.notna(row.get('main_image')) else ''
                
                # Convertir le prix en float
                try:
                    initial_price = float(row.get('initial_price', 0)) if pd.notna(row.get('initial_price')) else 0.0
                except:
                    initial_price = 0.0
                
                # Convertir le rating en float
                try:
                    rating = float(row.get('rating', 0)) if pd.notna(row.get('rating')) else 0.0
                except:
                    rating = 0.0
                
                # Préparer les autres champs
                tags = str(row.get('tags', '')) if pd.notna(row.get('tags')) else ''
                categories = str(row.get('categories', '')) if pd.notna(row.get('categories')) else ''
                colors = str(row.get('colors', '')) if pd.notna(row.get('colors')) else ''
                sizes = str(row.get('sizes', '')) if pd.notna(row.get('sizes')) else ''
                ingredients = str(row.get('ingredients', '')) if pd.notna(row.get('ingredients')) else ''
                ingredients_full = str(row.get('ingredients_full', '')) if pd.notna(row.get('ingredients_full')) else ingredients
                customer_reviews = str(row.get('customer_reviews', '')) if pd.notna(row.get('customer_reviews')) else ''
                other_attributes = str(row.get('other_attributes', '')) if pd.notna(row.get('other_attributes')) else '{}'
                
                batch_data.append((
                    item_name,
                    main_image,
                    initial_price,
                    rating,
                    tags,
                    categories,
                    colors,
                    sizes,
                    ingredients,
                    ingredients_full,
                    customer_reviews,
                    other_attributes
                ))
            
            cursor.executemany(insert_query, batch_data)
            conn.commit()
            print(f"  ✅ Inserted batch {i//batch_size + 1}/{(len(df)-1)//batch_size + 1}")
        
        print(f"✅ Successfully inserted {len(df)} products")
        
        # 6. Ajouter un admin
        cursor.execute("""
            INSERT INTO users (email, password, first_name, last_name, role, enabled, email_verified_at)
            VALUES ('admin@ecommerce.com', 
                    '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 
                    'Admin', 'System', 'ADMIN', true, NOW())
            ON DUPLICATE KEY UPDATE updated_at = NOW()
        """)
        conn.commit()
        print("👤 Admin user created/updated")
        
        # 7. Vérifier
        cursor.execute("SELECT COUNT(*) FROM products")
        count = cursor.fetchone()[0]
        print(f"📊 Total products in database: {count}")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        raise

if __name__ == "__main__":
    load_csv_to_db()