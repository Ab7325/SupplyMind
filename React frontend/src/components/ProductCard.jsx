import React from 'react';
import { AlertTriangle } from 'lucide-react';

function ProductCard({ product, onAddToCart }) {
    const isLowStock = product.stock_quantity < 10;
    const isOutOfStock = product.stock_quantity === 0;

    return (
        <div className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow ${
            isOutOfStock ? 'opacity-60' : ''
        }`}>
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-800 text-sm">{product.name}</h3>
                {isLowStock && !isOutOfStock && (
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                )}
            </div>
            
            <p className="text-xs text-gray-600 mb-2">{product.description}</p>
            
            <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-indigo-600">₹{product.price}</span>
                <span className={`text-sm px-2 py-1 rounded ${
                    isOutOfStock 
                        ? 'bg-red-100 text-red-800' 
                        : isLowStock 
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-green-100 text-green-800'
                }`}>
                    Stock: {product.stock_quantity}
                </span>
            </div>
            
            <button
                onClick={() => onAddToCart(product)}
                disabled={isOutOfStock}
                className={`w-full py-2 rounded-lg font-medium transition-colors ${
                    isOutOfStock
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
            >
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
        </div>
    );
}

export default ProductCard;