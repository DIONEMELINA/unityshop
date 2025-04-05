// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';

export default function Sponsor() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = [
        "/techChantier.png",
        "/buyam.jpg",
        "/afrovision.jpg",
        "/nkwa.jpg",
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const visibleSponsors = images.slice(currentIndex, currentIndex + 3).concat(
        images.slice(0, Math.max(0, 3 - (images.length - currentIndex)))
    );

    return (
        <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 py-16 px-4 flex flex-col items-center">
            {/* Header with decorative accent */}
            <div className="text-center mb-12 relative">
                <h2 className="text-4xl font-bold text-gray-800 relative inline-block">
                    Our Sponsors
                    <span className="absolute -bottom-2 left-0 w-full h-1 bg-indigo-400 rounded-full"></span>
                </h2>
                <p className="mt-3 text-gray-600">Trusted by industry leaders</p>
            </div>

            {/* Sponsor carousel with enhanced animation */}
            <div className="flex justify-center gap-8 md:gap-12 w-full max-w-6xl mx-auto">
                {visibleSponsors.map((src, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-center p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                        style={{
                            minWidth: '160px',
                            height: '100px',
                            opacity: index === 1 ? 1 : 0.8, // Center logo is more prominent
                            transform: index === 1 ? 'scale(1.1)' : 'scale(0.9)'
                        }}
                    >
                        <img
                            src={src}
                            alt={`sponsor-${index}`}
                            className="max-h-16 object-contain"
                        />
                    </div>
                ))}
            </div>

            {/* Dots indicator */}
            <div className="flex gap-2 mt-10">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all ${currentIndex === index ? 'bg-indigo-600 w-6' : 'bg-gray-300'}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}