import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
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
      if (response.data.user.role === 'admin') {
        setError('Admins must log in through the secure portal.');
        showToast('Admins must log in through the secure portal.', 'error');
        return;
      }
      login(response.data.user, response.data.token);
      showToast(`Welcome back, ${response.data.user.name}!`, 'success');
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      showToast(err.response?.data?.message || 'Login failed', 'error');
    }
  };

  return (
    <div className="container">
      <div className="auth-container">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;
