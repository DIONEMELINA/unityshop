// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthenticationContext";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(false);

    const slides = [
        {
            image: "/buying_together.jpg",
            title: "Community Powered Shopping",
            subtitle: "Discover products your neighbors are buying together",
            mobileImage: "/buying_together_mobile.jpg",
        },
        {
            image: "/payment.jpg",
            title: "Shop Smarter, Together",
            subtitle: "Pool resources with others to unlock bulk discounts and save money",
            mobileImage: "/payment_mobile.jpg",
        },
        {
            image: "/delivery.jpg",
            title: "Shared Shipping Benefits",
            subtitle: "Split delivery costs with your community and reduce expenses",
            mobileImage: "/delivery_mobile.jpg",
        },
    ];

    const startNow = () => {
        if (user) {
            navigate("/create");
        } else {
            navigate("/login");
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(true);
            setTimeout(() => {
                setCurrentIndex((prevIndex) =>
                    prevIndex === slides.length - 1 ? 0 : prevIndex + 1
                );
                setFade(false);
            }, 500);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative w-full h-[100dvh] min-h-[600px] overflow-hidden flex items-center justify-center">
            {/* Background Slideshow */}
            <div className="absolute inset-0 z-0">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out bg-center bg-cover ${index === currentIndex ? "opacity-100" : "opacity-0"
                            }`}
                        style={{
                            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${window.innerWidth < 640 && slide.mobileImage
                                    ? slide.mobileImage
                                    : slide.image
                                })`,
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 sm:px-6 md:px-8 max-w-4xl">
                <div
                    className={`transition-all duration-700 ${fade ? "translate-y-10 opacity-0" : "translate-y-0 opacity-100"
                        }`}
                >
                    <h1 className="text-white font-bold text-3xl xs:text-4xl sm:text-5xl lg:text-6xl mb-4 leading-snug sm:leading-tight">
                        {slides[currentIndex].title}
                    </h1>
                    <p className="text-white/90 text-sm sm:text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto mb-6">
                        {slides[currentIndex].subtitle}
                    </p>
                    <button
                        onClick={startNow}
                        className="mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-xl flex items-center gap-2 text-sm sm:text-base mx-auto"
                    >
                        {user ? "Create a Group" : "Get Started"}
                        <ArrowRight size={16} className="hidden xs:block" />
                    </button>
                </div>

                {/* Slide Indicators */}
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setFade(true);
                                setTimeout(() => {
                                    setCurrentIndex(index);
                                    setFade(false);
                                }, 500);
                            }}
                            className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full transition-all ${index === currentIndex
                                    ? "bg-white w-4 sm:w-5"
                                    : "bg-white/50 hover:bg-white/80"
                                }`}
                            aria-label={`Slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
