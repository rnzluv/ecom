import React, { useState, useEffect } from 'react';
import { useToast } from '../../components/ToastProvider';

// --- Sidebar Component (For structure clarity) ---
const AdminSidebar = ({ activeSection, onNavigate }) => {
  return (
    <div className="admin-sidebar" style={{ backgroundColor: '#fdf7e8', width: '250px', boxShadow: '2px 0 5px rgba(0,0,0,0.05)' }}>
      {/* ... (Styling and content from the CSS/image) ... */}
      <div className="logo-box text-center py-4">
        <img src="path/to/aurevra-logo.png" alt="Aurevra Jewelry" style={{ width: '100px' }} />
      </div>

      <ul className="navigation-list p-0" style={{ listStyle: 'none' }}>
        {['PRODUCT MANAGEMENT', 'ORDER MANAGEMENT', 'USER MANAGEMENT'].map(item => (
            <li 
                key={item} 
                className="nav-item p-3" 
                onClick={() => onNavigate(item)}
                style={{ cursor: 'pointer', borderLeft: '3px solid transparent', color: '#4b3b23' }}
            >
                {item}
            </li>
        ))}
        <li 
            className="nav-item p-3" 
            style={{ backgroundColor: '#e9ddc3', borderLeft: '3px solid #BC9E54', fontWeight: 'bold', color: '#4b3b23' }}
        >
            ⚙️ SETTINGS
        </li>
      </ul>
      
      <div className="app-settings p-3">
        <h4 style={{ fontSize: '1rem', color: '#BC9E54' }}>APP SETTINGS</h4>
        {/* Dark Mode, Notifications, Contact Support Toggles/Links using your switch CSS */}
        <div className="setting-row toggle-container py-2">
            <span className="toggle-label">DARK MODE 🌙</span>
            <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
            </label>
        </div>
        <div className="setting-row toggle-container py-2">
            <span className="toggle-label">NOTIFICATIONS 🔔</span>
            <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
            </label>
        </div>
        <div className="setting-row py-2" style={{ cursor: 'pointer' }}>
            <span className="toggle-label">CONTACT SUPPORT 💬</span>
        </div>
      </div>

      <div className="sidebar-bottom-actions p-3 d-flex justify-content-between">
        <button className="button view-site-button btn-warning" style={{ flex: 1, marginRight: '10px' }}>VIEW SITE</button>
        <button className="button log-out-button btn-danger" style={{ flex: 1 }}>LOG OUT</button>
      </div>
    </div>
  );
};


const AdminSettings = () => {
  const [profileData, setProfileData] = useState({ username: '', email: '' });
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // --- Data Fetching Placeholder ---
  useEffect(() => {
    // In a real app: apiService.fetchUserProfile().then(data => { setProfileData(data) })
    const mockFetchProfile = () => {
        setTimeout(() => {
            setProfileData({
                username: 'AdminUser123',
                email: 'admin@aurevra.com',
            });
            setLoading(false);
        }, 500);
    };
    mockFetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    // In a real app: await apiService.updateProfile({ ...profileData, newPassword });
    console.log('Saving profile:', profileData, 'New Password:', newPassword);
    toast.show('Profile changes saved!', { type: 'success' });
  };

  if (loading) return <div className="text-center p-5">Loading Admin Profile...</div>;
  
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f2e9d8' }}>
      <AdminSidebar onNavigate={console.log} activeSection="Settings" />

      <div className="main-content-area flex-grow-1 p-5">
        <div className="admin-header d-flex justify-content-end align-items-center mb-4">
          <span className="notification-icon me-3" style={{ fontSize: '1.5rem', color: '#a88b54' }}>🔔</span>
          <span className="user-icon me-2" style={{ fontSize: '1.5rem', color: '#a88b54' }}>👤</span>
          <span style={{ fontWeight: 'bold' }}>Admin</span>
        </div>

        <h1 className="main-heading" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4b3b23' }}>⚙️ SETTINGS</h1>
        <h2 className="sub-heading" style={{ borderBottom: '2px solid #BC9E54', paddingBottom: '5px', marginBottom: '30px', display: 'inline-block' }}>EDIT PROFILE</h2>

        <div className="edit-profile-card p-4" style={{ backgroundColor: '#f8f2e6', border: '2px solid #d6c7ac', borderRadius: '4px', maxWidth: '600px' }}>
          <form onSubmit={handleSave}>
            <div className="profile-details-section d-flex align-items-center">
              <div className="profile-picture text-center me-5">
                <div className="profile-avatar mb-2" style={{ width: '120px', height: '120px', backgroundColor: '#917A3F', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', color: 'white' }}>👤</div>
                <p className="profile-label" style={{ fontWeight: 'bold', color: '#4b3b23' }}>PROFILE</p>
              </div>
              
              <div className="input-group flex-grow-1">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={profileData.username}
                  onChange={handleChange}
                  className="form-control mb-3"
                  style={{ border: '1px solid #d2b06a' }}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={profileData.email}
                  onChange={handleChange}
                  className="form-control mb-3"
                  style={{ border: '1px solid #d2b06a' }}
                />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Change Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-control mb-3"
                  style={{ border: '1px solid #d2b06a' }}
                />
              </div>
            </div>
            
            <div className="action-buttons d-flex justify-content-end mt-4">
              <button type="submit" className="button save-changes-button checkout-btn me-3">
                SAVE CHANGES
              </button>
              <button type="button" className="button cancel-button btn-danger">
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;