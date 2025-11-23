import React, { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState(''); // 'idle', 'submitting', 'success', 'error'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    // --- Database Submission Placeholder ---
    try {
      // In a real app: await apiService.submitContactForm(formData);
      console.log('Form Submitted to Database:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      setStatus('success');
      setFormData({ name: '', email: '', message: '' }); // Clear form
    } catch (error) {
      console.error('Submission failed:', error);
      setStatus('error');
    }
  };

  return (
    <div className="main-content">
      <div className="contact-section text-center">
        <div className="d-flex justify-content-center">
            <div className="contact-logo">
                <img src="path/to/logo-with-diamond.png" alt="Aurevra Logo" />
            </div>
        </div>

        <h2 className="contact-title">CONTACT US</h2>

        <form className="contact-form mx-auto" onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="form-control mb-3" // Using standard Bootstrap form-control for inputs
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="form-control mb-3"
              required
            />
          </div>
          <div className="mb-4">
            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              className="form-control"
              rows="4"
              required
            />
          </div>
          
          <button type="submit" className="submit-btn" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'SENDING...' : 'SUBMIT'}
          </button>
          
          {status === 'success' && <p className="text-success mt-3">Message sent successfully!</p>}
          {status === 'error' && <p className="text-danger mt-3">Failed to send message. Please try again.</p>}
        </form>

        <div className="contact-info mt-5">
            <p><i className="fas fa-phone"></i> 09123456789</p>
            <p><i className="fas fa-envelope"></i> aurevrajewelry@gmail.com</p>
            <div className="social-icons mt-3">
              {/* Using font-awesome classes as suggested by the CSS icon selectors */}
              <a href="#"><i className="fab fa-facebook-f"></i></a> 
              <a href="#"><i className="fab fa-instagram"></i></a> 
              <a href="#"><i className="fab fa-twitter"></i></a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;