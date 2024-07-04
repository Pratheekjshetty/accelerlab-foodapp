import React, {  useContext, useState } from 'react'
import './Login.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Login = ({setShowLogin}) => {

    const {url,setToken} = useContext(StoreContext)
    const[currState,setCurrState]=useState("Login")
    const [data,setData] = useState({
        name:"",
        email:"",
        password:""
    })

    const navigate = useNavigate();

    const onChangeHandler =(event)=>{
        const name = event.target.name;
        const value = event.target.value;
        setData(data=>({...data,[name]:value}))
    }
    const onLogin =async(event) =>{
        event.preventDefault()
        let newUrl = url;
        if (currState==="Login"){
            newUrl += "/api/user/login"
        }
        else{
            newUrl += "/api/user/register"
        }

        const response = await axios.post(newUrl,data);
        if(response.data.success){
            setToken(response.data.token);
            localStorage.setItem("token",response.data.token)

            if (response.data.role === 'admin') {
                window.location.href = 'http://localhost:3001/';
            }
            else{
                setShowLogin(false)
                navigate('/');
            }
        }
        else{
            alert(response.data.message);
        }
    }
    // useEffect(()=>{
    //     console.log(data);
    // },[data])
  return (
    <div className='login'>
        <form onSubmit={onLogin} className='login-container'>
            <div className="login-title">
                <h2>{currState}</h2>
                <img onClick={()=>setShowLogin(false)}src={assets.cross_icon} alt=""/>
            </div>
            <div className="login-inputs">
                {currState==="Login"?<></>:<input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your Name' required/>}  
                <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your Email'required/>
                <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password'required/>
            </div>
            <button type='submit'>{currState==="Sign Up"?"Sign Up":"Login"}</button>
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