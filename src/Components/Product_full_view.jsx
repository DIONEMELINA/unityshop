// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGroup } from '../purchaseContext';

import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import Footer from './Footer';
import NewNavbar from './newNavBar';
import { toast, ToastContainer } from 'react-toastify';


export default function Product_full_view() {
    const location = useLocation();
    const groupId = location.state;
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true)
    const { joinASpecifiedGroup, getSpecifiedGroup, specifiedGroupData } = useGroup();
    const [joinClicked, setJoinedclicked] = useState(false)


    useEffect(() => {
        console.log(groupId)
        const fetchData = async () => {
            try {
                await getSpecifiedGroup(groupId);

            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }

        }
        fetchData();
    }, []);

    const handleJoinGroup = async (e) => {
        setJoinedclicked(true)
        e.preventDefault()
        try {

            await joinASpecifiedGroup(specifiedGroupData.id);
            toast.success("Join group successful")
            navigate(-1);

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            if (errorMessage === 'You have already joined this purchase goal!') {
                toast.error(errorMessage);
                setJoinedclicked(false)
            } else if (errorMessage == "Network Error") {
                toast.error("check your internet connection and try again");
                setJoinedclicked(false)
            }

        }

    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const progressPercentage = (parseFloat(specifiedGroupData.amount_per_person) / parseFloat(specifiedGroupData.target_amount)) * 100

    return (
        <div>
            <NewNavbar />
            {
                isLoading ? <div className="flex justify-center items-center h-[85vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div> : <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-20">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                            {/* Product Image Header */}

                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={specifiedGroupData.product.image}
                                    alt={specifiedGroupData.product.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-6">
                                    <h1 className="text-3xl font-bold text-white">{specifiedGroupData.title}</h1>
                                    <p className="text-gray-200 mt-1">{specifiedGroupData.product.name}</p>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="p-6">
                                {/* Status and Dates */}
                                <div className="flex flex-wrap justify-between items-center mb-6">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${specifiedGroupData.status === 'open'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {specifiedGroupData.status.toUpperCase()}
                                    </span>
                                    <div className="text-sm text-gray-500">
                                        <span>{formatDate(specifiedGroupData.start_date)} - {formatDate(specifiedGroupData.end_date)}</span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-8">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">
                                            Collected: FCFA{specifiedGroupData.amount_per_person}
                                        </span>
                                        <span className="text-sm font-medium text-gray-700">
                                            Target: FCFA{specifiedGroupData.target_amount}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full"
                                            style={{ width: `${progressPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Product Details */}
                                <div className="mb-8">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Product Details</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-gray-600 mb-2"><span className="font-medium">Name:</span> {specifiedGroupData.product.name}</p>
                                            <p className="text-gray-600 mb-2"><span className="font-medium">Description:</span> {specifiedGroupData.product.description}</p>
                                            <p className="text-gray-600 mb-2"><span className="font-medium">Quantity:</span> {specifiedGroupData.product.quantity}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 mb-2"><span className="font-medium">Unit Price:</span> FCFA{specifiedGroupData.product.unit_price}</p>
                                            <p className="text-gray-600 mb-2"><span className="font-medium">Bulk Price:</span> FCFA{specifiedGroupData.product.bulk_price}</p>
                                            <p className="text-gray-600 mb-2"><span className="font-medium">Amount per Person:</span> FCFA{specifiedGroupData.amount_per_person}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Group Details */}
                                <div className="mb-8">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Group Details</h2>
                                    <p className="text-gray-600 mb-4">{specifiedGroupData.description}</p>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                                            {specifiedGroupData.created_by.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{specifiedGroupData.created_by.name}</p>
                                            <p className="text-sm text-gray-500">{specifiedGroupData.created_by.email}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        {
                                            joinClicked ? <button
                                                className=" items-center px-6 py-3 bg-blue-300 text-white rounded-md transition-colors"
                                                disabled>
                                                Joining group
                                            </button> : <button
                                                className=" items-center px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-colors"
                                                onClick={handleJoinGroup}>
                                                Join Group
                                            </button>
                                        }

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            }
            <Footer />
            <ToastContainer />
        </div>

    );
}
