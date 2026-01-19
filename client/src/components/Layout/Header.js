import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaMoon, FaSun, FaGlobe } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';
import axios from 'axios';
import './Header.css';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const [scrolled, setScrolled] = useState(false);
    const { isAuthenticated, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { language, toggleLanguage } = useLanguage();
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        fetchMenu();

        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Mobil menü açıkken body scroll'u engelle
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [menuOpen]);

    const fetchMenu = async () => {
        try {
            const response = await axios.get('/api/menu');
            setMenuItems(response.data);
        } catch (error) {
            console.error('Menü yüklenemedi:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <div className="header-content">
                    {/* YTÜ Logo */}
                    <Link to="/" className="logo">
                        <div className="logo-icon">
                            <img
                                src="/ytu-logo.png"
                                alt="YTÜ Logo"
                                className="ytu-logo-img"
                                onError={(e) => {
                                    // Logo yüklenemezse SVG fallback göster
                                    e.target.style.display = 'none';
                                    e.target.nextElementSibling.style.display = 'block';
                                }}
                            />
                            <svg viewBox="0 0 50 50" className="ytu-logo-fallback" style={{ display: 'none' }}>
                                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="currentColor" fontSize="24" fontWeight="bold">YTÜ</text>
                            </svg>
                        </div>
                        <div className="logo-text">
                            <h1>SKS Daire Başkanlığı</h1>
                            <p>{language === 'tr' ? 'Kültür Hizmetleri' : 'Cultural Services'}</p>
                        </div>
                    </Link>

                    <nav className={`nav ${menuOpen ? 'open' : ''}`}>
                        <button className="mobile-menu-close" onClick={() => setMenuOpen(false)}>
                            <FaTimes />
                        </button>
                        <Link to="/" onClick={() => setMenuOpen(false)}>{t('nav.home')}</Link>
                        <Link to="/hakkimizda" onClick={() => setMenuOpen(false)}>{t('nav.about')}</Link>
                        <Link to="/etkinlikler" onClick={() => setMenuOpen(false)}>{t('nav.events')}</Link>
                        <Link to="/duyurular" onClick={() => setMenuOpen(false)}>{t('nav.announcements')}</Link>
                        <Link to="/galeri" onClick={() => setMenuOpen(false)}>{t('nav.gallery')}</Link>
                        <Link to="/iletisim" onClick={() => setMenuOpen(false)}>{t('nav.contact')}</Link>

                        {menuItems.map((item) => (
                            <div key={item.id} className="nav-item">
                                <Link
                                    to={item.url || '#'}
                                    onClick={() => setMenuOpen(false)}
                                    target={item.isExternal ? '_blank' : '_self'}
                                    rel={item.isExternal ? 'noopener noreferrer' : ''}
                                >
                                    {item.title}
                                </Link>
                                {item.children && item.children.length > 0 && (
                                    <div className="dropdown">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.id}
                                                to={child.url || '#'}
                                                onClick={() => setMenuOpen(false)}
                                                target={child.isExternal ? '_blank' : '_self'}
                                                rel={child.isExternal ? 'noopener noreferrer' : ''}
                                            >
                                                {child.title}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {isAuthenticated && (
                            <div className="admin-menu">
                                <Link to="/admin" className="btn-admin" onClick={() => setMenuOpen(false)}>
                                    <FaUser /> {t('nav.admin')}
                                </Link>
                                <button onClick={handleLogout} className="btn-logout">
                                    <FaSignOutAlt /> {t('nav.logout')}
                                </button>
                            </div>
                        )}
                    </nav>

                    <div className="header-controls">
                        {/* Dark Mode Toggle */}
                        <button
                            className="theme-toggle"
                            onClick={toggleTheme}
                            aria-label={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        >
                            {theme === 'dark' ? <FaSun /> : <FaMoon />}
                        </button>

                        {/* Language Toggle */}
                        <button
                            className="language-toggle"
                            onClick={toggleLanguage}
                            aria-label="Change Language"
                        >
                            <FaGlobe />
                            <span>{language === 'tr' ? 'EN' : 'TR'}</span>
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                            <FaBars />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu overlay */}
            {menuOpen && <div className="menu-overlay active" onClick={() => setMenuOpen(false)}></div>}
        </header>
    );
};

export default Header;
