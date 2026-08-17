/* 
author: Saul Ramirez Barragan
course: COMP229 - Web Application Development
Date: June 02
Week2 Lab1
*/
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../src/auth';
import Logo from '../src/assets/Logo-Saul.png';

export default function Layout({ children }) {
    const { user, signOut } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

    return (
        <>
            <header className="site-header">
                <div className="header-inner">
                    <Link to="/" className="brand">
                        <img src={Logo} alt="Saul Ramirez logo" />
                        <span className="brand-text">Saul Ramirez</span>
                    </Link>
                    <nav className="site-nav">
                        <Link to="/" className={isActive('/')}>Home</Link>
                        <Link to="/about" className={isActive('/about')}>About</Link>
                        <Link to="/education" className={isActive('/education')}>Education</Link>
                        <Link to="/project" className={isActive('/project')}>Projects</Link>
                        <Link to="/services" className={isActive('/services')}>Services</Link>
                        <Link to="/contact" className={isActive('/contact')}>Contact</Link>
                        <span className="nav-divider" />
                        {user ? (
                            <>
                                {user.role === 'admin' && <Link to="/admin" className={isActive('/admin')}>Dashboard</Link>}
                                <button className="link-button" onClick={signOut}>Sign out</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className={isActive('/login')}>Sign in</Link>
                                <Link to="/signup" className={isActive('/signup')}>Sign up</Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>
            {children}
            <footer className="site-footer">
                &copy; {new Date().getFullYear()} Saul Ramirez Barragan. All rights reserved.
            </footer>
        </>
    );
}
