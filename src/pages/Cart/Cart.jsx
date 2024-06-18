import React, { useContext } from 'react'
import "./Cart.css"
import {StoreContext} from '../../context/StoreContext'
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
const Cart = () => {
  const{cartItems,food_list,removeFromCart,getTotalCartAmount}=useContext(StoreContext);
  const navigate=useNavigate();
  return (
    <div className='cart'>
      <div className='cart-items'>
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br/>
        <hr/>
        {food_list.map((item,index)=>{
          if(cartItems[item._id]>0)
            {
              return(
                <div key={item._id}>
                  <div className="cart-items-title cart-items-item">
                    <img src={item.image} alt=''/>
                    <p>{item.name}</p>
                    <p>Rs.{item.price}</p>
                    <p>{cartItems[item._id]}</p>
                    <p>Rs.{item.price*cartItems[item._id]}</p>
                    <div className='cross'><img onClick={()=>removeFromCart(item._id)}src={assets.cross_icon} alt=""/></div>
                  </div>
                  <hr/>
                </div>
              )
            }
            return null;
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>Rs.{getTotalCartAmount()}</p>
          </div>
          <hr/>
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>Rs.{getTotalCartAmount()===0?0:2}</p>
          </div>
          <hr/>
          <div className="cart-total-details">
            <b>Total</b>
            <b>Rs.{getTotalCartAmount()===0?0:getTotalCartAmount()+2}</b>
          </div>
          <button onClick={()=>navigate('/order')}>Proceed To Checkout</button>
        </div>
        <div className='cart-promocode'>
        <div>
          <p>If you have a promo code,Enter it here</p>
          <div className='cart-promocode-input'>
              <input type='text' placeholder='promo code'/>
              <button>Submit</button>
          </div>
        </div>
      </div>      
    </div>
  </div>
  )
}

export default Cart