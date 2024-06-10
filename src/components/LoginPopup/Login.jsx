import React, { useState } from 'react'
import './Login.css'
import { assets } from '../../assets/assets'
const Login = ({setShowLogin}) => {
    const[currState,setCurrState]=useState("Login")
  return (
    <div className='login'>
        <form className='login-container'>
            <div className="login-title">
                <h2>{currState}</h2>
                <img onClick={()=>setShowLogin(false)}src={assets.cross_icon} alt=""/>
            </div>
            <div className="login-inputs">
                {currState==="Login"?<></>:<input type="text" placeholder='Your Name' required/>}
                
                <input type="email" placeholder='Your Email'required/>
                <input type="password" placeholder='Password'required/>
            </div>
            <button>{currState==="Sign Up"?"Sign Up":"Login"}</button>
            <div className="login-condition">
                <input type='checkbox'required/>
                <p>By continuing, I agree to the terms of use & privacy policy.</p>
            </div>
            {currState==='Login'
            ?<p>Create a new Account?<span onClick={()=>setCurrState("Sign Up")}>Click here</span></p>
            :<p>Already have an account?<span onClick={()=>setCurrState("Login")}>Login here</span></p>
            }  
        </form>
    </div>
  )
}

export default Login