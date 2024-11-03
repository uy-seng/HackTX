import { useState } from 'react';
import { useRouter } from 'next/router'; // Import the useRouter hook

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Initialize the router

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch('http://api.mockeyinterview.tech/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    console.log(response);

    if (response.ok) {
      // Handle successful registration by redirecting to the login page
      alert('Registration successful!');
      router.push('/login'); // Redirect to the login page
    } else {
      // Handle errors (e.g., show error message)
      alert('Registration failed. Please try again.');
    }
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
        <h2 className="text-xl font-bold mb-4 text-purple-500">Register</h2>
        <form onSubmit={handleSubmit} className="w-full">
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
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
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
            className="w-full px-4 py-2 font-bold text-white rounded-md bg-purple-500 hover:bg-purple-800 transition-transform duration-200 hover:scale-105"
          >
            Register
          </button>
        </form>
        <p className="text-black mt-5 mb-0">Already have an account?</p> {/* Adjusted margin */}
        {/* Login button below Register */}
        <button
          onClick={() => router.push('/login')} // Redirect to login page
          className="mt-4 w-full px-4 py-2 font-bold text-white rounded-md bg-blue-500 transition-transform duration-200 hover:scale-105"
        > Login
        </button>
      </div>
    </div>
  );
}
