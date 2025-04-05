// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useAuth } from '../AuthenticationContext';
import SideBar from '../Components/SideBar';
import NewNavbar from "./newNavBar";

import { useGroup } from "../purchaseContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Update from "./Update";
import { FiArrowRight, FiUsers, FiClock } from "react-icons/fi";

export default function DashBoard() {
    const location = useLocation();
    const [isUpdateGroup, setIsUpdateGroup] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [GroupCreatedByOthers, setGroupsCreatedByOthers] = useState([]);
    const { Groups, ListOfGroup } = useGroup();
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await ListOfGroup();
                if (Groups.length > 0) {
                    const filteredGroups = Groups.filter(
                        (group) => group.created_by.id != user.id
                    );
                    setGroupsCreatedByOthers(filteredGroups);
                }
            } catch (error) {
                console.log(error);
                toast.error("Failed to load groups");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        setIsUpdateGroup(location.pathname === "/updateGroup");
    }, [location.pathname]);

    const handleViewGroup = (groupId, e) => {
        e.preventDefault();
        navigate("/view", { state: groupId });
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <NewNavbar />
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Main content area */}
            <div className="flex flex-1 pt-16"> {/* Adjusted for navbar height */}
                {/* Sidebar */}
                <div className="hidden md:block w-64 fixed top-16 bottom-0 left-0 bg-white shadow-lg z-40 border-r border-gray-200">
                    <SideBar />
                </div>

                {/* Main Content */}
                <div className="flex-1 ml-0 md:ml-64 px-4 py-8">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-[60vh]">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                        </div>
                    ) : isUpdateGroup ? (
                        <Update />
                    ) : (
                        <div className="max-w-7xl mx-auto">
                            {/* Welcome Banner */}
                            <div className="mb-8">
                                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6 shadow-lg">
                                    <h2 className="font-bold text-2xl md:text-3xl">Welcome back, {user.name}!</h2>
                                    <p className="text-indigo-100 mt-2 text-lg">
                                        Start a new purchase or join existing groups to save together
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-3">
                                        <button
                                            onClick={() => navigate("/create")}
                                            className="px-6 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                                        >
                                            Create Group Buy
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Available Groups Section */}
                            <section className="mb-12">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-semibold text-gray-800">Available Group Purchases</h3>
                                    <p className="text-gray-500">{GroupCreatedByOthers.length} available</p>
                                </div>

                                {GroupCreatedByOthers.length === 0 ? (
                                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                                        <img
                                            src="/empty-groups.svg"
                                            alt="No groups"
                                            className="mx-auto h-40 mb-4"
                                        />
                                        <h4 className="text-lg font-medium text-gray-700 mb-2">No available group purchases</h4>
                                        <p className="text-gray-500 mb-4">Check back later or start your own group</p>
                                        <button
                                            onClick={() => navigate("/create")}
                                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                        >
                                            Create Group
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {GroupCreatedByOthers.map((group, index) => (
                                            <div
                                                key={index}
                                                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
                                            >
                                                <div className="relative h-48 w-full overflow-hidden">
                                                    <img
                                                        src={group.product.image}
                                                        alt={group.product.name}
                                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                                    />
                                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                                        <span className="text-white font-medium">
                                                            {group.members_count} {group.members_count === 1 ? 'member' : 'members'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-5">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                                                            {group.product.name}
                                                        </h3>
                                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                            Active
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                                        {group.product.description}
                                                    </p>

                                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                                        <div className="flex items-center">
                                                            <FiUsers className="mr-1" />
                                                            <span>{group.target_members} needed</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <FiClock className="mr-1" />
                                                            <span>Ends in {group.days_left} days</span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={(e) => handleViewGroup(group.id, e)}
                                                        className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                                    >
                                                        View Details <FiArrowRight className="ml-2" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}