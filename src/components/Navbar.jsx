import React, { useState, useEffect, useRef } from 'react';
import { navbarStyles } from '../assets/dummyStyles';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { SignedOut, SignedIn, UserButton, useClerk } from '@clerk/clerk-react';
import logo from '../assets/logo.png';
import { User, Key, Menu, X, LayoutDashboard } from 'lucide-react';

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

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 80) {
                setShowNavbar(false);
                setIsOpen(false);
            } else {
                setShowNavbar(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <>
            <div className={navbarStyles.navbarBorder}></div>
            <nav 
                ref={navRef}
                className={`${navbarStyles.navbarContainer} ${
                    showNavbar ? navbarStyles.navbarVisible : navbarStyles.navbarHidden
                }`}
            >
                <div className={navbarStyles.contentWrapper}>
                    <div className={navbarStyles.flexContainer}>
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2">
                            <div className="flex items-center justify-center">
                                <img 
                                    src={logo} 
                                    alt="AyuCare Logo" 
                                    className="h-10 w-auto object-contain block" 
                                />
                            </div>
                            <div className={navbarStyles.logoTextContainer}>
                                <h1 className={navbarStyles.logoTitle}>AyuCare</h1>
                                <p className={navbarStyles.logoSubtitle}>HealthCare Solutions</p>
                            </div> 
                        </Link>
                        
                        {/* Desktop Navigation Links */}
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
                                })}
                            </div>
                        </div>

                        {/* Right Side Actions - Forced Horizontal Row */}
                        <div className={`${navbarStyles.rightSideContainer} flex items-center flex-row gap-3`}>
                            {isDoctorLoggedIn ? (
                                <Link to='/doctor-admin/dashboard' className={navbarStyles.doctorAdminButton}>
                                    <LayoutDashboard className={navbarStyles.doctorAdminIcon} />
                                    <span className={navbarStyles.doctorAdminText}>Dashboard</span>
                                </Link>
                            ) : (
                                <SignedOut>
                                    <Link to='/doctor-admin/login' className={navbarStyles.doctorAdminButton}>
                                        <User className={navbarStyles.doctorAdminIcon} />
                                        <span className={navbarStyles.doctorAdminText}>
                                            Doctor Admin
                                        </span>
                                    </Link>
                                </SignedOut>
                            )}

                            <SignedOut>
                                <button 
                                    onClick={() => clerk.openSignIn()}
                                    className={navbarStyles.loginButton}
                                >
                                    <Key className={navbarStyles.loginIcon} />
                                    Login
                                </button>
                            </SignedOut>

                            <SignedIn>
                                <UserButton afterSignOutUrl="/" />
                            </SignedIn>

                            {/* Mobile Menu Toggle */}
                            <button 
                                onClick={() => setIsOpen(!isOpen)}
                                className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 focus:outline-none"
                                aria-label="Toggle Menu"
                            >
                                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Drawer */}
                {isOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-2 shadow-lg">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link 
                                    key={item.label} 
                                    to={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                                        isActive ? 'text-primary bg-gray-50' : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </nav>
        </>
    );
};

export default Navbar;