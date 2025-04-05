// eslint-disable-next-line no-unused-vars
import React from "react";
import { useAuth } from '../AuthenticationContext';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { ShoppingBasket, Users, ArrowRight,} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

export default function Group({ groupCreatedByOthers }) {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleViewGroup = (groupId, e) => {
        e.preventDefault();
        if (!user) {
            toast.info("Please login to view group details");
            navigate("/login");
        } else {
            navigate("/view", { state: groupId });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main content */}
            <div className="pt-20 pb-10 px-4 sm:px-6 lg:px-8"> {/* Adjusted padding to match navbar */}
                {groupCreatedByOthers.length > 0 ? (
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                            <Users className="text-blue-600" size={28} />
                            Available Group Purchases
                        </h1>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {groupCreatedByOthers.map((group) => (
                                <div
                                    key={group.id}
                                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
                                >
                                    <div className="relative h-60 overflow-hidden">
                                        <img
                                            src={group.product.image}
                                            alt={group.product.name}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                            onError={(e) => {
                                                e.target.src = "https://via.placeholder.com/400x300?text=Product+Image";
                                            }}
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-3">
                                            <h2 className="text-xl font-bold text-gray-800 line-clamp-1">
                                                {group.product.name}
                                            </h2>
                                        </div>

                                        <p className="text-gray-600 mb-4 line-clamp-2">
                                            {group.product.description}
                                        </p>

                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <p className="text-gray-400 line-through text-sm">
                                                    FCFA{group.product.unit_price}
                                                </p>
                                                <p className="text-xl font-bold text-blue-600">
                                                    FCFA{group.product.bulk_price}
                                                </p>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <ShoppingBasket size={16} className="mr-1" />
                                                {group.product.quantity} needed
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => handleViewGroup(group.id, e)}
                                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors duration-300 font-medium"
                                        >
                                            View Details
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto text-center py-20">
                        <ShoppingBasket size={60} className="mx-auto text-gray-400 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-700 mb-2">
                            No Active Group Purchases
                        </h2>
                        <p className="text-gray-500 max-w-md mx-auto">
                            There are currently no group buying opportunities available. Check back later or create your own group!
                        </p>
                        {user && (
                            <button
                                onClick={() => navigate("/create")}
                                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-300" >
                                Create a Group
                            </button>
                        )}
                    </div>
                )}
            </div>
            <ToastContainer position="top-center" />
        </div>
    );
}