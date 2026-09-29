import React, { useState, useEffect, useRef } from 'react';
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
            <div className="h-1 bg-[#1f4e45]"></div>
            <nav 
                ref={navRef}
                className={`sticky top-0 z-50 bg-white transition-transform duration-300 shadow-sm ${
                    showNavbar ? 'translate-y-0' : '-translate-y-full'
                }`}
            >
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-row items-center justify-between w-full h-20">
                        
                        {/* Logo & Title - MediCare Branding */}
                        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                            <div className="flex items-center justify-center">
                                <img 
                                    src={logo} 
                                    alt="MediCare Logo" 
                                    className="h-10 w-auto object-contain block" 
                                />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 leading-tight">MediCare</h1>
                                <p className="text-xs text-gray-500">Healthcare Solutions</p>
                            </div> 
                        </Link>
                        
                        {/* Desktop Navigation Links */}
                        <div className="hidden md:flex flex-row items-center gap-6">
                            <div className="flex flex-row items-center gap-6">
                                {navItems.map((item) => {
                                    const isActive = location.pathname === item.href;
                                    return (
                                        <Link key={item.label} to={item.href}
                                            className={`text-sm font-medium transition-colors px-3 py-2 rounded-md ${
                                                isActive 
                                                    ? 'bg-[#1f4e45] text-white font-semibold' 
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center flex-row gap-3 flex-shrink-0">
                            {isDoctorLoggedIn ? (
                                <Link to='/doctor-admin/dashboard' className="hidden sm:flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50">
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span>Dashboard</span>
                                </Link>
                            ) : (
                                <SignedOut>
                                    <Link to='/doctor-admin/login' className="hidden sm:flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 text-center justify-center">
                                        <User className="w-4 h-4" />
                                        <span>Doctor Admin</span>
                                    </Link>
                                </SignedOut>
                            )}

                            <SignedOut>
                                <button 
                                    onClick={() => clerk.openSignIn()}
                                    className="hidden sm:flex items-center gap-2 px-5 py-2 bg-[#1f4e45] text-white rounded-full text-sm font-medium hover:bg-[#163a33] transition-colors"
                                >
                                    <Key className="w-4 h-4" />
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

                {/* Mobile Navigation Drawer with full layout match */}
                {isOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-3 pb-6 space-y-3 shadow-lg">
                        {navItems.map((item, idx) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link 
                                    key={idx} 
                                    to={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-4 py-3 rounded-md text-base font-medium ${
                                        isActive ? 'text-white bg-[#1f4e45]' : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                        
                        <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                            <Link 
                                to='/doctor-admin/login' 
                                onClick={() => setIsOpen(false)}
                                className="w-full py-3 text-center border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50"
                            >
                                Doctor Admin
                            </Link>
                            <button 
                                onClick={() => { setIsOpen(false); clerk.openSignIn(); }}
                                className="w-full py-3 bg-[#1f4e45] text-white rounded-full text-sm font-medium hover:bg-[#163a33]"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
};

export default Navbar;