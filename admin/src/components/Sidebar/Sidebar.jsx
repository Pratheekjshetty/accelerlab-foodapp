import React from 'react'
import './Sidebar.css'
import add_icon from '../../assets/add_icon.png'
import order_icon from '../../assets/order_icon.png'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/add', icon: add_icon, label: 'Add Items' },
  { to: '/list', icon: order_icon, label: 'List Items' },
  { to: '/orders', icon: order_icon, label: 'Orders' },
//   { to: '/settings', icon: settings_icon, label: 'Settings' },
]

const Sidebar = () => {
  return (
    <div className='sidebar'>
        <div className="sidebar-options">
            {navItems.map((item, index) => (
                <NavLink 
                   to={item.to} 
                   key={index} 
                   className={({ isActive }) =>`sidebar-option ${isActive ? 'active' : ''}`}>
                    <img src={item.icon} alt="" />
                    <p className='hidden lg:block font-medium'>{item.label}</p>
                </NavLink>
            ))}
         </div>
    </div>
  )
}

export default Sidebar