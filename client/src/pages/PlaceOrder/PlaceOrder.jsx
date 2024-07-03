import React, { useContext, useEffect, useState } from 'react';
import "./PlaceOrder.css";
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item, quantity: cartItems[item._id] };
        orderItems.push(itemInfo);
      }
      return null;
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };

    try {
      let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });

      if (response.data.success) {
        const { orderId, amount, currency, success_url, cancel_url } = response.data;
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: amount,
          currency: currency,
          name: "Your Company Name",
          description: "Test Transaction",
          order_id: orderId,
          handler: function (response) {
            window.location.href = `${success_url}&payment_id=${response.razorpay_payment_id}`;
          },
          prefill: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            contact: data.phone,
          },
          notes: {
            address: `${data.street}, ${data.city}, ${data.state}, ${data.zipcode}, ${data.country}`,
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response) {
          window.location.href = `${cancel_url}&error=${response.error.description}`;
        });
        rzp1.open();
      } else {
        alert("Error");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order. Please try again.");
    }
  };
  
  useEffect(()=>{
    if(!token){
      navigate('/cart')
    }
    else if(getTotalCartAmount()===0){
      navigate("/cart")
    }
  },[token,getTotalCartAmount, navigate])
  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className='multi-fields'>
          <input name='firstName' onChange={onChangeHandler} value={data.firstName} type='text' placeholder='First name' required />
          <input name='lastName' onChange={onChangeHandler} value={data.lastName} type='text' placeholder='Last name' required />
        </div>
        <input name='email' onChange={onChangeHandler} value={data.email} type='email' placeholder='Email address' required />
        <input name='street' onChange={onChangeHandler} value={data.street} type='text' placeholder='Street' required />
        <div className='multi-fields'>
          <input name='city' onChange={onChangeHandler} value={data.city} type='text' placeholder='City' required />
          <input name='state' onChange={onChangeHandler} value={data.state} type='text' placeholder='State' required />
        </div>
        <div className='multi-fields'>
          <input name='zipcode' onChange={onChangeHandler} value={data.zipcode} type='text' placeholder='Zip code' required />
          <input name='country' onChange={onChangeHandler} value={data.country} type='text' placeholder='Country' required />
        </div>
        <input name='phone' onChange={onChangeHandler} value={data.phone} type='text' placeholder='Phone' required />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>Rs.{getTotalCartAmount()}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>Rs.{getTotalCartAmount() === 0 ? 0 : 2}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <b>Total</b>
            <b>Rs.{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
          </div>
          <button type='submit'>Proceed To Payment</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
