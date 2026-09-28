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
                <div className={`${navbarStyles.contentWrapper} w-full px-4 sm:px-6 lg:px-8`}>
                    {/* Forced horizontal flex container bridging everything side-by-side */}
                    <div className={`${navbarStyles.flexContainer} flex flex-row items-center justify-between w-full`}>
                        
                        {/* Logo & Title */}
                        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
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
                        
                        {/* Desktop Navigation Links - Hidden on mobile, forced horizontal row on desktop */}
                        <div className={`hidden md:flex flex-row items-center gap-6 ${navbarStyles.desktopNav}`}>
                            <div className={`${navbarStyles.navItemsContainer} flex flex-row items-center gap-6`}>
                                {navItems.map((item) => {
                                    const isActive = location.pathname === item.href;
                                    return (
                                        <Link key={item.label} to={item.href}
                                            className={`${navbarStyles.navItem} text-sm font-medium transition-colors ${
                                                isActive ? `${navbarStyles.navItemActive} text-green-600 font-semibold` : "text-gray-700 hover:text-green-600"
                                            }`}
                                        >
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Side Actions - Forced Horizontal Row */}
                        <div className={`${navbarStyles.rightSideContainer} flex items-center flex-row gap-3 flex-shrink-0`}>
                            {isDoctorLoggedIn ? (
                                <Link to='/doctor-admin/dashboard' className={`${navbarStyles.doctorAdminButton} flex items-center gap-2`}>
                                    <LayoutDashboard className={navbarStyles.doctorAdminIcon} />
                                    <span className={navbarStyles.doctorAdminText}>Dashboard</span>
                                </Link>
                            ) : (
                                <SignedOut>
                                    <Link to='/doctor-admin/login' className={`${navbarStyles.doctorAdminButton} flex items-center gap-2`}>
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
                                    className={`${navbarStyles.loginButton} flex items-center gap-2`}
                                >
                                    <Key className={navbarStyles.loginIcon} />
                                    Login
                                </button>
                            </SignedOut>

                            <SignedIn>
                                <UserButton afterSignOutUrl="/" />
                            </SignedIn>

                            {/* Mobile Menu Toggle Button */}
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
                    <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-3 pb-4 space-y-2 shadow-lg">
                        {navItems.map((item, idx) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link 
                                    key={idx} 
                                    to={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                                        isActive ? 'text-green-600 bg-green-50' : 'text-gray-700 hover:bg-gray-50'
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