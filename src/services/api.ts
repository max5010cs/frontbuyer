import type { Flower } from '../types';

const API_BASE = 'https://flowybackend.onrender.com'; 

export const api = {
  async getBuyerInfo(buyerId: string, lang: string = 'en') {
    const response = await fetch(
      `${API_BASE}/api/v1/buyer/start`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: buyerId, lang }),
      }
    );
    if (!response.ok) throw new Error('Failed to fetch buyer info');
    return (await response.json()).profile;
  },

  async getFlowers(): Promise<Flower[]> {
    const response = await fetch(`${API_BASE}/api/v1/seller/flowers`);
    if (!response.ok) throw new Error('Failed to fetch flowers');
    return await response.json();
  },

  async createOrder(buyerId: string, flowerId: string, quantity: number) {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        buyer_id: buyerId,
        flower_id: flowerId,
        quantity: quantity,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to create order');
    }
    return await response.json();
  },

  async getOrder(_orderId: string) {
    // Placeholder: implement get order if needed
    return {};
  },

  async generateCustomBouquet(buyerId: string, prompt: string, lang: string = 'en') {
    const response = await fetch(
      `${API_BASE}/api/v1/buyer/create_custom`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: buyerId, description: prompt, lang }),
      }
    );
    if (!response.ok) throw new Error('Failed to generate bouquet');
    return (await response.json()).custom_bouquet;
  },

  async createBid(_bouquetId: number, _sellerId?: string) {
    // Not used in buyer flow, placeholder
    return {};
  },

  async getBids(bouquetId: number, lang: string = 'en') {
    const response = await fetch(
      `${API_BASE}/api/v1/buyer/bids/${bouquetId}?lang=${lang}`
    );
    if (!response.ok) throw new Error('Failed to fetch bids');
    return (await response.json()).bids;
  },

  async acceptBid(buyerId: string, bidId: number, sellerId?: string, bouquetId?: string, lang: string = 'en') {
    const response = await fetch(
      `${API_BASE}/api/v1/buyer/bids/accept`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: buyerId, bid_id: bidId, seller_id: sellerId, bouquet_id: bouquetId, lang }),
      }
    );
    if (!response.ok) throw new Error('Failed to accept bid');
    return await response.json();
  },

  async authenticateBuyer(encryptedId: string) {
    const response = await fetch(
      `${API_BASE}/api/v1/buyer/authenticate`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auth: encryptedId }),
      }
    );
    if (!response.ok) throw new Error('Failed to authenticate buyer');
    return await response.json();
  },

  async getOrderLocationInfo(flowerId: string, buyerId?: string) {
    const response = await fetch(
      `${API_BASE}/api/v1/buyer/order_location_info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flower_id: flowerId, buyer_id: buyerId }),
      }
    );
    if (!response.ok) throw new Error('Failed to fetch order location info');
    return await response.json();
  },
};
