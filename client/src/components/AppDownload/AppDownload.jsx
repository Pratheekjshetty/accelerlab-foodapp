import React from 'react'
import './AppDownload.css'
import { assets } from '../../assets/assets'

const AppDownload = () => {
  return (
    <div className='app-download' id='app-download'>
        <p>For Better Experience Download <br/> Festly App</p>
        <p>Download our app using Playstore or Appstore</p>
        <div className="app-download-platforms">
            <img src={assets.play_store} alt="" />&nbsp;
            <img src={assets.app_store} alt="" />
        </div>
    </div>
  )
}

export default AppDownload