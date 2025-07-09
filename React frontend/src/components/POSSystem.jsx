import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Header from './Header';
import POSInterface from './POSInterface';
import Dashboard from './Dashboard';

function POSSystem() {
    const [currentView, setCurrentView] = useState('pos');
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [lastSale, setLastSale] = useState(null);
    const [dashboardStats, setDashboardStats] = useState({});

    useEffect(() => {
        loadProducts();
        loadDashboardStats();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await api.getProducts();
            setProducts(data.results || data);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadDashboardStats = async () => {
        try {
            const stats = await api.getDashboardStats();
            setDashboardStats(stats);
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
        }
    };

    const searchProducts = async (query) => {
        try {
            setLoading(true);
            const data = await api.searchProducts(query);
            setProducts(data.results || data);
        } catch (error) {
            console.error('Error searching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length > 2) {
            searchProducts(query);
        } else if (query.length === 0) {
            loadProducts();
        }
    };

    const addToCart = (product) => {
        const existingItem = cart.find(item => item.product.id === product.id);
        if (existingItem) {
            setCart(cart.map(item =>
                item.product.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { product, quantity: 1 }]);
        }
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity === 0) {
            setCart(cart.filter(item => item.product.id !== productId));
        } else {
            setCart(cart.map(item =>
                item.product.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            ));
        }
    };

    const getTotalAmount = () => {
        return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    const processSale = async (paymentMethod) => {
        try {
            setLoading(true);
            const saleData = {
                items: cart.map(item => ({
                    product_id: item.product.id.toString(),
                    quantity: item.quantity.toString()
                })),
                payment_method: paymentMethod
            };

            const sale = await api.createSale(saleData);
            setLastSale(sale);
            setCart([]);
            loadProducts(); // Refresh products to update stock
            loadDashboardStats(); // Refresh dashboard stats
            alert('Sale completed successfully!');
        } catch (error) {
            console.error('Error processing sale:', error);
            alert('Error processing sale. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Header currentView={currentView} setCurrentView={setCurrentView} />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {currentView === 'pos' && (
                    <POSInterface
                        products={products}
                        cart={cart}
                        searchQuery={searchQuery}
                        loading={loading}
                        onSearch={handleSearch}
                        onAddToCart={addToCart}
                        onUpdateQuantity={updateQuantity}
                        onProcessSale={processSale}
                        onClearCart={clearCart}
                        totalAmount={getTotalAmount()}
                        lastSale={lastSale}
                    />
                )}

                {currentView === 'dashboard' && (
                    <Dashboard stats={dashboardStats} />
                )}
            </main>
        </div>
    );
}

export default POSSystem;