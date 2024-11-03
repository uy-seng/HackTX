import { useState } from 'react';
import { useRouter } from 'next/router'; // Import the useRouter hook

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisibility, setPasswordVisilbility] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter(); // Initialize the router

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true); // Indicate loading state

    try {
      const response = await fetch('https://api.mockeyinterview.tech/login', {
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
        router.push('/'); // Redirect to home
      } else {
        const errorMessage = await response.text(); // Get the error message from the response
        setMessage(`Login failed: ${errorMessage}`); // Display error message
      }
    } catch (error) {
      console.error(error);
      setMessage(`Login failed: ${error.message}`); // Handle fetch errors
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div id="background" className="flex items-center justify-center h-screen">
      <div
        className="flex flex-col justify-center items-center bg-white p-6 rounded-md shadow-lg"
        style={{
          maxWidth: '400px',
          width: '100%',
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
            <div className="bg-white px-3 py-3 border border-gray-300 rounded-md focus-within:outline-none focus-within:ring focus-within:ring-blue-200 flex justify-between">
              <input
                type={passwordVisibility ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-4/5 text-black focus:outline-none"
              />
              <div className="cursor-pointer" onClick={() => setPasswordVisilbility((prev) => !prev)}>
                {passwordVisibility ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>

                ) : (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>)}
              </div>

            </div>
          </div>
          <button
            type="submit"
            className={`w-full px-4 py-2 font-bold text-white rounded-md focus:outline-none transition-transform duration-200 ${
              isLoading ? 'bg-gray-400' : 'bg-purple-500 hover:bg-purple-800 hover:scale-105'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {message && <p className="mt-4 text-red-600">{message}</p>}
        <button
          onClick={() => router.push('/register')} // Redirect to register page
          className="mt-4 w-full px-4 py-2 font-bold text-white rounded-md bg-blue-500 hover:bg-blue-800 transition-transform duration-200 hover:scale-105 focus:outline-none"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;
