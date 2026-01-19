import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import { FaCalendar, FaMapMarkerAlt, FaClock, FaUsers } from 'react-icons/fa';
import { useTranslation } from '../hooks/useTranslation';
import './Events.css';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const { t, language } = useTranslation();
    const dateLocale = language === 'tr' ? tr : enUS;

    const categories = [
        { value: 'all', label: t('events.all') },
        { value: 'konser', label: t('events.concert') },
        { value: 'tiyatro', label: t('events.theater') },
        { value: 'sergi', label: t('events.exhibition') },
        { value: 'söyleşi', label: t('events.seminar') },
        { value: 'atölye', label: t('events.workshop') },
        { value: 'diğer', label: t('events.other') }
    ];

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        if (selectedCategory === 'all') {
            setFilteredEvents(events);
        } else {
            setFilteredEvents(events.filter(event => event.category === selectedCategory));
        }
    }, [selectedCategory, events]);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('/api/events?active=true');
            setEvents(response.data);
        } catch (error) {
            console.error('Etkinlikler yüklenemedi:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="events-page">
            <div className="page-header">
                <div className="container">
                    <h1>{t('events.title')}</h1>
                    <p>{language === 'tr' ? 'Kültür ve sanat etkinliklerimizi keşfedin' : 'Discover our cultural and art events'}</p>
                </div>
            </div>

            <div className="container">
                <div className="filter-section">
                    <h3>{t('events.filterByCategory')}</h3>
                    <div className="category-filters">
                        {categories.map(cat => (
                            <button
                                key={cat.value}
                                className={`filter-btn ${selectedCategory === cat.value ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat.value)}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : filteredEvents.length > 0 ? (
                    <div className="events-list">
                        {filteredEvents.map(event => (
                            <Link to={`/etkinlik/${event.id}`} key={event.id} className="event-list-item card">
                                <div className="event-list-image">
                                    {event.image ? (
                                        <img src={event.image} alt={event.title} />
                                    ) : (
                                        <div className="event-placeholder">
                                            <span>{event.category}</span>
                                        </div>
                                    )}
                                    <span className="event-category-badge">{event.category}</span>
                                </div>
                                <div className="event-list-content">
                                    <h2>{event.title}</h2>
                                    <p className="event-description">
                                        {event.shortDescription || event.description?.substring(0, 200) + '...'}
                                    </p>
                                    <div className="event-meta-list">
                                        <div className="meta-item">
                                            <FaCalendar />
                                            <span>{format(new Date(event.date), 'd MMMM yyyy', { locale: dateLocale })}</span>
                                        </div>
                                        {event.time && (
                                            <div className="meta-item">
                                                <FaClock />
                                                <span>{event.time}</span>
                                            </div>
                                        )}
                                        {event.location && (
                                            <div className="meta-item">
                                                <FaMapMarkerAlt />
                                                <span>{event.location}</span>
                                            </div>
                                        )}
                                        {event.capacity && (
                                            <div className="meta-item">
                                                <FaUsers />
                                                <span>Kapasite: {event.capacity}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="no-events">
                        <p>Bu kategoride etkinlik bulunmamaktadır.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;
