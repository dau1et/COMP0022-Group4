import React, { useEffect, useState } from 'react';
import '../styles/Nav.css';
import logo from '../assets/ucldb.png';
import { useNavigate } from 'react-router-dom';

function Nav() {
    const navigate = useNavigate();
    const [show, handleShow] = useState(false);

    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 0) {
                handleShow(true);
            } else handleShow(false);
        });
        return () => {
            window.removeEventListener("scroll");
        };
    }, []);

  return (
    <div className={`nav ${show && 'nav_black'}`}>
        <img 
            className='nav_logo cursor-pointer' 
            src={logo} 
            alt="UCLDB"
            onClick={() => navigate('/', { replace: true })}
        />
        <div className='text'>
        <a className = "mr-[10px] cursor-pointer font-bold mt-3" href="/" >Home</a>
        <a className = "mr-[10px] cursor-pointer font-bold mt-3" href="/library" >Library</a>

        </div>
    </div>
  )
}

export default Nav