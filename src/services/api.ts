const API_BASE = 'https://flowybackend.onrender.com/api/v1';

export const api = {
  async getBuyerInfo(buyerId: string, lang: string = 'en') {
    const response = await fetch(
      `${API_BASE}/buyer/start`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: buyerId, lang }),
      }
    );
    if (!response.ok) throw new Error('Failed to fetch buyer info');
    return (await response.json()).profile;
  },

  async getFlowers(lang: string = 'en') {
    const response = await fetch(
      `${API_BASE}/buyer/flowers?lang=${lang}`
    );
    if (!response.ok) throw new Error('Failed to fetch flowers');
    return (await response.json()).flowers;
  },

  async createOrder(_buyerId: string, _flowerId: string, _quantity: number) {
    // Placeholder: implement order creation if needed
    return { message: 'Order created (placeholder)' };
  },

  async getOrder(_orderId: string) {
    // Placeholder: implement get order if needed
    return {};
  },

  async generateCustomBouquet(buyerId: string, prompt: string, lang: string = 'en') {
    const response = await fetch(
      `${API_BASE}/buyer/create_custom`,
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
      `${API_BASE}/buyer/bids/${bouquetId}?lang=${lang}`
    );
    if (!response.ok) throw new Error('Failed to fetch bids');
    return (await response.json()).bids;
  },

  async acceptBid(buyerId: string, bidId: number, sellerId?: string, bouquetId?: string, lang: string = 'en') {
    const response = await fetch(
      `${API_BASE}/buyer/bids/accept`,
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
      `${API_BASE}/buyer/authenticate`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auth: encryptedId }),
      }
    );
    if (!response.ok) throw new Error('Failed to authenticate buyer');
    return await response.json();
  },
};
