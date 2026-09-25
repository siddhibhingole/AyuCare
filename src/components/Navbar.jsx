import React, { useState, useRef } from 'react';
import { navbarStyles } from '../assets/dummyStyles';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
import logo from '../assets/logo.png';

const STORAGE_KEY = "doctorToken_v1";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isDoctorLoggedIn, setIsDoctorLoggedIn] = useState(() => {
        try {
            return Boolean(localStorage.getItem(STORAGE_KEY));
        } catch {
            return false;
        }
    });
    
    const location = useLocation();
    const navRef = useRef(null);
    const clerk = useClerk();
    const navigate = useNavigate();

    const navItems = [
        { label: "Home", href: "/" },
        { label: "Doctors", href: "/doctors" },
        { label: "Services", href: "/services" },
        { label: "Appointments", href: "/appointments" },
        { label: "Contact", href: "/contact" },
    ];

    return (
        <>
            <div className={navbarStyles.navbarBorder}></div>
            <nav className={`${navbarStyles.navbarContainer} ${
                showNavbar ? navbarStyles.navbarVisible : navbarStyles.navbarHidden
                }`}
            >
                <div className={navbarStyles.contentWrapper}>
                    <div className={navbarStyles.flexContainer}>
                        {/* Logo with forced visible sizing */}
                        <Link to="/" className="flex items-center gap-2">
                            <div className="flex items-center justify-center">
                                <img 
                                    src={logo} 
                                    alt="AyuCare Logo" 
                                    className="h-10 w-auto object-contain block" 
                                />
                            </div>
                            <div className={navbarStyles.logoTextContainer}>
                                <h1 className={navbarStyles.logoTitle}>
                                    AyuCare
                                </h1>
                                <p className={navbarStyles.logoSubtitle}>
                                    HealthCare Solutions
                                </p>
                            </div> 
                        </Link>
                        
                        <div className={navbarStyles.desktopNav}>
                            <div className={navbarStyles.navItemsContainer}>
                                {navItems.map((item) => {
                                    const isActive = location.pathname === item.href;
                                    return (
                                        <Link key={item.label} to={item.href}
                                            className={`${navbarStyles.navItem} ${
                                                isActive ? navbarStyles.navItemActive : ""
                                            }`}
                                        >
                                            {item.label}
                                        </Link>
                                    );
                                })} {/* <-- Fixed: Added closing parenthesis here */}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;