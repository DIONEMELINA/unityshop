// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useGroup } from '../purchaseContext';
import { useAuth } from '../AuthenticationContext';
import { useNavigate } from 'react-router-dom';
import {  FiLoader } from 'react-icons/fi';

import { toast, ToastContainer } from "react-toastify";

import { DeleteSpecifiedGroup } from '../purchaseService';

export default function Update() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const { ListOfGroup } = useGroup();
  const [userGroups, setUserGroups] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const allGroups = await ListOfGroup();

        if (allGroups.length > 0) {
          const filteredGroups = allGroups.filter(
            (group) => group.created_by.id == user.id
          );
          setUserGroups(filteredGroups);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to load your groups");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleDelete = async (e, groupId) => {
    e.preventDefault();
    try {
      await DeleteSpecifiedGroup(groupId);
      toast.success("Goal deleted successfully");
      navigate(-1)
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      if (errorMessage == "Network Error") {
        toast.error("check your internet connection and try again");
      } else {
        toast.error(errorMessage)
      }

    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Your Groups</h1>
          <button
            onClick={() => navigate('/create')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm w-full md:w-auto"
          >
            Create New Group
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <FiLoader className="animate-spin h-12 w-12 text-indigo-500" />
          </div>
        ) : (
          <>
            {userGroups.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {userGroups.map((group) => (
                  <div
                    key={group.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-40 md:h-48 w-full">
                      <img
                        src={group.product.image}
                        alt={group.product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                      />
                    </div>
                    <div className="p-3 md:p-4">
                      <h3 className="font-medium text-gray-800 truncate text-sm md:text-base">{group.title}</h3>
                      <p className="text-gray-500 mt-1 truncate text-xs md:text-sm">{group.description}</p>
                      <div className="flex justify-between items-center flex-row mt-4 mb-2">

                        <button
                          className='rounded-lg py-2  px-4 text-white bg-blue-700 hover:bg-blue-600 text-xs md:text-sm'
                          onClick={(e) => {
                            e.preventDefault();
                            navigate("/update", { state: group.id });
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className='rounded-lg p py-2 px-4 text-white bg-red-600 hover:bg-red-400 text-xs md:text-sm'
                          onClick={(e) => {
                            handleDelete(e, group.id)
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 text-center">
                <p className="text-gray-500 text-sm md:text-base">You haven't created any groups yet</p>
                <button
                  onClick={() => navigate('/create')}
                  className="mt-4 rounded-lg py-2 px-4 text-white bg-blue-700 hover:bg-blue-600 text-sm md:text-base"
                >
                  Create Group
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <ToastContainer/>
    </div>
  );
}