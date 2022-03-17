import React, { useEffect, useState } from 'react';
import '../styles/Nav.css';
import logo from '../assets/uclflix.png';

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
            alt="UCLFLIX"
        />

        <img 
            className='nav_bell' 
            src='https://www.citypng.com/public/uploads/small/116389850303ufdx83go2mmx7wz9iodbnh27afxknnf9bofncviac8z2n9w4rwksenu7mwokevjmznxdga1dt7xhiquhtxbvjjjdrqb3pt5rhuk.png' 
            alt='Notifications' 
        />
    </div>
  )
}

export default Nav