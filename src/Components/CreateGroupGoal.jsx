import { useState } from 'react';
import { MdArrowBack, MdOutlineShoppingBag, MdOutlineDescription, MdLink, MdCalendarToday } from "react-icons/md";
import { FiDollarSign, FiImage, FiPackage } from "react-icons/fi";
import Footer from './Footer';
import { CreateGoal } from '../purchaseService';
import { useNavigate } from 'react-router-dom';
import NewNavbar from './NewNavBar';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// eslint-disable-next-line no-unused-vars
import React from 'react';

export default function CreateGroupGoal() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
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
    const [errors, setErrors] = useState({});

    const steps = [
        { title: "Group Information", icon: <MdOutlineShoppingBag /> },
        { title: "Product Details", icon: <FiPackage /> },
        { title: "Timeline", icon: <MdCalendarToday /> },
        { title: "Review & Submit", icon: <MdOutlineDescription /> }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNumberInput = (e) => {
        const { name, value } = e.target;
        if (/^[0-9]*$/.test(value)) {
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

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 0) {
            if (!formData.title.trim()) newErrors.title = 'Group name is required';
            if (!formData.description.trim()) newErrors.description = 'Description is required';
            if (!formData.target_amount) newErrors.target_amount = 'Target amount is required';
            if (!formData.group_link.trim()) newErrors.group_link = 'Group link is required';
            if (formData.group_link.trim() && !isValidUrl(formData.group_link)) {
                newErrors.group_link = 'Please enter a valid URL';
            }
        } else if (step === 1) {
            if (!formData.product_name.trim()) newErrors.product_name = 'Product name is required';
            if (!formData.product_description.trim()) newErrors.product_description = 'Product description is required';
            if (!formData.product_unit_price) newErrors.product_unit_price = 'Unit price is required';
            if (!formData.product_bulk_price) newErrors.product_bulk_price = 'Bulk price is required';
            if (!formData.product_quantity) newErrors.product_quantity = 'Quantity is required';
            if (!formData.image) newErrors.image = 'Product image is required';
        } else if (step === 2) {
            if (!formData.start_date) newErrors.start_date = 'Start date is required';
            if (!formData.end_date) newErrors.end_date = 'End date is required';
            if (formData.start_date && formData.end_date && new Date(formData.start_date) > new Date(formData.end_date)) {
                newErrors.end_date = 'End date must be after start date';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
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

        try {
            await CreateGoal({
                ...formData,
                product_unit_price: parseInt(formData.product_unit_price, 10),
                product_bulk_price: parseInt(formData.product_bulk_price, 10),
                product_quantity: parseInt(formData.product_quantity, 10)
            });
            toast.success("Buy Goal created successfully!");
            navigate('/dashboard');
        } catch (error) {
            toast.error("Failed to create your Buy Goal");
            console.error(error);
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
                    Back
                </button>

                {/* Stepper */}
                <div className="mb-8">
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
                    {step === 0 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-800">Group Information</h2>
                            <p className="text-gray-600">Provide basic details about your group purchase</p>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                    <MdOutlineShoppingBag className="mr-2" /> Group Name
                                </label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                    <MdOutlineDescription className="mr-2" /> Group Description
                                </label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                    <FiDollarSign className="mr-2" /> Target Amount FCFA
                                </label>
                                <input
                                    type="text"
                                    name="target_amount"
                                    value={formData.target_amount}
                                    onChange={handleNumberInput}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.target_amount ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="e.g. 50000"
                                />
                                {errors.target_amount && <p className="mt-1 text-sm text-red-600">{errors.target_amount}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                    <MdLink className="mr-2" /> WhatsApp Group Link
                                </label>
                                <input
                                    type="text"
                                    name="group_link"
                                    value={formData.group_link}
                                    onChange={handleChange}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.group_link ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="https://chat.whatsapp.com/..."
                                />
                                {errors.group_link && <p className="mt-1 text-sm text-red-600">{errors.group_link}</p>}
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
                            <p className="text-gray-600">Provide information about the product you're purchasing</p>

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
                                                <img
                                                    src={URL.createObjectURL(formData.image)}
                                                    alt="Preview"
                                                    className="h-32 w-32 object-contain mb-2"
                                                />
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
                            <h2 className="text-2xl font-bold text-gray-800">Purchase Timeline</h2>
                            <p className="text-gray-600">Set the duration for this group purchase</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.start_date ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.start_date && <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        name="end_date"
                                        value={formData.end_date}
                                        onChange={handleChange}
                                        min={formData.start_date || new Date().toISOString().split('T')[0]}
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.end_date ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-800">Review Your Group Purchase</h2>
                            <p className="text-gray-600">Please verify all information before submitting</p>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium text-gray-800 mb-3">Group Details</h3>
                                <div className="space-y-2">
                                    <p><span className="text-gray-600">Name:</span> {formData.title}</p>
                                    <p><span className="text-gray-600">Description:</span> {formData.description}</p>
                                    <p><span className="text-gray-600">Target Amount:</span> ₦{formData.target_amount}</p>
                                    <p><span className="text-gray-600">WhatsApp Link:</span> {formData.group_link}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium text-gray-800 mb-3">Product Details</h3>
                                <div className="space-y-2">
                                    <p><span className="text-gray-600">Product Name:</span> {formData.product_name}</p>
                                    <p><span className="text-gray-600">Description:</span> {formData.product_description}</p>
                                    <p><span className="text-gray-600">Unit Price:</span> ₦{formData.product_unit_price}</p>
                                    <p><span className="text-gray-600">Bulk Price:</span> ₦{formData.product_bulk_price}</p>
                                    <p><span className="text-gray-600">Quantity:</span> {formData.product_quantity}</p>
                                    {formData.image && (
                                        <div className="mt-2">
                                            <span className="text-gray-600">Product Image:</span>
                                            <img
                                                src={URL.createObjectURL(formData.image)}
                                                alt="Product preview"
                                                className="h-32 w-32 object-contain mt-1"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium text-gray-800 mb-3">Timeline</h3>
                                <div className="space-y-2">
                                    <p><span className="text-gray-600">Start Date:</span> {formData.start_date}</p>
                                    <p><span className="text-gray-600">End Date:</span> {formData.end_date}</p>
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
                            >
                                Previous
                            </button>
                        ) : (
                            <div></div> // Empty div to maintain space
                        )}

                        {step < steps.length - 1 ? (
                            <button
                                onClick={handleNext}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Submit Group Purchase
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}