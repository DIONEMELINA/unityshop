import { createContext, useContext, useState } from "react";
// eslint-disable-next-line no-unused-vars
import React from "react";
import { getStoredGroups } from "./purchaseService";
import api from "./api";
import { useAuth } from "./AuthenticationContext";



const GroupContext = createContext();


export function GroupProvider({ children }) {
    const [Groups, setGroups] = useState(getStoredGroups() || []);
    const [specifiedGroupData, setSpecifiedGroupData] = useState({});
    const [joinRequest, setJoinrequest] = useState({});
    const { user } = useAuth();
    const [userGroups, setUserGroups] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([])

    async function ListOfGroup() {
        try {
            const response = await api.get('/api/purchase-goals');
            const groups = response?.data.data
            localStorage.setItem('groupList', JSON.stringify(groups))
            setGroups(groups)
            return response?.data.data;
        } catch (error) {
            console.error('login failed', error.response?.data || error.message);
            throw error;
        }

    }

    async function joinASpecifiedGroup(groupId) {

        try {
            const response = await api.post(`/api/purchase-goals/${groupId}/join`);
            console.log(response.data.data)
            setJoinrequest(response.data.data)
            return response.data.data;
        } catch (error) {
            console.error(' join request failed', error.response?.data || error.message);
            throw error
            
        }

    }

    async function getSpecifiedGroup(groupId) {
        try {
            const response = await api.get(`/api/purchase-goals/${groupId}`);
            setSpecifiedGroupData(response.data.data)
        } catch (error) {
            console.error('login failed', error.response?.data || error.message);
            throw error;
        }

    }

    async function getParticipantOfASpecifiedGroup(groupId) {
        try {

            const response = await api.get(`api/purchase-goals/${groupId}/participants`);
            console.log("Response Headers:", response.headers);
            console.log("Response Data:", response.data);

            return response.data.data;
        } catch (error) {
            console.error("get participant failed", error.response?.data || error.message);
            throw error;
        }
    }

    const fetchPendingParticipants = async () => {
        try {
            const allGroups = await ListOfGroup(); // get fresh data directly

            const filteredGroups = allGroups.filter(
                (group) => group.created_by?.id === user.id
            );
            console.log(filteredGroups);
            setUserGroups(filteredGroups); // if you still need to update the UI

            const pendingResultsPromises = filteredGroups.map(async (group) => {
                if (!group?.id) {
                    console.warn("Skipping group with missing ID:", group);
                    return null;
                }

                try {
                    const participants = await getParticipantOfASpecifiedGroup(group.id);
                    if (!participants || !Array.isArray(participants)) return null;

                    const pending = participants.filter((p) => p.status === "pending");

                    if (pending.length > 0) {
                        return {
                            groupId: group.id,
                            groupName: group.title,
                            pendingParticipants: pending,
                        };
                    }
                } catch (error) {
                    console.error(`Error fetching participants for group ${group.id}:`, error.response?.message);
                }

                return null; // ensure clean fallback
            });

            const pendingResultsArray = await Promise.all(pendingResultsPromises);
            const validPendingResults = pendingResultsArray.filter(Boolean); // remove nulls

            setPendingRequests(validPendingResults);
            console.log(" Final pending requests:", validPendingResults);
        } catch (err) {
            console.error("Failed to fetch pending participants:", err);
        }
    };

    async function ApproveAJoinAGoalRequest(groupId, user_id) {
        try {
            const response = await api.post(`api/purchase-goals/${groupId}/approve/${user_id}`);

            console.log(response.data.data);
            return response.data.data
        } catch (error) {
            console.error('Approve Request Failed', error.response?.data || error.message);
            throw error;
        }

    }

 async function DeclineAJoinAGoalRequest(groupId, user_id) {
        try {
            const response = await api.post(`api/purchase-goals/${groupId}/approve/${user_id}`);
            console.log(response.data.data)
            return response.data.data
        } catch (error) {
            console.error('Decline failed', error.response?.data || error.message);
            throw error;
        }

    }


    return (
        <GroupContext.Provider value={{ Groups, ListOfGroup, specifiedGroupData, getSpecifiedGroup, joinASpecifiedGroup, joinRequest, pendingRequests, fetchPendingParticipants, userGroups, ApproveAJoinAGoalRequest, DeclineAJoinAGoalRequest }}>
            {children}
        </GroupContext.Provider>
    );
}

export function useGroup() {
    return useContext(GroupContext);
}

