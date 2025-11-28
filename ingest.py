import pandas as pd
import mysql.connector
import math

# 1. Read CSV
df = pd.read_csv("walmart-products.csv", dtype=str)  # read everything as string first

# 2. Convert numeric columns safely
for col in ["rating","unit_price","initial_price","discount"]:
    if col in df.columns:
        df[col] = pd.to_numeric(df[col], errors='coerce')  # invalid strings -> NaN

# 3. Convert boolean column
if "free_returns" in df.columns:
    df["free_returns"] = df["free_returns"].map({'true': 1, 'false': 0, True: 1, False: 0})

# 4. Replace NaN with None for MySQL
df = df.where(pd.notnull(df), None)

# 5. Connect to MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="ecom"
)
cursor = conn.cursor()

# 6. Insert rows
insert_query = """
INSERT INTO products
(category_name, category_path, root_category_url, root_category_name, upc, tags, main_image, rating,
 unit_price, unit, aisle, free_returns, sizes, colors, seller, other_attributes,
 customer_reviews, ingredients, initial_price, discount, ingredients_full, categories)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

for _, row in df.iterrows():
    cursor.execute(insert_query, tuple(row[col] for col in [
        "category_name","category_path","root_category_url","root_category_name","upc","tags","main_image","rating",
        "unit_price","unit","aisle","free_returns","sizes","colors","seller","other_attributes",
        "customer_reviews","ingredients","initial_price","discount","ingredients_full","categories"
    ]))

conn.commit()
cursor.close()
conn.close()

print("CSV imported successfully!")
