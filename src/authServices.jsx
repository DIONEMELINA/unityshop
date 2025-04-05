import api from "./api";
import axios from "axios";

//register user
export async function registerUser({ name: name, email: email, contact: contact, password: password, address: address, image: image, password_confirmation:password_confirmation }) {
    try {
        const formData = new FormData();
        formData.append('name', name)
        formData.append('email', email)
        formData.append('password', password)
        formData.append('password_confirmation',password_confirmation)
        formData.append('address', address)
        formData.append('phone_number', contact)
        formData.append('profile_pic', image)
        
        const response = await axios.post("https://rrn24.techchantier.com/buy_together/public/api/register",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Accept": "application/json",
                }
            }
        );
        console.log(response.data);
    } catch (error) {
        console.error("registration failed", error.response?.data || error.message);
        throw error
    }
}
export async function loginUser({ email: email, password: password }) {
    try {
        const body = {
            'email': email,
            "password":password
        }
        const response = await api.post("api/login", body);
        const token = response.data.data.token;
        const user = response.data.data.user;

        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    } catch (error) {
        console.error('login failed', error.response?.data || error.message);
        throw error;
    }
  
}

//logout

export async function logoutUser() {
    try {
        const response=await api.post("/api/logout");
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        console.log(response.data)
        return 'success'
    } catch (error) {
        console.error('logout failed', error.response?.data || error.message);
        return 'failed'
    }
}

export function getStoredUser() {
    const user = localStorage.getItem("user");
    try {
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error("Error parsing user data:", error);
        return null;
    }
}


