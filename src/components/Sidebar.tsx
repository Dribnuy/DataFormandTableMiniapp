
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-600 text-white p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Menu</h2>
      <div className="space-y-4">
        <button className="w-full py-2 border-2 rounded-2xl bg-blue-500 text-white font-semibold transition-colors duration-300 hover:bg-purple-900 border-black">
          <Link to="/" className="block w-full text-center">
            Main Menu
          </Link>
        </button>
        <button className="w-full py-2 border-2 rounded-2xl bg-blue-500 text-white font-semibold transition-colors duration-300 hover:bg-purple-900 border-black">
          <Link to="/form" className="block w-full text-center">
            Form
          </Link>
        </button>
        <button className="w-full py-2 border-2 rounded-2xl bg-blue-500 text-white font-semibold transition-colors duration-300 hover:bg-purple-900 border-black">
          <Link to="/table" className="block w-full text-center">
            Table
          </Link>
        </button>
      </div>
    </div>
  );
}