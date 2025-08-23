import React, { useState } from 'react';

function ManageInventoryModal({ products, onClose, onUpdateInventory }) {
    const [stockLevels, setStockLevels] = useState(
        products.reduce((acc, p) => ({ ...acc, [p.id]: p.stock_quantity }), {})
    );

    const handleStockChange = (productId, value) => {
        const newStock = parseInt(value, 10);
        if (!isNaN(newStock)) {
            setStockLevels(prev => ({ ...prev, [productId]: newStock }));
        }
    };

    const handleSave = () => {
        const updatedProducts = products.filter(p => p.stock_quantity !== stockLevels[p.id]);
        onUpdateInventory(updatedProducts, stockLevels);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6">Manage Inventory</h2>
                <div className="max-h-96 overflow-y-auto space-y-4">
                    {products.map(product => (
                        <div key={product.id} className="flex items-center justify-between p-2 border rounded">
                            <span className="font-medium">{product.name}</span>
                            <input
                                type="number"
                                value={stockLevels[product.id]}
                                onChange={e => handleStockChange(product.id, e.target.value)}
                                className="w-24 p-1 border rounded text-center"
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
                    <button type="button" onClick={handleSave} className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700">Save Changes</button>
                </div>
            </div>
        </div>
    );
}

export default ManageInventoryModal;