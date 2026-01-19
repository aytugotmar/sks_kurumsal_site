import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { useTranslation } from '../../hooks/useTranslation';
import './Footer.css';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-section">
                            <h3>YTÜ {t('footer.quickLinks').includes('Hızlı') ? 'Kültür Hizmetleri' : 'Cultural Services'}</h3>
                            <p>{t('footer.description')}</p>
                            <div className="social-links">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                    <FaFacebook />
                                </a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                                    <FaTwitter />
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                    <FaInstagram />
                                </a>
                                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                                    <FaYoutube />
                                </a>
                            </div>
                        </div>

                        <div className="footer-section">
                            <h3>{t('footer.quickLinks')}</h3>
                            <ul>
                                <li><Link to="/">{t('nav.home')}</Link></li>
                                <li><Link to="/hakkimizda">{t('nav.about')}</Link></li>
                                <li><Link to="/etkinlikler">{t('nav.events')}</Link></li>
                                <li><Link to="/galeri">{t('nav.gallery')}</Link></li>
                                <li><Link to="/iletisim">{t('nav.contact')}</Link></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h3>{t('footer.events')}</h3>
                            <ul>
                                <li><Link to="/etkinlikler?kategori=konser">{t('footer.concerts')}</Link></li>
                                <li><Link to="/etkinlikler?kategori=tiyatro">{t('footer.theater')}</Link></li>
                                <li><Link to="/etkinlikler?kategori=sergi">{t('footer.exhibitions')}</Link></li>
                                <li><Link to="/etkinlikler?kategori=atölye">{t('footer.workshops')}</Link></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h3>{t('footer.contactInfo')}</h3>
                            <ul className="contact-info">
                                <li>
                                    <FaMapMarkerAlt />
                                    <span>Yıldız Teknik Üniversitesi<br />Davutpaşa Kampüsü, İstanbul</span>
                                </li>
                                <li>
                                    <FaPhone />
                                    <span>+90 (212) 383 XXXX</span>
                                </li>
                                <li>
                                    <FaEnvelope />
                                    <span>kultur@yildiz.edu.tr</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} YTÜ {t('footer.quickLinks').includes('Hızlı') ? 'Kültür Hizmetleri Şube Müdürlüğü' : 'Cultural Services Department'}. {t('footer.rights')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
