export interface Product {
  id: number;
  itemName: string;
  description: string;
  price: number;
  quantity: number;
  category: string; // mapped from categories
  brand: string;
  sku: string;
  weight: number;
  dimensions: string;
  materials: string;
  tags: string;
  mainImage: string;
  images: string; // JSON array string
  rating: number | null;
  sizes: string; // JSON array string
  colors: string; // JSON array string
  otherAttributes: string;
  customerReviews: string;
  ingredients: string;
  initialPrice: number | null;
  ingredientsFull: string;
  categories: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}