import React from 'react';
import { Receipt, DollarSign, Package, AlertTriangle, TrendingUp, Plus } from 'lucide-react';

// Stat Card Component
function StatCard({ title, value, icon, color }) {
    const colorClasses = {
        blue: 'bg-blue-50 border-blue-200',
        green: 'bg-green-50 border-green-200',
        purple: 'bg-purple-50 border-purple-200',
        orange: 'bg-orange-50 border-orange-200'
    };

    return (
        <div className={`${colorClasses[color]} border rounded-xl p-6`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                </div>
                <div className="opacity-80">
                    {icon}
                </div>
            </div>
        </div>
    );
}

// Quick Action Card Component
function QuickActionCard({ title, description, icon, onClick }) {
    return (
        <button
            onClick={onClick}
            className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-4 text-left transition-colors"
        >
            <div className="flex items-center mb-2">
                {icon}
                <h4 className="ml-2 font-medium text-gray-800">{title}</h4>
            </div>
            <p className="text-sm text-gray-600">{description}</p>
        </button>
    );
}

// Main Dashboard Component
function Dashboard({ stats }) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Today's Sales"
                    value={stats.today_sales || 0}
                    icon={<Receipt className="w-8 h-8 text-blue-600" />}
                    color="blue"
                />
                <StatCard
                    title="Today's Revenue"
                    value={`₹${(stats.today_revenue || 0).toFixed(2)}`}
                    icon={<DollarSign className="w-8 h-8 text-green-600" />}
                    color="green"
                />
                <StatCard
                    title="Total Products"
                    value={stats.total_products || 0}
                    icon={<Package className="w-8 h-8 text-purple-600" />}
                    color="purple"
                />
                <StatCard
                    title="Low Stock Items"
                    value={stats.low_stock_products || 0}
                    icon={<AlertTriangle className="w-8 h-8 text-orange-600" />}
                    color="orange"
                />
            </div>

            {/* Weekly Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Weekly Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-600">Week Sales</p>
                                <p className="text-2xl font-bold text-blue-800">{stats.week_sales || 0}</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-green-600">Week Revenue</p>
                                <p className="text-2xl font-bold text-green-800">₹{(stats.week_revenue || 0).toFixed(2)}</p>
                            </div>
                            <DollarSign className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <QuickActionCard
                        title="Add New Product"
                        description="Add products to inventory"
                        icon={<Plus className="w-6 h-6" />}
                        onClick={() => alert('Feature coming in Phase 2!')}
                    />
                    <QuickActionCard
                        title="View Sales Report"
                        description="Detailed sales analytics"
                        icon={<TrendingUp className="w-6 h-6" />}
                        onClick={() => alert('Feature coming in Phase 3!')}
                    />
                    <QuickActionCard
                        title="Manage Inventory"
                        description="Update stock levels"
                        icon={<Package className="w-6 h-6" />}
                        onClick={() => alert('Feature coming in Phase 2!')}
                    />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;