import React, { useState, useEffect } from 'react';

const MyPurchase = () => {
  const [activeTab, setActiveTab] = useState('To Pay');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Data Fetching Placeholder tied to activeTab ---
  useEffect(() => {
    setLoading(true);
    // In a real app, this would be an API call:
    // apiService.fetchOrdersByStatus(activeTab).then(data => { ... })
    const fetchOrders = () => {
        setTimeout(() => {
            let mockData = [];
            if (activeTab === 'Purchase History') {
                mockData = [{ id: 1, name: 'Gold Necklace', status: 'Delivered' }];
            } else {
                // Returns empty array for To Pay, To Ship, To Receive (as seen in image)
                // and Return/Refund by default.
            }
            setOrders(mockData);
            setLoading(false);
        }, 300);
    };
    fetchOrders();
  }, [activeTab]);

  const tabs = [
    { name: 'To Pay', icon: '💰' },
    { name: 'To Ship', icon: '📦' },
    { name: 'To Receive', icon: '🚚' },
    { name: 'Purchase History', icon: '🧾' },
    { name: 'Return/Refund', icon: '🔄' },
  ];

  const handleShopNow = () => {
    // In a real app: Use React Router to navigate to the shop page
    console.log('Navigating to shop page...');
  };

  const renderContent = () => {
    if (loading) return <div className="text-center p-5">Loading orders...</div>;

    if (orders.length === 0) {
      return (
        <div className="no-orders-state text-center p-5">
          <div className="cart-icon-large" style={{ fontSize: '5rem', color: '#BC9E54' }}>🛒</div>
          <h3>NO ORDERS YET</h3>
          <button className="button shop-now-button buy-btn mt-3" onClick={handleShopNow}>
            Shop Now
          </button>
        </div>
      );
    }

    // Example of Purchase History display
    return (
      <div className="p-3">
        {orders.map(order => (
          <div key={order.id} className="p-3 mb-2 border rounded" style={{ backgroundColor: '#fdf7e8' }}>
            <p>Order #{order.id}: {order.name}</p>
            <p>Status: **{order.status}**</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="account-page">
      <div className="main-content">
        <div className="account-section" style={{ border: 'none', padding: '0 30px' }}>
            <h2 className="page-breadcrumb" style={{ fontSize: '1.5rem', marginBottom: '20px', fontWeight: 'bold' }}>ACCOUNT &gt; MY PURCHASE</h2>
            <hr style={{ borderTop: '2px solid #BC9E54' }} />
            
            <div className="tabs-container d-flex justify-content-between my-4" style={{ gap: '10px' }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.name}
                        className={`btn ${tab.name === activeTab ? 'btn-warning' : 'btn-light'}`}
                        style={{ flex: 1, padding: '10px 5px', fontWeight: 'bold' }}
                        onClick={() => setActiveTab(tab.name)}
                    >
                        {tab.icon} {tab.name}
                    </button>
                ))}
            </div>

            <div className="tab-content-box p-3" style={{ border: '2px solid #d6c7ac', borderRadius: '4px', backgroundColor: '#f8f2e6' }}>
                {renderContent()}
            </div>
        </div>
      </div>
    </div>
  );
};

export default MyPurchase;