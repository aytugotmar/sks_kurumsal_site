import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { FaCalendar, FaMapMarkerAlt, FaClock, FaUsers, FaArrowLeft } from 'react-icons/fa';
import './EventDetail.css';

const EventDetail = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchEvent = useCallback(async () => {
        try {
            const response = await axios.get(`/api/events/${id}`);
            setEvent(response.data);
        } catch (error) {
            console.error('Etkinlik yüklenemedi:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchEvent();
    }, [fetchEvent]); if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>
                <h2>Etkinlik bulunamadı</h2>
                <Link to="/etkinlikler" className="btn btn-primary">
                    Etkinliklere Dön
                </Link>
            </div>
        );
    }

    return (
        <div className="event-detail-page">
            <div className="event-hero">
                {event.image ? (
                    <img src={event.image} alt={event.title} />
                ) : (
                    <div className="event-hero-placeholder">
                        <span>{event.category}</span>
                    </div>
                )}
                <div className="event-hero-overlay" />
            </div>

            <div className="container">
                <Link to="/etkinlikler" className="back-link">
                    <FaArrowLeft /> Etkinliklere Dön
                </Link>

                <div className="event-detail-content">
                    <div className="event-main">
                        <span className="event-category-tag">{event.category}</span>
                        <h1>{event.title}</h1>

                        <div className="event-info-grid">
                            <div className="info-item">
                                <FaCalendar />
                                <div>
                                    <strong>Tarih</strong>
                                    <p>{format(new Date(event.date), 'd MMMM yyyy', { locale: tr })}</p>
                                </div>
                            </div>

                            {event.time && (
                                <div className="info-item">
                                    <FaClock />
                                    <div>
                                        <strong>Saat</strong>
                                        <p>{event.time}</p>
                                    </div>
                                </div>
                            )}

                            {event.location && (
                                <div className="info-item">
                                    <FaMapMarkerAlt />
                                    <div>
                                        <strong>Konum</strong>
                                        <p>{event.location}</p>
                                    </div>
                                </div>
                            )}

                            {event.capacity && (
                                <div className="info-item">
                                    <FaUsers />
                                    <div>
                                        <strong>Kapasite</strong>
                                        <p>{event.capacity} kişi</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="event-description">
                            <h2>Etkinlik Hakkında</h2>
                            <div dangerouslySetInnerHTML={{ __html: event.description }} />
                        </div>

                        {event.registrationRequired && (
                            <div className="registration-info">
                                <h3>Kayıt Bilgileri</h3>
                                <p>Bu etkinlik için kayıt gereklidir. Lütfen iletişim bilgilerimizden bizimle iletişime geçin.</p>
                                <Link to="/iletisim" className="btn btn-primary">
                                    İletişime Geç
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="event-sidebar">
                        <div className="sidebar-card">
                            <h3>Etkinlik Bilgileri</h3>
                            <ul>
                                <li>
                                    <strong>Kategori:</strong> {event.category}
                                </li>
                                <li>
                                    <strong>Tarih:</strong> {format(new Date(event.date), 'd MMMM yyyy', { locale: tr })}
                                </li>
                                {event.time && (
                                    <li>
                                        <strong>Saat:</strong> {event.time}
                                    </li>
                                )}
                                {event.location && (
                                    <li>
                                        <strong>Konum:</strong> {event.location}
                                    </li>
                                )}
                                {event.capacity && (
                                    <li>
                                        <strong>Kapasite:</strong> {event.capacity} kişi
                                    </li>
                                )}
                                {event.registrationRequired && (
                                    <li>
                                        <strong>Kayıt:</strong> Gerekli
                                    </li>
                                )}
                            </ul>
                        </div>

                        <div className="sidebar-card">
                            <h3>Paylaş</h3>
                            <div className="share-buttons">
                                <button className="share-btn facebook">Facebook</button>
                                <button className="share-btn twitter">Twitter</button>
                                <button className="share-btn whatsapp">WhatsApp</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
