import React, { useEffect, useState } from 'react';

function Timer() {
  const [time, setTime] = useState(1800);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let timer = setInterval(() => {
      setTime((time) => {
        if (time === 0) {
          clearInterval(timer);
          setShowModal(true);
          return 0;
        } else {
          return time - 1;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <p className="text-4xl font-bold">
        Time left: {`${Math.floor(time / 60)}`.padStart(2, '0')}:
        {`${time % 60}`.padStart(2, '0')}
      </p>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-24 text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-extrabold text-red-600 mb-10">You Lost!</h2>
            <button
              onClick={() => setShowModal(false)}
              className="mt-10 px-8 py-4 bg-blue-700 text-white font-bold text-2xl rounded hover:bg-blue-900 transition"
            >
              Keep playing
            </button>
            <button
              onClick={() => window.location.reload()}
              className="mt-10 px-8 py-4 bg-purple-500 text-white font-bold text-2xl rounded hover:bg-purple-700 transition ml-6"
            >
              Go to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Timer;
