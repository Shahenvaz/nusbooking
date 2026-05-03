import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.user.role !== 'admin') {
        setError('Unauthorized access. This portal is for admins only.');
        showToast('Unauthorized access. Admin role required.', 'error');
        return;
      }
      login(response.data.user, response.data.token);
      showToast('Admin access granted.', 'success');
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Admin login failed');
      showToast(err.response?.data?.message || 'Admin login failed', 'error');
    }
  };

  return (
    <div className="container">
      <div className="auth-container">
        <h2>Admin Secure Login</h2>
        <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem' }}>
          Authorized personnel only.
        </p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Admin Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" style={{ backgroundColor: '#dc3545' }}>Secure Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
