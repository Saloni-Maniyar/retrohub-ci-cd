import logoRetro from '../assets/logoNew.png';
// import { useEffect, useState } from 'react';
import '../styles/Navbar.css';

import { useContext } from 'react';
import {AuthContext} from '../context/AuthContext.jsx'

export default function Navbar() {
  const {isLoggedIn,logout}=useContext(AuthContext);
  
  
  return(
    
    <div className="Navbar">
      {
        isLoggedIn ?
        <>
           <img src={logoRetro} alt="RetroHub"></img>
          <ul>
            <li><a href='/'>Home</a></li>
            <li><a href='/create-team'>Create Team</a></li>
            <li><a href='/teams'>My Teams</a></li>
            <li><a href='/contact-us'>Contact us</a></li>
            <li><a href='/profile'>Profile</a></li>
            <li><button onClick={logout}>Log out</button></li>
          </ul>
        </>
        :
        <>
           <img src={logoRetro} alt="RetroHub"></img>
          <ul>
            <li><a href='/'>Home</a></li>
            <li><a href='/about'>About</a></li>
            <li><a href='/contact-us'>Contact us</a></li>
            <li><a href='/Signup'><button>Get Started</button></a></li>
          </ul>
        </>
       
      }
      
    </div>
  );
    
}