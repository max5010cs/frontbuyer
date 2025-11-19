export interface Location {
  lat: number;
  lon: number;
}

export interface Buyer {
  id: number;
  name: string;
  location: Location;
}

export interface Flower {
  id: string;
  name: string;
  price: number;
  image?: string;
  image_url?: string;
  image_path?: string; // add this for backend compatibility
  description?: string;
  seller_name?: string;
  status?: string;
  items?: string[];
}

export interface CustomBouquet {
  bouquet_id: number;
  image_url: string;
  items: string[];
}

export interface Bid {
  bid_id: number;
  seller_name: string;
  seller_address: string;
  price: number;
  status: string;
  image_url: string;
  created_at: string;
}

export interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  flower_id?: string;
  bouquet_id?: string;
  bid_id?: string;
  status: string;
  pickup_info?: string;
  price?: number;
  buyer_name?: string;
  image_url?: string;
  pickup_time?: string;
}
