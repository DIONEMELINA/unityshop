import { useAuth } from '../AuthenticationContext';
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import NewNavbar from './NewNavBar';
import Footer from './Footer';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEMailError] = useState('');
  const [email, setEMail] = useState('');
  const [activateError, setActivateError] = useState(false);
  const [password, setPassword] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSubmit = async () => {
    if (!password) {
      setPasswordError('*Fill this space');
    } else {
      setPasswordError('');
    }

    if (!email) {
      setEMailError('*Fill this space');
    } else if (!emailRegex.test(email)) {
      setEMailError('Invalid email');
    } else {
      setEMailError('');
    }

    if (password.length !== 0 && emailRegex.test(email)) {
      try {
        setIsSpinning(true);
        await login({ email, password });
        navigate('/');
        toast.success("Login successful!", {
          position: "top-right",
        })
        setPassword('');
        setEMail('');
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(errorMessage == "Network Error"
          ? "Check your internet connection and try again"
          : errorMessage);
        setIsSpinning(false);
      }
    } else {
      setIsSpinning(false);

      setActivateError(!activateError);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <section className='w-full'>
      <NewNavbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-200 max-md:px-10">
        <div className="bg-white md:h-[50vh] shadow-lg rounded-lg flex w-full max-w-2xl overflow-hidden">

          {/* Image Section */}
          <div className="flex-1 max-md:hidden justify-center items-center shrink-0">
            <img src="/buying_together.jpg" alt="Login" className="w-full h-full object-cover" />
          </div>

          {/* Form Section */}
          <div className="flex-1 p-8 flex flex-col justify-center items-center">
            <h1 className='text-3xl font-bold text-center text-gray-800  mb-4'>
              Login
            </h1>
            {/* Email Input */}
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEMail(e.target.value)}
              name="email"
              autoComplete="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {activateError === false && emailError.length > 0 && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}

            {/* Password Input */}
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              className="w-full px-4 py-2 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {activateError && passwordError.length > 0 && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}

            {/* Links */}
            <div className="mt-3 text-sm text-gray-600 text-center">
              <p>
                Don't have an account?
                <span className="text-blue-600 cursor-pointer" onClick={handleRegister}>
                  Register
                </span>
              </p>
              <p className="text-blue-600 cursor-pointer mt-1">Forgot password?</p>
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex justify-center">
              {isSpinning ? (
                <div className="spinner border-4 border-t-blue-500 border-gray-200 rounded-full w-6 h-6 animate-spin"></div>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white py-2 rounded-lg hover:bg-indigo-900 px-20"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
      <Footer />
    </section>

  );
}
