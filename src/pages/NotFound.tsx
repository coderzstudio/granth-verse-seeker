
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      `404 Error: Attempted to access ${location.pathname}`
    );
    // Optionally send this to error tracking service
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 animate-fade-in">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="animate-bounce">
          <svg
            className="w-24 h-24 mx-auto text-indigo-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-5xl font-bold text-gray-800 mt-6 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-6">
          The page <span className="font-mono bg-gray-100 px-2 py-1 rounded">{location.pathname}</span> doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Go Back
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Return Home
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Need help? <a href="https://www.instagram.com/kl_malviya77/profilecard/?igsh=Zjhva25vbXphaG01" className="text-indigo-600 hover:underline">Contact support</a></p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
