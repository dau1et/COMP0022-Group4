import React, { useEffect, useState } from 'react';
import '../styles/Nav.css';
import logo from '../assets/ucldb.png';

function Nav() {
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
            className='nav_logo' 
            src={logo} 
            alt="UCLDB"
        />
        <div className='library'>
        <p>Home</p>
        <p>Library</p>
        </div>
    </div>
  )
}

export default Nav