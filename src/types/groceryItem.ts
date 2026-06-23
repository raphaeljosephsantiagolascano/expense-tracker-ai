export type GroceryItem = {
  id: string;
  name: string;
  barcode?: string;
  image?: string;
  quantity: number;
  estimatedPrice: number;
  category: string;
  purchased: boolean;
};
