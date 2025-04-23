import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-4">
      <span className="navbar-brand fw-bold">💰 Finance Tracker</span>
      <button className="btn btn-outline-light" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
