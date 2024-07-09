import React, { useState } from 'react';
import "./App.css"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Footer from './components/Footer/Footer';
import Login from './components/LoginPopup/Login';
import Verify from './pages/Verify/Verify';
import MyOrders from './pages/MyOrders/MyOrders';
import GetProfile from './pages/GetProfile/GetProfile';

function App() {
  const url ="http://localhost:4000"
  const[showLogin,setShowLogin] = useState(false);
  return (
    <>
    <ToastContainer />
    {showLogin?<Login setShowLogin={setShowLogin}/>:<></>}
    <div className="App">
      <Navbar setShowLogin={setShowLogin}/>
      <Routes>
        <Route path='/'element={<Home/>}/>
        <Route path='/cart'element={<Cart/>}/>
        <Route path='/order'element={<PlaceOrder/>}/>
        <Route path='/get-profile' element={<GetProfile url={url}/>}/>
        <Route path='/verify'element={<Verify/>}/>
        <Route path='/myorders'element={<MyOrders/>}/>
      </Routes>   
    </div>
    <Footer/>
    </> 
  );
}
export default App;
