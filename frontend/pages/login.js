import { useState } from 'react';
import { useRouter } from 'next/router'; // Import the useRouter hook
const Login = () => {
  // Your existing state and functions
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Your login logic here
  };

  return (
    <div id="background" className="flex items-center justify-center h-screen">
      <div
        className="flex flex-col justify-center items-center bg-white p-6 rounded-md shadow-lg"
        style={{
          maxWidth: '400px', // Set a maximum width for the container
          width: '100%', // Ensure it takes full width up to max-width
        }}
      >
        {/* Logo Image */}
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="Logo" className="h-50 w-50 object-contain" />
        </div>
        <form onSubmit={handleLogin} className="w-full">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring text-black focus:ring-blue-200"
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
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <button
            type="submit"
            className={`w-full px-4 py-2 font-bold text-white rounded-md focus:outline-none transition-transform duration-200 ${
              isLoading ? 'bg-gray-400' : 'bg-purple-500 hover:bg-purple-800 hover:scale-105'
            }`}
            disabled={isLoading} // Disable button during loading
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {message && <p className="mt-4 text-red-600">{message}</p>}
        <button
          onClick={() => {/* Your register logic here */}}
          className="mt-4 w-full px-4 py-2 font-bold text-white rounded-md bg-purple-500 hover:bg-purple-800 transition-transform duration-200 hover:scale-105 focus:outline-none"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;

