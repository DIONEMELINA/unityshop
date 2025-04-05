import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import React from "react";
import { useAuth } from "../AuthenticationContext";
import { useNavigate } from "react-router-dom";
import NewNavbar from "./NewNavBar";
import Footer from "./Footer";
import { toast } from "react-toastify";

export default function Register() {
  const [email, setEMail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [imageError, setImageError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEMailError] = useState("");
  const [contactError, setContactError] = useState("");
  const [nameError, setNameError] = useState("");
  const [activateError, setActivateError] = useState(false);
  const [confirmed_password, setConfirmed_Password] = useState("");
  const [confirmed_password_Error, setConfirmed_Password_Error] = useState("");
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const { registerUser } = useAuth();
  const [isSpinning, setIsSpinning] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const selectedFile = e.target.files[0];
    const fileSize = selectedFile.size / 1024;
    if (fileSize > 51200) {
      setImageError("*File should not be more than 51.2MB");
    } else {
      setImage(selectedFile);
    }
  };

  const handleContact = (e) => {
    const newPhone = e.target.value;
    if (!/^[0-9]*$/.test(newPhone)) {
      return;
    } else {
      setPhone(newPhone);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) setNameError("*Required");
    else setNameError("");

    if (!email) setEMailError("*Required");
    else if (!emailRegex.test(email)) setEMailError("Invalid email");
    else setEMailError("");

    if (!phone) setContactError("*Required");
    else if (phone.length < 9) setContactError("Must be 9 digits");
    else setContactError("");

    if (!password) setPasswordError("*Required");
    else if (password.length <= 7)
      setPasswordError("Password should be at least 8 characters");
    else setPasswordError("");

    if (!confirmed_password)
      setConfirmed_Password_Error("*Required");
    else if (confirmed_password !== password)
      setConfirmed_Password_Error("Passwords do not match");
    else setConfirmed_Password_Error("");

    if (
      password.length >= 8 &&
      phone.length === 9 &&
      emailRegex.test(email) &&
      name.length > 0 &&
      imageError.length === 0 &&
      confirmed_password === password
    ) {
      try {
        setIsSpinning(true);
        await registerUser({
          name:name,
          email:email,
          contact: parseInt(phone, 10),
          password:password,
          password_confirmation: confirmed_password,
          address:address,
          image:image,
        });
        toast.success("Registration successful")
        navigate("/login");
      } catch (error) {
       const errorMessage = error.response?.data?.message || error.message;
             toast.error(errorMessage == "Network Error"
               ? "Check your internet connection and try again"
               : errorMessage);
      }
    } else {
      setIsSpinning(false);
      setActivateError(!activateError);
    }
  };


  return (
    <section className="w-full">
      <NewNavbar />
      <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gray-100 mt-10">

        <div className="shadow-lg bg-white rounded-lg p-8 md: w-[70%] sm:w-[50%] mt-5">
          <h1 className="text-3xl font-bold text-center text-gray-800">Register</h1>
          <div className="flex flex-col  justify-center items-start">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mt-4"
            />
            {activateError && nameError && <p className="text-red-500 text-sm text-start">{nameError}</p>}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEMail(e.target.value)}
              className="w-full px-4 py-2 mt-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none "
            />
            {activateError && emailError && <p className="text-red-500 text-sm text-start">{emailError}</p>}

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none "
            />
            {activateError && passwordError && <p className="text-red-500 text-sm text-start">{passwordError}</p>}

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmed_password}
              onChange={(e) => setConfirmed_Password(e.target.value)}
              className="w-full px-4 py-2 mt-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none "
            />
            {activateError && confirmed_password_Error && <p className="text-red-500 text-sm text-start">{confirmed_password_Error}</p>}

            <input
              type="text"
              placeholder="Contact"
              value={phone}
              onChange={handleContact}
              className="w-full px-4 py-2 mt-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none "
            />
            {activateError && contactError && <p className="text-red-500 text-sm text-start">{contactError}</p>}

            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 mt-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none "
            />

            <input
              type="file"
              placeholder="Upload image"
              accept="image/*"
              name="file"
              onChange={handleImageUpload}
              className="w-full px-4 py-2 mt-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none "
            />
            {activateError && imageError && <p className="text-red-500 text-sm text-start">{imageError}</p>}


          </div>
          <p className="mt-4">already have an account? <span className="text-blue-600 cursor-pointer" onClick={() => navigate("/register")}>login</span></p>

         
            <div className="flex justify-center items-center">
              <button
                onClick={handleSubmit}
                className="mt-5 px-20 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-indigo-900 transition duration-300  "
              >
              {isSpinning ? "Signing in..." : "Submit"}
              </button>
            </div>

         
        </div>
      </div>
      <Footer />
    </section>
  );
}
