import api from "./api";
import formApi from "./formApi";
//completed

export async function CreateGoal({ title: title, description: description, target_amount: target_amount, product_name: product_name, product_description: product_description, product_unit_price: product_unit_price, product_bulk_price: product_bulk_price, product_quantity: product_quantity, group_link: group_link, start_date: start_date, end_date: end_date, product_image: product_image }) {

    try {
        const body = new FormData();
        body.append('title', title);
        body.append('description', description)
        body.append('target_amount', target_amount);
        body.append('product_name', product_name);
        body.append('product_description', product_description);
        body.append('product_unit_price', product_unit_price);
        body.append('product_bulk_price', product_bulk_price);
        body.append('product_quantity', product_quantity);
        body.append('group_link', group_link);
        body.append('start_date', start_date);
        body.append('end_date', end_date);
        body.append('product_image', product_image);
  console.log(product_image)
        const response = await formApi.post("api/purchase-goals", body);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Goal creation failed", error.response?.data || error.message);
        throw error
    }
}
//completed
export async function ListOfGroup () {
        try {
            const response = await api.get('api/purchase-goals');
            const groups = response.data.data
            localStorage.setItem('groupList', JSON.stringify(groups))

        } catch (error) {
            console.error('getting all Groups failed', error.response?.data || error.message);
            throw error;
        }
        
    }



export  function getStoredGroups() {
    const Groups = localStorage.getItem('groupList');
    try {
        return Groups ? JSON.parse(Groups) : [];
    } catch (error) {
        console.log(error);
        return [];
    }
}
//completed
export async function getSpecifiedGroup(groupId) {
    try {
        const response = await api.get(`api/purchase-goals/${groupId}`);
        return response.data.data
    } catch (error) {
        console.error('get specified group failed', error.response?.data || error.message);
        throw error;
    }
    
}

//deleting a group is done by the specified user
export async function DeleteSpecifiedGroup(groupId) {
    try {
        const response = await api.delete(`api/purchase-goals/${groupId}`);
        console.log(response.data.data)
    } catch (error) {
        console.error('Delete Group failed', error.response?.data || error.message);
        throw error;
    }

}

export async function getParticipantOfASpecifiedGroup(groupId) {
    try {

        const response = await api.get(`api/purchase-goals/${groupId}/participants`);
        console.log("Response Headers:", response.headers);
        console.log("Response Data:", response.data);

        return response.data.data;
    } catch (error) {
        console.error("get participant failed", error.response?.data || error.message);

        if (error.response) {
            console.log("Error Response Status:", error.response.status);
            console.log("Error Response Headers:", error.response.headers);
            console.log("Error Response Data:", error.response.data);
        }

        throw error;
    }
}

export async function UserCampaign () {
    try {

        const response = await api.get("https://rrn24.techchantier.com/buy_together/public/api/user/purchase_goals");
        

        return response.data.data;
    } catch (error) {
        console.error("get participant failed", error.response?.data || error.message);

        if (error.response) {
            console.log(error)
        }

        throw error;
    }
}


//only the owner of the goal can update it
export async function UpdateAGoal({ title: title, description: description, target_amount: target_amount, product_name: product_name, product_description: product_description, product_unit_price: product_unit_price, product_bulk_price: product_bulk_price, product_quantity: product_quantity, group_link: group_link, start_date: start_date, end_date: end_date, product_image: product_image }, groupId) {
    try {
        const body = new FormData();
        body.append('title', title);
        body.append('description', description)
        body.append('target_amount', target_amount);
        body.append('product_name', product_name);
        body.append('product_description', product_description);
        body.append('product_unit_price', product_unit_price);
        body.append('product_bulk_price', product_bulk_price);
        body.append('product_quantity', product_quantity);
        body.append('group_link', group_link);
        body.append('start_date', start_date);
        body.append('end_date', end_date);
        body.append('product_image', product_image);

        const response = await formApi.put(`api/purchase-goals/${groupId}`, body);
        console.log(response.data);
        console.log(title)
        return response.data;
    } catch (error) {
        console.error("Goal update failed", error.response?.data || error.message);
        throw error
    }
}


//allows any participant to  decline the join request
