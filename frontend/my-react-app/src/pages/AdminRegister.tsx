import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const AdminRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const { showToast } = useToast();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { 
        name, 
        email, 
        password, 
        role: 'admin', 
        adminSecret 
      });
      showToast('Admin account created successfully!', 'success');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Admin registration failed');
      showToast(err.response?.data?.message || 'Admin registration failed', 'error');
    }
  };

  return (
    <div className="container">
      <div className="auth-container">
        <h2>Admin Registration</h2>
        <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem' }}>
          This is a restricted registration page.
        </p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Admin Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input 
            type="password" 
            placeholder="Admin Secret Key" 
            value={adminSecret} 
            onChange={(e) => setAdminSecret(e.target.value)} 
            required 
          />
          <button type="submit" style={{ backgroundColor: '#dc3545' }}>Register as Admin</button>
        </form>
        <p><Link to="/login">Back to Login</Link></p>
      </div>
    </div>
  );
};

export default AdminRegister;
