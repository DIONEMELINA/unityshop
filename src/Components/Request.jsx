// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useGroup } from '../purchaseContext';
import { useAuth } from '../AuthenticationContext';
import { User, Check, X, Clock, ChevronLeft, Users, ShoppingBag, ChevronRight } from 'lucide-react';
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";

const Request = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    Groups,
    fetchPendingParticipants,
    pendingRequests,
    ApproveAJoinAGoalRequest,
    DeclineAJoinAGoalRequest,
  } = useGroup();

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('joinRequests');
  const [userGroups, setUserGroups] = useState([]);
  const [requestStatus, setRequestStatus] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchPendingParticipants();
        if (Groups.length > 0) {
          const filteredGroups = Groups.filter(
            (group) => group.created_by.id == user.id
          );
          setUserGroups(filteredGroups);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApproveRequest = async (groupId, userId, e) => {
    e.preventDefault();
    try {
      setRequestStatus(prev => ({
        ...prev,
        [`${groupId}-${userId}`]: 'approving'
      }));

      await ApproveAJoinAGoalRequest(groupId, userId);

      setRequestStatus(prev => ({
        ...prev,
        [`${groupId}-${userId}`]: 'approved'
      }));

      toast.success("Request approved successfully");
    } catch (error) {
      setRequestStatus(prev => ({
        ...prev,
        [`${groupId}-${userId}`]: 'error'
      }));

      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage == "Network Error"
        ? "Check your internet connection and try again"
        : errorMessage);
    }
  };

  const handleDecline = async (groupId, userId, e) => {
    e.preventDefault();
    try {
      setRequestStatus(prev => ({
        ...prev,
        [`${groupId}-${userId}`]: 'declining'
      }));

      await DeclineAJoinAGoalRequest(groupId, userId);

      setRequestStatus(prev => ({
        ...prev,
        [`${groupId}-${userId}`]: 'declined'
      }));

      toast.success("Request declined successfully");
    } catch (error) {
      setRequestStatus(prev => ({
        ...prev,
        [`${groupId}-${userId}`]: 'error'
      }));

      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage == "Network Error"
        ? "Check your internet connection and try again"
        : errorMessage);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {
        console.log(pendingRequests)
      }
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header with Back Button */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Requests</h1>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('joinRequests')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'joinRequests'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <Users className="mr-2 h-4 w-4" />
                Join Requests
              </button>
              <button
                onClick={() => setActiveTab('userGroups')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'userGroups'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Your Groups
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {/* Join Requests Tab */}
            {activeTab === 'joinRequests' && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center">
                    <Users className="mr-2 h-5 w-5 text-indigo-500" />
                    Pending Join Requests
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {pendingRequests.length} pending request{pendingRequests.length !== 1 ? 's' : ''}
                  </p>
                </div>
                {pendingRequests.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {pendingRequests.map((request) =>
                      request.pendingParticipants.map((participant) => {
                        const status = requestStatus[`${request.groupId}-${participant.id}`] || '';
                        const isProcessing = status === 'approving' || status === 'declining';

                        return (
                          <li key={`${request.groupId}-${participant.id}`} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                  {participant.profile_pic ? (
                                    <img
                                      src={participant.profile_pic}
                                      alt={participant.name}
                                      className="h-12 w-12 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="bg-indigo-100 rounded-full p-3">
                                      <User className="h-6 w-6 text-indigo-600" />
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-gray-900">
                                    {participant.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Wants to join <span className="font-medium text-indigo-600">{request.groupName}</span>
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    Requested on {new Date(participant.joined_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {status === 'approved' ? (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <Check className="mr-1 h-3 w-3" /> Approved
                                  </span>
                                ) : status === 'declined' ? (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    <X className="mr-1 h-3 w-3" /> Declined
                                  </span>
                                ) : (
                                  <>
                                    <button
                                      onClick={(e) => handleDecline(request.groupId, participant.id, e)}
                                      disabled={isProcessing}
                                      className={`inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md ${isProcessing
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                      {status === 'declining' ? (
                                        <>
                                          <Clock className="mr-1 h-3 w-3 animate-spin" /> Declining...
                                        </>
                                      ) : (
                                        <>
                                          <X className="mr-1 h-3 w-3" /> Decline
                                        </>
                                      )}
                                    </button>
                                    <button
                                      onClick={(e) => handleApproveRequest(request.groupId, participant.id, e)}
                                      disabled={isProcessing}
                                      className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm ${isProcessing
                                        ? 'bg-indigo-100 text-indigo-400 cursor-not-allowed'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        }`}
                                    >
                                      {status === 'approving' ? (
                                        <>
                                          <Clock className="mr-1 h-3 w-3 animate-spin" /> Approving...
                                        </>
                                      ) : (
                                        <>
                                          <Check className="mr-1 h-3 w-3" /> Approve
                                        </>
                                      )}
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </li>
                        );
                      })
                    )}
                  </ul>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <div className="mx-auto h-24 w-24 text-gray-300">
                      <Users className="mx-auto h-full w-full" />
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No pending requests</h3>
                    <p className="mt-1 text-sm text-gray-500">You'll see requests here when people want to join your groups.</p>
                  </div>
                )}
              </div>
            )}

            {/* User Groups Tab */}
            {activeTab === 'userGroups' && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center">
                    <ShoppingBag className="mr-2 h-5 w-5 text-indigo-500" />
                    Your Groups
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {userGroups.length} group{userGroups.length !== 1 ? 's' : ''} created
                  </p>
                </div>
                {userGroups.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {userGroups.map((group) => (
                      <li
                        key={group.id}
                        className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/group/${group.id}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                              <img
                                src={group.product.image || 'https://via.placeholder.com/150'}
                                alt={group.product.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {group.title}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {group.description}
                              </p>
                              <div className="mt-1 flex items-center text-xs text-gray-500">

                                <span className="inline-flex items-center">
                                  <Clock className="mr-1 h-3 w-3" /> Created {new Date(group.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <div className="mx-auto h-24 w-24 text-gray-300">
                      <ShoppingBag className="mx-auto h-full w-full" />
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No groups created</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating your first group purchase.</p>
                    <button
                      onClick={() => navigate('/create')}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Create Group
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Request;