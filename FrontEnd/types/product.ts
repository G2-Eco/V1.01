export interface Product {
  id: number;
  itemName: string;
  tags: string;
  mainImage: string;
  rating: number | null;
  sizes: string;
  colors: string;
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