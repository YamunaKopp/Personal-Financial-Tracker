import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Registration failed');
      console.error(err);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Register</h2>

        <input
          type="text"
          placeholder="Name"
          className="form-control mb-3"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="form-control mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="form-control mb-3"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-success w-100" onClick={handleRegister}>
          Register
        </button>

        <p className="text-center mt-3 text-muted">
          Already have an account? <a href="/">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
