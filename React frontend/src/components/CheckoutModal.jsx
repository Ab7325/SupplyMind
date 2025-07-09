import React, { useState } from 'react';

function CheckoutModal({ totalAmount, onClose, onProcessSale }) {
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [processing, setProcessing] = useState(false);

    const handlePayment = async () => {
        setProcessing(true);
        await onProcessSale(paymentMethod);
        setProcessing(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-semibold mb-4">Complete Payment</h3>
                
                <div className="mb-6">
                    <div className="text-center py-4 bg-gray-50 rounded-lg">
                        <span className="text-3xl font-bold text-indigo-600">₹{totalAmount.toFixed(2)}</span>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method
                    </label>
                    <div className="space-y-2">
                        {[
                            { value: 'cash', label: 'Cash' },
                            { value: 'card', label: 'Card' },
                            { value: 'upi', label: 'UPI' }
                        ].map(method => (
                            <label key={method.value} className="flex items-center">
                                <input
                                    type="radio"
                                    name="payment"
                                    value={method.value}
                                    checked={paymentMethod === method.value}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="mr-2"
                                />
                                <span>{method.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex space-x-4">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handlePayment}
                        disabled={processing}
                        className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                        {processing ? 'Processing...' : 'Complete Sale'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CheckoutModal;