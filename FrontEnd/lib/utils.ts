export const safeParseJSON = <T>(jsonString: string, fallback: T): T => {
  try {
    const cleaned = jsonString.replace(/^"|"$/g, '');
    return JSON.parse(cleaned);
  } catch {
    return fallback;
  }
};

export const cleanImageUrl = (imageUrl: string): string => {
  return imageUrl.replace(/^"|"$/g, '');
};

export const formatPrice = (price: number | null): string => {
  if (!price) return 'Price varies';
  return `$${price.toFixed(2)}`;
};