import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../Context/appContext';
import { Switch, Route, Link, useLocation, useHistory } from "react-router-dom";
// import CreateUser from "./CreateUser";

const Sidebar = () => {
    const context = useContext(AppContext);
    const { user, setUser } = context;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const history = useHistory();
    
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        history.push("/admin");
        closeMobileMenu();
    };

    // Function to check if a link is active
    const isActiveLink = (path) => {
        return location.pathname === path;
    };

    // Get link classes based on active state
    const getLinkClasses = (path, isMobile = false) => {
        const baseClasses = isMobile 
            ? "nav-link p-2 border-bottom border-secondary" 
            : "nav-link d-flex align-items-center";
        
        if (isActiveLink(path)) {
            return `${baseClasses} bg-white text-primary fw-bold`;
        }
        return `${baseClasses} text-white`;
    };
    
    return (
        <div>
            {/* Mobile Navbar - Only visible on mobile */}
            <nav className="navbar navbar-expand-lg d-lg-none" style={{ backgroundColor: "#000a62" }}>
                <div className="container-fluid">
                    <Link className="navbar-brand text-white" to="/admin-dashboard">
                        {/* {user.email === "admin@me-enterprises.com" ? "Admin Panel": "Dashboard"} */}
                        Dashboard
                    </Link>
                    <button 
                        className="navbar-toggler border-0 p-0" 
                        type="button" 
                        onClick={toggleMobileMenu}
                        aria-controls="mobileNavbar" 
                        aria-expanded={isMobileMenuOpen}
                        aria-label="Toggle navigation"
                        style={{ boxShadow: 'none' }}
                    >
                        <span className="navbar-toggler-icon" style={{ 
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 1%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e")` 
                        }}></span>
                    </button>
                </div>
                
                {/* Mobile Menu Collapse */}
                <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`} id="mobileNavbar">
                    <div className="navbar-nav w-100 px-3 pb-3">
                        <Link 
                            className={getLinkClasses("/admin-dashboard/create-rentals", true)}
                            to="/admin-dashboard/create-rentals"
                            onClick={closeMobileMenu}
                            style={isActiveLink("/admin-dashboard/create-rentals") ? { borderRadius: "0.375rem", margin: "0.125rem 0" } : {}}
                        >
                            Basic Settings
                        </Link>
                        <Link 
                            className={getLinkClasses("/admin-dashboard/view-rentals", true)}
                            to="/admin-dashboard/view-rentals"
                            onClick={closeMobileMenu}
                            style={isActiveLink("/admin-dashboard/view-rentals") ? { borderRadius: "0.375rem", margin: "0.125rem 0" } : {}}
                        >
                            Pages
                        </Link>
                        {/* {user.email === "admin@me-enterprises.com" && ( */}
                            {/* <div>
                                <Link 
                                    className={getLinkClasses("/admin-dashboard/create-user", true)}
                                    to="/admin-dashboard/create-user"
                                    onClick={closeMobileMenu}
                                    style={isActiveLink("/admin-dashboard/create-user") ? { borderRadius: "0.375rem", margin: "0.125rem 0" } : {}}
                                >
                                    Create User
                                </Link>
                                <Link 
                                    className={getLinkClasses("/admin-dashboard/view-users", true)}
                                    to="/admin-dashboard/view-users"
                                    onClick={closeMobileMenu}
                                    style={isActiveLink("/admin-dashboard/view-users") ? { borderRadius: "0.375rem", margin: "0.125rem 0" } : {}}
                                >
                                    View All Users
                                </Link>
                            </div> */}
                        {/* )} */}
                        
                        {/* Mobile Admin Section */}
                        <div className="mt-3 pt-3 border-top border-secondary">
                            <div className="d-flex align-items-center mb-2">
                                <img
                                    src="https://png.pngtree.com/png-vector/20220529/ourmid/pngtree-black-user-icon-flat-and-simple-vector-people-avatar-icon-vector-png-image_46750236.jpg"
                                    alt="profile"
                                    width="24"
                                    height="24"
                                    className="rounded-circle me-2"
                                />
                                <span className="text-white">
                                    {/* {user.email === "admin@me-enterprises.com" ? "Admin Panel": "Dashboard"} */}
                                    Admin Panel
                                </span>
                            </div>
                            <button
                                className="btn btn-outline-danger btn-sm w-100"
                                onClick={()=>handleLogout()}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Desktop Sidebar - Only visible on desktop */}
            <div className="d-none d-lg-block" style={{ backgroundColor: "#000a62", color: "white", minHeight: "100vh", position: "relative" }}>
                <div className="d-flex flex-column h-100 px-3 pt-2" style={{ minHeight: "100vh" }}>
                    <a 
                        href="/admin-dashboard" 
                        className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none"
                    >
                        <span className="fs-5">
                            {/* {user.email === "admin@me-enterprises.com" ? "Admin Panel": "Dashboard"} */}
                            Dashboard
                            </span>
                    </a>
                    
                    {/* Navigation Menu - Flexible grow area */}
                    <div className="flex-grow-1">
                        <ul className="nav nav-pills flex-column mb-auto">
                            <li className="nav-item mb-1">
                                <Link 
                                    className={getLinkClasses("/admin-dashboard/basic-settings")}
                                    to="/admin-dashboard/basic-settings"
                                    style={isActiveLink("/admin-dashboard/basic-settings") ? { borderRadius: "0.375rem" } : {}}
                                >
                                    <span>Basic Settings</span>
                                </Link>
                            </li>
                            <li className="nav-item mb-1">
                                <Link 
                                    className={getLinkClasses("/admin-dashboard/pages")}
                                    to="/admin-dashboard/pages"
                                    style={isActiveLink("/admin-dashboard/pages") ? { borderRadius: "0.375rem" } : {}}
                                >
                                    <span>Pages</span>
                                </Link>
                            </li>
                            {/* {user.email === "admin@me-enterprises.com" && ( */}
                                {/* <div>
                                    <li className="nav-item mb-1">
                                        <Link 
                                            className={getLinkClasses("/admin-dashboard/create-user")}
                                            to="/admin-dashboard/create-user"
                                            style={isActiveLink("/admin-dashboard/create-user") ? { borderRadius: "0.375rem" } : {}}
                                        >
                                            <span>Create User</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item mb-1">
                                        <Link 
                                            className={getLinkClasses("/admin-dashboard/view-users")}
                                            to="/admin-dashboard/view-users"
                                            style={isActiveLink("/admin-dashboard/view-users") ? { borderRadius: "0.375rem" } : {}}
                                        >
                                            <span>View All Users</span>
                                        </Link>
                                    </li>
                                </div> */}
                            {/* )} */}
                        </ul>
                    </div>
                    
                    {/* Admin Section - Sticky at bottom */}
                    <div className="mt-auto">
                        <hr className="text-white" />
                        <div className="dropdown pb-4">
                            <a 
                                href="#" 
                                className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" 
                                id="dropdownUser1" 
                                data-bs-toggle="dropdown" 
                                aria-expanded="false"
                            >
                                <div className="position-relative me-2">
                                    <img
                                        src="https://png.pngtree.com/png-vector/20220529/ourmid/pngtree-black-user-icon-flat-and-simple-vector-people-avatar-icon-vector-png-image_46750236.jpg"
                                        alt="profile"
                                        width="30"
                                        height="30"
                                        className="rounded-circle"
                                    />
                                </div>
                                <span>
                                    {/* {user.email === "admin@me-enterprises.com" ? "Admin": user.firstName} */}
                                    Admin
                                    </span>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;