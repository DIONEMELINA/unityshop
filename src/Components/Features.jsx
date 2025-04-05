
// eslint-disable-next-line no-unused-vars
import React from "react";
import { BadgePercent, Truck, CreditCard, Users, } from "lucide-react";

const features = [
    { title: "Bulk Discounts", description: "Save money by buying in groups.", icon: BadgePercent },
    { title: "Shared Shipping", description: "Split shipping costs with others.", icon: Truck },
    { title: "Easy Collaboration", description: "Find and join group purchases.", icon: Users },
    { title: "Secure Payments", description: "Safe and easy transactions.", icon: CreditCard },
];

const Features = () => {
    return (
        <section className="bg-white py-16">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-center text-blue-600">
                    How it works?
                </h2>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => {
                        const IconComponent = feature.icon;
                        return (
                            <div key={index} className="bg-white p-6 shadow-md rounded-lg text-center flex flex-col justify-center items-center transition-transform duration-300 hover:-translate-y-2">
                                <IconComponent  size={32}  className="mb-4"/>

                                <h3 className="text-xl font-bold text-gray-800">{feature.title}</h3>
                                <p className="mt-2 text-gray-600">{feature.description}</p>


                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
};

export default Features;