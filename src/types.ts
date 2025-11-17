export interface Flower {
  id: string;
  name: string;
  description: string;
  price: number;
  items: string[];
  image_path?: string; // allow optional for backend compatibility
}