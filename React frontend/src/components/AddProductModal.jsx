import React, { useState } from 'react';

function AddProductModal({ onClose, onProductAdded }) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stockQuantity, setStockQuantity] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !price || !stockQuantity) {
            setError('Name, Price, and Stock Quantity are required.');
            return;
        }
        setError('');

        const newProduct = {
            name,
            price: parseFloat(price),
            stock_quantity: parseInt(stockQuantity, 10),
            description,
            category,
        };

        // The onProductAdded function will handle the API call and closing the modal
        onProductAdded(newProduct);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Form Fields */}
                    <input type="text" placeholder="Product Name*" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded" />
                    <input type="number" placeholder="Price*" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-2 border rounded" />
                    <input type="number" placeholder="Stock Quantity*" value={stockQuantity} onChange={e => setStockQuantity(e.target.value)} className="w-full p-2 border rounded" />
                    <input type="text" placeholder="Category (optional)" value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border rounded" />
                    <textarea placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded"></textarea>

                    <div className="flex justify-end space-x-4 mt-6">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700">Add Product</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProductModal;