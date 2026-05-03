import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="container">
      <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-links">
        <Link to="/admin/buses">Manage Buses</Link>
        <Link to="/admin/routes">Manage Routes</Link>
        <Link to="/admin/bookings">All Bookings</Link>
      </div>
    </div>
  </div>
  );
};

export default AdminDashboard;
