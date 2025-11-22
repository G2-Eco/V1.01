"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  itemName: string;
  categories: string;
  initialPrice: number;
  mainImage: string;   // <--- REQUIRED TO FIX ERROR
  tags?: string;
};

export default function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);


  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-10">

      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>

        <Link
          href="/products/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
        >
          + Add Product
        </Link>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => {
          const cleanImage = p.mainImage?.replace(/"/g, "");

          return (
            <div
              key={p.id}
              className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition flex flex-col"
            >
              {/* IMAGE */}
              <img
                src={cleanImage}
                alt={p.itemName}
                className="w-full h-48 object-cover rounded-xl mb-4"
onError={(e) => {
  const img = e.target as HTMLImageElement;
  img.src = "/fallback.jpg";
}}
              />

              {/* TEXT */}
              <h2 className="text-xl font-semibold mb-1">{p.itemName}</h2>
              <p className="text-gray-600 text-sm mb-2">{p.categories}</p>

              <p className="text-gray-800 font-bold mb-4">
                ${p.initialPrice}
              </p>

              {/* ACTIONS */}
              <div className="flex gap-3 mt-auto">
                <Link
                  href={`/products/${p.id}`}
                  className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Edit
                </Link>

                <button
                  onClick={async () => {
                    await fetch(`http://localhost:8080/api/products/${p.id}`, {
                      method: "DELETE",
                    });
                    fetchProducts();
                  }}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
