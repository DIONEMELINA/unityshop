// eslint-disable-next-line no-unused-vars
import React from 'react';
import { User, Phone, MapPin, Mail, Edit2 } from 'lucide-react';
import { useAuth } from '../AuthenticationContext';
import Footer from './Footer';
import NewNavbar from "./NewNavBar";

const ProfileScreen = () => {
    const { user } = useAuth();

    const userInfo = [
        { icon: <Mail className="text-indigo-600" size={18} />, label: "Email", value: user.email },
        { icon: <Phone className="text-indigo-600" size={18} />, label: "Contact", value: user.contact || "Not provided" },
        { icon: <MapPin className="text-indigo-600" size={18} />, label: "Address", value: user.address || "Not provided" }
    ];

    return (
        <div>
            <NewNavbar/>
            <div className="max-w-md mx-auto p-4 pt-30">
                {/* Profile Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative mb-4">
                        {user.profile_pic ? (
                            <img
                                src={user.profile_pic}
                                alt={user.name}
                                className="w-24 h-24 rounded-full object-cover border-2 border-indigo-100"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-indigo-200">
                                <User className="text-indigo-600" size={36} />
                            </div>
                        )}
                    </div>

                    <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>

                    <button className="mt-2 flex items-center text-indigo-600 text-sm">
                        <Edit2 className="mr-1" size={16} />
                        Edit Profile
                    </button>
                </div>

                {/* User Information */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Personal Information</h3>

                    <div className="space-y-4">
                        {userInfo.map((info) => (
                            <div key={info.label} className="flex items-start">
                                <div className="mr-3 mt-0.5">{info.icon}</div>
                                <div>
                                    <p className="text-xs text-gray-500">{info.label}</p>
                                    <p className="text-sm font-medium text-gray-800">{info.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer/>
    </div>
        
    );
};

export default ProfileScreen;