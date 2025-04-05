// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Hand, Pencil, ShoppingCart, UserCircle, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthenticationContext';

function SideBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const menuList = [
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
            icon: UserCircle,
            path: '/profile',
            color: 'text-purple-500'
        }
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className='h-full w-full bg-white border-r border-gray-200 flex flex-col p-4 pt-10'>
            {/* Create Button */}
            <button
                className='flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white w-full rounded-xl p-3 mb-6 shadow-md hover:shadow-lg transition-all hover:from-indigo-700 hover:to-blue-600'
                onClick={() => navigate('/create')}
            >
                <span className='font-medium'>+Create a Group Buy</span>
            </button>

            {/* Menu Items */}
            <div className='flex-1 space-y-1'>
                {menuList.map((menu, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors
                            ${location.pathname === menu.path
                                ? 'bg-indigo-50 text-indigo-700 font-medium border border-indigo-100'
                                : 'hover:bg-gray-50 text-gray-700'}`}
                        onClick={() => navigate(menu.path)}
                    >
                        <menu.icon
                            size={18}
                            className={`${location.pathname === menu.path ? 'text-indigo-600' : menu.color}`}
                        />
                        <span className='text-sm'>{menu.name}</span>
                        {location.pathname === menu.path && (
                            <div className='ml-auto w-2 h-2 bg-indigo-600 rounded-full'></div>
                        )}
                    </div>
                ))}
            </div>

            {/* Logout Button */}
            <div
                className='flex items-center gap-3 p-3 rounded-xl cursor-pointer text-gray-700 hover:bg-gray-50 mt-auto mb-4'
                onClick={handleLogout}
            >
                <LogOut size={18} className='text-gray-500' />
                <span className='text-sm'>Logout</span>
            </div>
        </div>
    );
}

export default SideBar;