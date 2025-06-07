import { useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const name = searchParams.get('name');

  useEffect(() => {
    // Remove ?name= from the URL after reading it
    if (name) {
      const cleanUrl = location.pathname;
      window.history.replaceState({}, '', cleanUrl);
    }
  }, [name, location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl font-bold mb-4">Thank You{ name ? `, ${name}` : '' }!</h1>
        <p className="text-lg leading-relaxed">
          A member of our team will reach out within 72 hours.
        </p>
      </div>
    </div>
  );
};

export default ThankYou;
