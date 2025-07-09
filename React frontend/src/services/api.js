// API Service
const API_BASE = 'http://localhost:8000/api';

export const api = {
    getProducts: async () => {
        const response = await fetch(`${API_BASE}/products/`);
        return response.json();
    },
    
    searchProducts: async (query) => {
        const response = await fetch(`${API_BASE}/products/search/?q=${encodeURIComponent(query)}`);
        return response.json();
    },
    
    createSale: async (saleData) => {
        const response = await fetch(`${API_BASE}/sales/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(saleData),
        });
        return response.json();
    },
    
    getDashboardStats: async () => {
        const response = await fetch(`${API_BASE}/sales/dashboard_stats/`);
        return response.json();
    },
    
    getTodaySales: async () => {
        const response = await fetch(`${API_BASE}/sales/today_sales/`);
        return response.json();
    }
};