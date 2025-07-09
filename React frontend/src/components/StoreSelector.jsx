// components/StoreSelector.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StoreSelector = ({ onStoreSelect, selectedStore }) => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await axios.get('/api/stores/');
      setStores(response.data);
      if (response.data.length > 0 && !selectedStore) {
        onStoreSelect(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-4">Loading stores...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">Select Store</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stores.map((store) => (
          <div
            key={store.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
              selectedStore?.id === store.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => onStoreSelect(store)}
          >
            <h3 className="font-semibold text-gray-800">{store.name}</h3>
            <p className="text-sm text-gray-600">{store.address}</p>
            <p className="text-sm text-gray-600">{store.phone}</p>
            {store.manager && (
              <p className="text-sm text-blue-600 mt-2">
                Manager: {store.manager}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreSelector;