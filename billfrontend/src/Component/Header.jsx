import React from 'react'
import { useState } from 'react';
import './Nav_footer.css';
import Logo from '../logo.png';
import { Link } from 'react-router-dom';
const Header = () => {

    const [showMedia, setMedia] = useState(false)
    return (
        <div>

            <div className='navigation'>
                <div className='nav-bill'>
                    <div className='logo'>
                        <img src={Logo} alt="logo" />
                    </div>
                    
                   
                    <div className='sub'>
                    <Link  to='/'> <button className='sub-btn'>Bill Generated </button></Link >
                       
                        <Link  to='/all-data'> <button className='sub-btn'>All Generated Data</button></Link >
                    </div>


                </div>
            </div>
        </div>

    );
}

export default Header
