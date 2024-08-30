import React, { useContext, useEffect, useState } from 'react'
import "./Navbar.css"
import { assets } from '../../assets/assets'
import profile_icon from '../../assets/profile_icon.jpg'
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({setShowLogin}) => {

    const{getTotalCartAmount,token,setToken}=useContext(StoreContext);
    const navigate = useNavigate(); 
    const [userImage, setUserImage] = useState(null);
    const[menu,setMenu]=useState("menu");
    
    useEffect(() => {
        const storedImage = localStorage.getItem('userImage');
        if (storedImage) {
          setUserImage(`http://localhost:4000/${storedImage}`); // Set userImage state to the stored image path
        }else {
          setUserImage(assets.profile_icon); // Set default profile icon if no image path found
        }
      }, [token]);
      
      const handleImageError = () => {
        setUserImage(null); // Set userImage state to null on image load error
      };

    const logout = () =>{
        localStorage.removeItem("token");
        localStorage.removeItem("userImage");
        setToken("");
        setUserImage(null); // Clear userImage state on logout
        navigate("/")
    }
  return (
    <div className='Navbar'>
        <Link to='/'><img src={assets.logo} alt="" width={100} className="logo" /></Link>
        <ul className="navbar-menu">
            <Link to='/' onClick={()=>setMenu("home")} className={menu==="home"?"active":""}>home</Link>
            <a href='#Menu'onClick={()=>setMenu("menu")} className={menu==="menu"?"active":""}>menu</a>
            <a href='#app-download' onClick={()=>setMenu("mobile-app")} className={menu==="mobile-app"?"active":""}>mobile-app</a>
            <a href='#footer' onClick={()=>setMenu("contact-us")} className={menu==="contact-us"?"active":""}>contact us</a>
        </ul>
        <div className="navbar-right">
            <img src={assets.search_icon} alt="" />
            <div className="navbar-search-icon">
                <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
                <div className={getTotalCartAmount()===0?"":"dot"}></div>
            </div>
            {!token?(
              <button onClick={()=>setShowLogin(true)}>Sign In</button>)
            :(<div className='navbar-profile'>{userImage ? (
                <img src={userImage} alt='Profile Icon' className='profile' onError={handleImageError}/>
                ) : ( <img className='profile' src={assets.profile_icon} alt=''/>)}
                <ul className="navbar-profile-dropdown">
                    <li onClick={()=>navigate('/get-profile')}><img src={profile_icon} className='img' alt=""/><p>Profile</p></li>
                    <hr/>
                    <li onClick={()=>navigate('/myorders')}><img src={assets.bag_icon} alt=""/><p>Orders</p></li>
                    <hr/>
                    <li onClick={logout}><img src={assets.logout_icon} alt=""/><p>Logout</p></li>
                </ul>
            </div>)}   
        </div>
    </div>
  )
}

export default Navbar