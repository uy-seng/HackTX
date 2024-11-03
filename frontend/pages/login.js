import { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true); // Indicate loading state

    try {
      const response = await fetch('https://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Store token securely
        setMessage('Login successful!'); // Update message
      } else {
        const errorMessage = await response.text();
        setMessage(`Login failed1: ${errorMessage}`); // Display error message
      }
    } catch (error) {
      setMessage(`Login failed2: ${error.message}`); // Handle fetch errors
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        {/* Logo Image */}
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="Logo" className="h-50 w-50 object-contain" />
        </div>
        <h2 className="mb-6 text-2xl font-bold text-center text-purple-500">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-purple-500">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-purple-500">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <button
            type="submit"
            className={`w-full px-4 py-2 font-bold text-white rounded-md focus:outline-none ${
              isLoading ? 'bg-gray-400' : 'bg-purple-500 hover:bg-purple-600'
            }`}
            disabled={isLoading} // Disable button during loading
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {message && <p className="mt-4 text-red-600">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
