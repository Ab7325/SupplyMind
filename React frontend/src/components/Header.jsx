import React from 'react';

function Header({ currentView, setCurrentView }) {
    return (
        <header className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <h1 className="text-2xl font-bold text-indigo-600">SupplyMind</h1>
                        </div>
                    </div>
                    <nav className="flex space-x-4">
                        <button
                            onClick={() => setCurrentView('pos')}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                currentView === 'pos' 
                                    ? 'bg-indigo-600 text-white' 
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            POS System
                        </button>
                        <button
                            onClick={() => setCurrentView('dashboard')}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                currentView === 'dashboard' 
                                    ? 'bg-indigo-600 text-white' 
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            Dashboard
                        </button>
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default Header;