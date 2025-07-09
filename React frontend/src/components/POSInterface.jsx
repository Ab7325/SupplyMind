import React, { useState } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import ProductCard from './ProductCard';
import CartItem from './CartItem';
import CheckoutModal from './CheckoutModal';

function POSInterface({ 
    products, 
    cart, 
    searchQuery, 
    loading, 
    onSearch, 
    onAddToCart, 
    onUpdateQuantity, 
    onProcessSale, 
    onClearCart, 
    totalAmount 
}) {
    const [showCheckout, setShowCheckout] = useState(false);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Products Section */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Products</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={onSearch}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {products.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={onAddToCart}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Cart Section */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Current Sale</h2>
                        <ShoppingCart className="w-6 h-6 text-indigo-600" />
                    </div>

                    {cart.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No items in cart</p>
                    ) : (
                        <>
                            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                                {cart.map(item => (
                                    <CartItem
                                        key={item.product.id}
                                        item={item}
                                        onUpdateQuantity={onUpdateQuantity}
                                    />
                                ))}
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-semibold">Total:</span>
                                    <span className="text-2xl font-bold text-indigo-600">
                                        ₹{totalAmount.toFixed(2)}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <button
                                        onClick={() => setShowCheckout(true)}
                                        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                    >
                                        Proceed to Checkout
                                    </button>
                                    <button
                                        onClick={onClearCart}
                                        className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        Clear Cart
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Checkout Modal */}
                {showCheckout && (
                    <CheckoutModal
                        totalAmount={totalAmount}
                        onClose={() => setShowCheckout(false)}
                        onProcessSale={onProcessSale}
                    />
                )}
            </div>
        </div>
    );
}

export default POSInterface;