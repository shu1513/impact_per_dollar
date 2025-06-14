import { useState } from "react";
import axios, { isAxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null); // null means no message

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!API_URL) {
      throw Error(" no api url")
    }
    
    try {
      await axios.post(`${API_URL}/signup`, {
        firstName,
        lastName,
        email,
      });

      setMessage('An invitation email has been sent to you. Please check your email inbox including junk folder.');
      setIsSuccess(true);
      setFirstName('');
      setLastName('');
      setEmail('');
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        setMessage(error.response?.data?.message || 'Something went wrong.');
      } else {
        setMessage('Unknown error occurred.');
      }
      setIsSuccess(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md dark:bg-gray-800 dark:text-white">
      <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up for More Info</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        />
        <input
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        />
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-center text-sm ${
            isSuccess
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-500 dark:text-red-400'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default SignupForm;
