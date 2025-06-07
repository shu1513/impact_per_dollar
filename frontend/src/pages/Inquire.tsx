import SignupForm from "../components/SignupForm";

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-16 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Send us a message
      </h2>
      <SignupForm />
    </div>
  );
};

export default Signup;
