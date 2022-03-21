import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ucldb } from '../constants';

function Nav() {
    const navigate = useNavigate();
    const [show, handleShow] = useState(false);

    function handleNavbarVisiblity() {
        if (window.scrollY > 0) {
            handleShow(true);
        } else handleShow(false);
    }

    useEffect(() => {
        window.addEventListener("scroll", handleNavbarVisiblity);
        return () => {
            window.removeEventListener("scroll", handleNavbarVisiblity);
        };
    }, []);

  return (
    <div className={`fixed flex top-0 w-full h-[72px] z-50 p-3 transition-all duration-500 ease-in ${show && 'bg-[#111]'}`}>
        <img 
            className='object-contain mx-2 h-12 cursor-pointer' 
            src={ucldb} 
            alt="UCLDB"
            onClick={() => navigate('/', { replace: true })}
        />
        <div className='h-full mx-16 text-white font-bold'>
            <button className={`inline-flex items-center justify-center p-0.5 transition-all duration-100 ease-in rounded-lg mr-8 group ${show && 'bg-gradient-to-br from-stone-600 to-[#0000ff] group-hover:from-[#0000ff] group-hover:to-stone-600'}`}>
                <a href="/" className={`cursor-pointer font-bold text-lg px-5 py-2 transition-all duration-100 ease-in ${show && 'bg-[#111]'} rounded-md`}>
                    Home
                </a>
            </button>
            <button className={`inline-flex items-center justify-center p-0.5 transition-all duration-100 ease-in rounded-lg group ${show && 'bg-gradient-to-br from-stone-600 to-[#0000ff] group-hover:from-[#0000ff] group-hover:to-stone-600'}`}>
                <a href="/library" className={`cursor-pointer font-bold text-lg px-5 py-2 transition-all duration-100 ease-in ${show && 'bg-[#111]'} rounded-md`}>
                    Library
                </a>
            </button>
        </div>
    </div>
  )
}

export default Nav;