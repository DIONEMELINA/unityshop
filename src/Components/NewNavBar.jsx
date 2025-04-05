// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useAuth } from "../AuthenticationContext";
import { User, Menu, X, ShoppingBasket, Hand, Pencil, ShoppingCart, LogOut } from "lucide-react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewNavbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const isUser = Boolean(user);

    const logOutUser = async () => {
        try {
            await logout();
            toast.success("Logged out successfully!");
            navigate("/");
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
                  toast.error(errorMessage == "Network Error"
                    ? "Check your internet connection and try again"
                    : errorMessage);
        }
    };

    // Sidebar menu items (same as in SideBar component)
    const sidebarMenuItems = [
        {
            name: "Buy Goal",
            icon: ShoppingCart,
            path: '/dashboard',
            color: 'text-indigo-500'
        },
        {
            name: "Requests",
            icon: Hand,
            path: "/request",
            color: 'text-amber-500'
        },
        {
            name: "Update Group",
            icon: Pencil,
            path: "/updateGroup",
            color: 'text-emerald-500'
        },
        {
            name: 'Profile',
            icon: User,
            path: '/profile',
            color: 'text-purple-500'
        }
    ];

    return (
        <nav className="bg-white border-b border-gray-200 fixed top-0 w-full z-50 shadow-sm">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo/Back Button */}
                {location.pathname === "/updateGroup" || location.pathname === "/create" ? (
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                        <span className="font-medium">Back</span>
                    </button>
                ) : (
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => navigate("/")}
                    >
                        <ShoppingBasket size={28} className="text-blue-600" />
                        <h1 className="text-xl font-bold text-blue-800">
                            Unity<span className="text-blue-600">Shop</span>
                        </h1>
                    </div>
                )}

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `px-3 py-2 font-medium ${isActive ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/about"
                        className={({ isActive }) =>
                            `px-3 py-2 font-medium ${isActive ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`
                        }
                    >
                        About
                    </NavLink>
                    <NavLink
                        to="/contact"
                        className={({ isActive }) =>
                            `px-3 py-2 font-medium ${isActive ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`
                        }
                    >
                        Contact
                    </NavLink>
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `px-3 py-2 font-medium ${isActive ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`
                        }
                    >
                        Dashboard
                    </NavLink>
                </div>

                {/* User/Auth Section */}
                <div className="flex items-center gap-4">
                    {isUser ? (
                        <div className=" flex flex-row space-x-3">
                            {user.profile_pic ? (
                                <img
                                    src={user.profile_pic}
                                    className="w-9 h-9 rounded-full object-cover border-2 border-blue-100"
                                    alt="User profile"
                                />
                            ) : (
                                    <div className=" p-2 rounded-full bg-blue-100">
                                    <User size={30}  />
                                </div>
                            )}
                            <div className="max-md:hidden">
                                <button
                                    onClick={() => {
                                        logOutUser();
                                    }}
                                    className="flex items-center w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 "
                                >
                                    <LogOut size={18} className="mr-3 text-gray-500 " />
                                    Sign Out
                                </button>
                            </div>
                           
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-3">
                            <button
                                onClick={() => navigate("/login")}
                                className="text-blue-600 font-medium px-3 py-1 hover:text-blue-800"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => navigate("/register")}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Sign Up
                            </button>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-1"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu - Includes both main nav and sidebar items */}
            {menuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMenuOpen(false)}>
                    <div className="absolute top-16 right-4 bg-white rounded-md shadow-xl w-64 py-2 max-h-[80vh] overflow-y-auto">
                        {/* Main Navigation Links */}
                        <NavLink
                            to="/"
                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 border-b border-gray-100"
                            onClick={() => setMenuOpen(false)}
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/about"
                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 border-b border-gray-100"
                            onClick={() => setMenuOpen(false)}
                        >
                            About
                        </NavLink>
                        <NavLink
                            to="/contact"
                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 border-b border-gray-100"
                            onClick={() => setMenuOpen(false)}
                        >
                            Contact
                        </NavLink>

                        {/* Sidebar Navigation Links (only for authenticated users) */}
                        {isUser && (
                            <>
                                <div className="px-4 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">
                                    Dashboard
                                </div>
                                {sidebarMenuItems.map((item, index) => (
                                    <NavLink
                                        key={index}
                                        to={item.path}
                                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 border-b border-gray-100"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <item.icon size={18} className={`mr-3 ${item.color}`} />
                                        {item.name}
                                    </NavLink>
                                ))}
                            </>
                        )}

                        {/* Auth Links */}
                        {isUser ? (
                            <button
                                onClick={() => {
                                    logOutUser();
                                    setMenuOpen(false);
                                }}
                                className="flex items-center w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50"
                            >
                                <LogOut size={18} className="mr-3 text-gray-500" />
                                Sign Out
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        navigate("/login");
                                        setMenuOpen(false);
                                    }}
                                    className="flex items-center w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 border-b border-gray-100"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => {
                                        navigate("/register");
                                        setMenuOpen(false);
                                    }}
                                    className="flex items-center w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50"
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
            <ToastContainer />
        </nav>
    );
};

export default NewNavbar;