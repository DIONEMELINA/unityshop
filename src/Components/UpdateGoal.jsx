import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdArrowBack, MdOutlineShoppingBag, MdCalendarToday } from "react-icons/md";
import {  FiImage, FiPackage, FiLoader } from "react-icons/fi";
import Footer from './Footer';
import { UpdateAGoal } from '../purchaseService';
import { useGroup } from '../purchaseContext';
import { toast, ToastContainer } from "react-toastify";
import NewNavbar from './NewNavBar';
import "react-toastify/dist/ReactToastify.css";
// eslint-disable-next-line no-unused-vars
import React from 'react';

export default function UpdateGoal() {
    const navigate = useNavigate();
    const location = useLocation();
    const groupId = location.state;
    const { specifiedGroupData, getSpecifiedGroup } = useGroup();
    const isMounted = useRef(false);

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(0);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        target_amount: '',
        product_name: '',
        product_description: '',
        product_unit_price: '',
        product_bulk_price: '',
        product_quantity: '',
        image: null,
        group_link: '',
        start_date: '',
        end_date: ''
    });

    // Error states
    const [errors, setErrors] = useState({});

    const steps = [
        { title: "Group Information", icon: <MdOutlineShoppingBag /> },
        { title: "Product Details", icon: <FiPackage /> },
        { title: "Timeline", icon: <MdCalendarToday /> }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getSpecifiedGroup(groupId);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load group data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [groupId, getSpecifiedGroup]);

    useEffect(() => {
        if (specifiedGroupData && Object.keys(specifiedGroupData).length > 0 && !isMounted.current) {
            isMounted.current = true;

            setFormData({
                title: specifiedGroupData.title || "",
                description: specifiedGroupData.description || "",
                target_amount: specifiedGroupData.target_amount || "",
                group_link: specifiedGroupData.group_link || "",
                start_date: specifiedGroupData.start_date ? new Date(specifiedGroupData.start_date).toISOString().split('T')[0] : '',
                end_date: specifiedGroupData.end_date ? new Date(specifiedGroupData.end_date).toISOString().split('T')[0] : '',
                product_name: specifiedGroupData.product?.name || "",
                product_description: specifiedGroupData.product?.description || "",
                product_unit_price: specifiedGroupData.product?.unit_price || "",
                product_bulk_price: specifiedGroupData.product?.bulk_price || "",
                product_quantity: specifiedGroupData.product?.quantity || "",
                image: specifiedGroupData.product?.image || null
            });
        }
    }, [specifiedGroupData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleNumberInput = (e) => {
        const { name, value } = e.target;
        if (/^[0-9]*\.?[0-9]*$/.test(value)) {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setErrors(prev => ({
                ...prev,
                image: 'Only JPG, PNG, GIF, or WEBP images are allowed'
            }));
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({
                ...prev,
                image: 'File should not exceed 5MB'
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            image: file
        }));
        setErrors(prev => ({
            ...prev,
            image: ''
        }));
    };

    const validateStep = (currentStep) => {
        const newErrors = {};

        if (currentStep === 0) {
            if (!formData.title.trim()) newErrors.title = 'Group name is required';
            if (!formData.description.trim()) newErrors.description = 'Description is required';
            if (!formData.target_amount) newErrors.target_amount = 'Target amount is required';
            if (formData.target_amount && parseFloat(formData.target_amount) <= 0) {
                newErrors.target_amount = 'Amount must be positive';
            }
        } else if (currentStep === 1) {
            if (!formData.product_name.trim()) newErrors.product_name = 'Product name is required';
            if (!formData.product_description.trim()) newErrors.product_description = 'Product description is required';
            if (!formData.product_unit_price) newErrors.product_unit_price = 'Unit price is required';
            if (!formData.product_bulk_price) newErrors.product_bulk_price = 'Bulk price is required';
            if (!formData.product_quantity) newErrors.product_quantity = 'Quantity is required';
        } else if (currentStep === 2) {
            if (!formData.end_date) newErrors.end_date = 'End date is required';
            if (formData.start_date && formData.end_date && new Date(formData.end_date) < new Date(formData.start_date)) {
                newErrors.end_date = 'End date must be after start date';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (!validateStep(step)) {
            toast.error("Please fill all required fields correctly");
            return;
        }
        setStep(prev => prev + 1);
    };

    const handlePrev = () => {
        setStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep(step)) return;

        setIsSubmitting(true);
        try {
            await UpdateAGoal({
                ...formData,
                product_unit_price: parseFloat(formData.product_unit_price),
                product_bulk_price: parseFloat(formData.product_bulk_price),
                product_quantity: parseInt(formData.product_quantity, 10)
            }, groupId);

            toast.success("Group updated successfully!");
            setTimeout(() => navigate(-1), 1500);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update group");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <NewNavbar />
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
                >
                    <MdArrowBack className="mr-2" size={20} />
                    Back to Dashboard
                </button>

                {/* Stepper */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Update Group Purchase</h1>
                    <div className="flex justify-between relative">
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
                        {steps.map((s, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= index ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                                >
                                    {s.icon}
                                </div>
                                <span className={`text-xs mt-2 ${step >= index ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                                    {s.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                        </div>
                    ) : (
                        <>
                            {step === 0 && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-gray-800">Group Information</h2>
                                    <p className="text-gray-600">Update basic details about your group purchase</p>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="e.g. Organic Coffee Group Buy"
                                        />
                                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Group Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={3}
                                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Describe the purpose of this group purchase"
                                        />
                                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount FCFA</label>
                                        <input
                                            type="text"
                                            name="target_amount"
                                            value={formData.target_amount}
                                            onChange={handleNumberInput}
                                            inputMode="decimal"
                                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.target_amount ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="e.g. 50000"
                                        />
                                        {errors.target_amount && <p className="mt-1 text-sm text-red-600">{errors.target_amount}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Group Link</label>
                                        <input
                                            type="text"
                                            name="group_link"
                                            value={formData.group_link}
                                            onChange={handleChange}
                                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.group_link ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="https://chat.whatsapp.com/..."
                                            disabled
                                        />
                                    </div>
                                </div>
                            )}

                            {step === 1 && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-gray-800">Product Details</h2>
                                    <p className="text-gray-600">Update information about the product</p>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                        <input
                                            type="text"
                                            name="product_name"
                                            value={formData.product_name}
                                            onChange={handleChange}
                                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.product_name ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="e.g. Organic Arabica Coffee Beans"
                                        />
                                        {errors.product_name && <p className="mt-1 text-sm text-red-600">{errors.product_name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
                                        <textarea
                                            name="product_description"
                                            value={formData.product_description}
                                            onChange={handleChange}
                                            rows={3}
                                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.product_description ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Describe the product features and benefits"
                                        />
                                        {errors.product_description && <p className="mt-1 text-sm text-red-600">{errors.product_description}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price FCFA</label>
                                            <input
                                                type="text"
                                                name="product_unit_price"
                                                value={formData.product_unit_price}
                                                onChange={handleNumberInput}
                                                inputMode="decimal"
                                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.product_unit_price ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="e.g. 5000"
                                            />
                                            {errors.product_unit_price && <p className="mt-1 text-sm text-red-600">{errors.product_unit_price}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Bulk Price FCFA</label>
                                            <input
                                                type="text"
                                                name="product_bulk_price"
                                                value={formData.product_bulk_price}
                                                onChange={handleNumberInput}
                                                inputMode="decimal"
                                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.product_bulk_price ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="e.g. 4500"
                                            />
                                            {errors.product_bulk_price && <p className="mt-1 text-sm text-red-600">{errors.product_bulk_price}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                            <input
                                                type="text"
                                                name="product_quantity"
                                                value={formData.product_quantity}
                                                onChange={handleNumberInput}
                                                inputMode="numeric"
                                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.product_quantity ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="e.g. 100"
                                            />
                                            {errors.product_quantity && <p className="mt-1 text-sm text-red-600">{errors.product_quantity}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                                        <div className={`border-2 border-dashed rounded-lg p-4 text-center ${errors.image ? 'border-red-500' : 'border-gray-300'}`}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                id="product-image"
                                            />
                                            <label htmlFor="product-image" className="cursor-pointer">
                                                {formData.image ? (
                                                    <div className="flex flex-col items-center">
                                                        {typeof formData.image === 'string' ? (
                                                            <img
                                                                src={formData.image}
                                                                alt="Current product"
                                                                className="h-32 w-32 object-contain mb-2"
                                                            />
                                                        ) : (
                                                            <img
                                                                src={URL.createObjectURL(formData.image)}
                                                                alt="New product"
                                                                className="h-32 w-32 object-contain mb-2"
                                                            />
                                                        )}
                                                        <span className="text-sm text-indigo-600">Change image</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center">
                                                        <FiImage className="h-12 w-12 text-gray-400 mb-2" />
                                                        <p className="text-sm text-gray-600">Click to upload product image</p>
                                                        <p className="text-xs text-gray-500">JPG, PNG, GIF or WEBP (Max 5MB)</p>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                        {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-gray-800">Purchase Timeline</h2>
                                    <p className="text-gray-600">Update the duration for this group purchase</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                            <input
                                                type="date"
                                                name="start_date"
                                                value={formData.start_date}
                                                onChange={handleChange}
                                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.start_date ? 'border-red-500' : 'border-gray-300'}`}
                                                disabled
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                            <input
                                                type="date"
                                                name="end_date"
                                                value={formData.end_date}
                                                onChange={handleChange}
                                                min={formData.start_date}
                                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.end_date ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                            {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-8">
                                {step > 0 ? (
                                    <button
                                        onClick={handlePrev}
                                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                        disabled={isSubmitting}
                                    >
                                        Previous
                                    </button>
                                ) : (
                                    <div></div> // Empty div to maintain space
                                )}

                                {step < steps.length - 1 ? (
                                    <button
                                        onClick={handleNext}
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center min-w-[100px]"
                                        disabled={isSubmitting}
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center min-w-[150px]"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <FiLoader className="animate-spin mr-2" />
                                                Updating...
                                            </>
                                        ) : 'Update Group'}
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}