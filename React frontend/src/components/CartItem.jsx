import React from 'react';
import { Plus, Minus } from 'lucide-react';

function CartItem({ item, onUpdateQuantity }) {
    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
                <h4 className="font-medium text-sm">{item.product.name}</h4>
                <p className="text-xs text-gray-600">₹{item.product.price} each</p>
            </div>
            
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                >
                    <Minus className="w-4 h-4" />
                </button>
                
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                
                <button
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>
            
            <div className="ml-4 font-medium">
                ₹{(item.product.price * item.quantity).toFixed(2)}
            </div>
        </div>
    );
}

export default CartItem;