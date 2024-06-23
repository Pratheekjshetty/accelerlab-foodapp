import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo} alt="" width={100}/>
            <p>Welcome to Festly App, where we bring the best flavors from local restaurants right to your doorstep. Discover a world of delicious options and enjoy convenient 
                delivery with every order. Delivering delicious meals from your favorite local restaurants straight to your door. Our mission is to make food delivery quick, easy, and enjoyable.</p>
            <div className="footer-social-icons">
                <img src="{assets.facebook_icon}" alt="" />
                <img src="{assets.twitter_icon}" alt="" />
                <img src="{assets.linkedin_icon}" alt="" />
            </div>
        </div>
        <div className="footer-content-center">
            <h2>Company</h2>
            <ul>
                <li>Home</li>
                <li>About Us</li>
                <li>Delivery</li>
            </ul>
            <h2>Legal</h2>
            <ul>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Refund Policy</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>Contact Us</h2>
            <ul>
                <li>Phone:+9876543210</li>
                <li>Email:festlyapp@gmail.com</li>
                <li>Github:github.com/festlyapp</li>
            </ul>
            <h2>Follow Us</h2>
            <ul>
                <li>Facebook:facebook.com/festlyapp</li>
                <li>Instagram:instagram.com/festlyapp</li>
                <li>Twitter:twitter.com/festlyapp</li>
            </ul>
        </div>
        </div>
        <hr/>
        <p className='footer-copyright'> © Copright 2024 Festly.com - All Right Reserved.</p>
    </div>
  )
}
export default Footer