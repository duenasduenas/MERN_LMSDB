import { Link } from "react-router-dom"; // use "react-router-dom" in modern React Router

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-green-500 p-6 relative overflow-hidden">
      {/* Background elements for sports feel */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJzdHJpcGVzIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPgogICAgICA8cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSI0MCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+CiAgICA8L3BhdHRlcm4+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MCUiIGhlaWdodD0iNDAiIGZpbGw9InVybCgjc3RyaXBlcykiLz4KPC9zdmc+')] opacity-20"></div>
      
      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-extrabold mb-4 text-white drop-shadow-lg">
          🏆 Game On! 🏆
        </h1>
        <p className="mb-8 text-xl text-white font-semibold drop-shadow-md">
          Step onto the field and log in to join the action.
        </p>
        <Link
          to="/login"
          className="inline-block px-8 py-4 bg-yellow-500 text-black font-bold text-lg rounded-full hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          🚀 Log In & Play
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
