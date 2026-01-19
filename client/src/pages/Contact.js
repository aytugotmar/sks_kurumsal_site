import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import { useTranslation } from '../hooks/useTranslation';
import './Contact.css';

const Contact = () => {
    const { t } = useTranslation();

    return (
        <div className="contact-page">
            <div className="page-header">
                <div className="container">
                    <h1>{t('contact.title')}</h1>
                    <p>{t('contact.getInTouch')}</p>
                </div>
            </div>

            <div className="container">
                <div className="contact-grid">
                    <div className="contact-info">
                        <h2>{t('footer.contactInfo')}</h2>
                        <p>{t('contact.getInTouch')}</p>

                        <div className="contact-items">
                            <div className="contact-item">
                                <div className="contact-icon">
                                    <FaMapMarkerAlt />
                                </div>
                                <div>
                                    <h3>{t('contact.address')}</h3>
                                    <p>
                                        Yıldız Teknik Üniversitesi<br />
                                        Davutpaşa Kampüsü<br />
                                        Esenler, İstanbul
                                    </p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="contact-icon">
                                    <FaPhone />
                                </div>
                                <div>
                                    <h3>Telefon</h3>
                                    <p>+90 (212) 383 XXXX</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="contact-icon">
                                    <FaEnvelope />
                                </div>
                                <div>
                                    <h3>E-posta</h3>
                                    <p>kultur@yildiz.edu.tr</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="contact-icon">
                                    <FaClock />
                                </div>
                                <div>
                                    <h3>Çalışma Saatleri</h3>
                                    <p>
                                        Pazartesi - Cuma<br />
                                        09:00 - 17:00
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="contact-map">
                        <iframe
                            title="YTÜ Harita"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.2779781748!2d28.89099931539832!3d41.04634197929591!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caba65cf6fb58b%3A0x3e862de6dc3b7eb!2sY%C4%B1ld%C4%B1z%20Teknik%20%C3%9Cniversitesi!5e0!3m2!1str!2str!4v1234567890"
                            width="100%"
                            height="100%"
                            style={{ border: 0, borderRadius: '12px' }}
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
