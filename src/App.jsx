// eslint-disable-next-line no-unused-vars
import React from 'react';

import { Routes, Route } from 'react-router-dom';
import CreateGroupGoal from './Components/CreateGroupGoal';
import Profile from './Components/Profile';
import Register from './Components/Register';
import Login from './Components/Login';
import { AuthProvider } from './AuthenticationContext';
import HomeScreen from './Components/HomeScreen';
import { GroupProvider } from './purchaseContext';
import ProductFullView from './Components/Product_full_view';
import UpdateGoal from './Components/UpdateGoal';
import AboutUs from './Components/AboutUs';
import ContactUs from './Components/Contactus';
import DashBoardPage from './pages/DashBoardPage';
import Request from './Components/Request';
import Update from './Components/Update';


function App() {
  return (
    <AuthProvider>
      <GroupProvider>
        <Routes>
        <Route path='/profile' element={<Profile />} />
            {/* Routes without Sidebar */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/view" element={<ProductFullView />} />
            <Route path="/update" element={<UpdateGoal />} />
            <Route path="/create" element={<CreateGroupGoal />} />
          <Route path='/' element={<HomeScreen />} />
          <Route path='/about' element={<AboutUs />} />
          <Route path='/contact' element={<ContactUs />} />
          <Route path='/updateGroup' element= {<DashBoardPage/>}/>
          <Route path='/dashboard' element={<DashBoardPage />} />
          <Route path='/request' element={<Request/> } />
          </Routes>
      </GroupProvider>
    </AuthProvider>
  );
}

export default App;