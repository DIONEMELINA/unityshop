// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NewNavbar from "./NewNavBar";
import Sponsor from "./Sponsor";
import Footer from "./Footer";
import bgImage from '/contactus.jpg';

const ContactUs = () => {
    const location = useLocation();
    const [isContactRoute, setIsContactRoute] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    useEffect(() => {
        setIsContactRoute(location.pathname === "/contact");
    }, [location]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Form submission logic here
        console.log("Form submitted:", formData);
    };

    return (
        <div className="h-screen flex flex-col">
            {isContactRoute && <NewNavbar />}

            {/* Hero Section */}
            {isContactRoute && (
                <section
                    style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bgImage})` }}
                    className="relative flex items-center justify-center w-full min-h-[60vh] bg-cover bg-center flex-1"
                >
                    <div className="text-center px-4 max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
                            Let's Connect
                        </h1>
                        <p className="text-xl text-gray-200 md:text-2xl mb-8">
                            We're here to help and answer any questions you might have.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <a
                                href="#contact-form"
                                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
                            >
                                Contact Us
                            </a>
                        </div>
                    </div>
                </section>
            )}

            {/* Contact Form Section */}
            <section className="py-20 bg-gradient-to-b from-white to-gray-50" id="contact-form">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            Get In Touch
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Have questions about group buying or need support? Fill out the form below and our team will get back to you within 24 hours.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-xl shadow-lg">
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label htmlFor="name" className="block text-gray-700 mb-2">Your Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label htmlFor="message" className="block text-gray-700 mb-2">Your Message</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="5"
                                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white px-6 py-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-lg shadow-md hover:shadow-lg"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </section>

            {isContactRoute && (
                <div className="">
                    <Sponsor />

                    <Footer />
                </div>
            )}
        </div>
    );
};

export default ContactUs;