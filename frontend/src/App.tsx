import { Routes, Route, Link } from 'react-router-dom';
import Home from "./pages/Home";
import Inquire from './pages/Inquire';
import ThankYou from './pages/ThankYou';
import './index.css'; // Tailwind styles already imported here

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <nav className="flex justify-center space-x-8 py-6 bg-white dark:bg-gray-800 shadow-md">
        <Link
          to="/"
          className="text-lg font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Home
        </Link>
        <Link
          to="/inquire"
          className="text-lg font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Inquire
        </Link>
      </nav>

      <main className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inquire" element={<Inquire />} />
          <Route path="/thank-you" element={<ThankYou />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
