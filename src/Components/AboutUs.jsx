// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NewNavbar from "./newNavBar";
import Footer from "./Footer";
import Sponsor from "./Sponsor";
import { Users, Package, ShoppingCart, Percent } from "lucide-react";

const AboutUs = () => {
    const location = useLocation();
    const [isAboutScreen, setIsAboutScreen] = useState(false);

    useEffect(() => {
        setIsAboutScreen(location.pathname === "/about");
    }, [location.pathname]);

    return (
        <div className="bg-gray-50 min-h-screen">
            {isAboutScreen && <NewNavbar />}

            {/* Hero Section */}
            {isAboutScreen && (
                <section className="relative w-full min-h-[50vh] lg:h-[70vh] bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">About UnityShop</h1>
                        <p className="text-xl md:text-2xl text-white/90">
                            Revolutionizing shopping through community power
                        </p>
                    </div>
                </section>
            )}

            {/* Main Content */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        <div className="lg:w-1/2">
                            <img
                                src="/about.jpg"
                                alt="Community shopping"
                                className="w-full h-auto rounded-xl shadow-lg object-cover"
                            />
                        </div>
                        <div className="lg:w-1/2">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                                Our Story
                            </h2>
                            <div className="space-y-4 text-gray-600">
                                <p className="text-lg leading-relaxed">
                                    UnityShop is a revolutionary platform that allows individuals to join forces
                                    and purchase high-quality products at wholesale prices. By pooling resources, users
                                    can enjoy bulk discounts, share shipping costs, and gain access to exclusive deals.
                                </p>
                                <p className="text-lg leading-relaxed">
                                    Our mission is to make shopping more affordable and efficient by eliminating the
                                    financial barriers that come with buying individually. We aim to build a community
                                    where buyers can trust and collaborate.
                                </p>
                                <p className="text-lg leading-relaxed">
                                    Whether you're a student, small business owner, or family looking for savings,
                                    UnityShop provides an easy-to-use platform to connect with like-minded buyers.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Value Propositions */}
                    <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                            <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                                <Users className="text-blue-600" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Community Power</h3>
                            <p className="text-gray-600">
                                Join forces with others to unlock bulk purchasing benefits
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                            <div className="bg-indigo-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                                <Percent className="text-indigo-600" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Maximum Savings</h3>
                            <p className="text-gray-600">
                                Enjoy discounts of 30-50% off retail prices
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                            <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                                <Package className="text-purple-600" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Shared Shipping</h3>
                            <p className="text-gray-600">
                                Split delivery costs with your group members
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                            <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                                <ShoppingCart className="text-green-600" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Trusted Products</h3>
                            <p className="text-gray-600">
                                Quality items vetted by our community
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {isAboutScreen && (
                <div className="flex flex-col pt-10 pb-20">
                    <Sponsor />
                    
                        <Footer />
                    
                </div>
            )}
        </div>
    );
};

export default AboutUs;