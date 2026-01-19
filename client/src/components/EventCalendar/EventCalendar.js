import React, { useState, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import { format, isSameDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import './EventCalendar.css';

const EventCalendar = () => {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [selectedDateEvents, setSelectedDateEvents] = useState([]);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('/api/events?active=true');
            setEvents(response.data);
        } catch (error) {
            console.error('Etkinlikler yüklenemedi:', error);
        }
    };

    const filterEventsByDate = useCallback((selectedDate) => {
        const filtered = events.filter(event =>
            isSameDay(new Date(event.date), selectedDate)
        );
        setSelectedDateEvents(filtered);
    }, [events]);

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        filterEventsByDate(date);
    }, [date, filterEventsByDate]); const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const hasEvent = events.some(event =>
                isSameDay(new Date(event.date), date)
            );
            return hasEvent ? <div className="event-dot"></div> : null;
        }
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const hasEvent = events.some(event =>
                isSameDay(new Date(event.date), date)
            );
            return hasEvent ? 'has-event' : null;
        }
    };

    return (
        <section className="event-calendar-section section">
            <div className="container">
                <div className="section-header">
                    <h2>Etkinlik Takvimi</h2>
                    <p>Gelecek etkinliklerimizi keşfedin</p>
                </div>

                <div className="calendar-wrapper">
                    <div className="calendar-container">
                        <Calendar
                            onChange={setDate}
                            value={date}
                            locale="tr-TR"
                            tileContent={tileContent}
                            tileClassName={tileClassName}
                        />
                    </div>

                    <div className="calendar-events">
                        <h3>
                            {format(date, 'd MMMM yyyy', { locale: tr })} - Etkinlikler
                        </h3>
                        {selectedDateEvents.length > 0 ? (
                            <div className="events-list">
                                {selectedDateEvents.map(event => (
                                    <Link
                                        to={`/etkinlik/${event.id}`}
                                        key={event.id}
                                        className="event-item"
                                    >
                                        <div className="event-image">
                                            {event.image ? (
                                                <img src={event.image} alt={event.title} />
                                            ) : (
                                                <div className="event-placeholder">
                                                    <span>{event.category}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="event-info">
                                            <h4>{event.title}</h4>
                                            {event.time && (
                                                <p className="event-time">
                                                    <strong>Saat:</strong> {event.time}
                                                </p>
                                            )}
                                            {event.location && (
                                                <p className="event-location">
                                                    <strong>Yer:</strong> {event.location}
                                                </p>
                                            )}
                                            <span className="event-category">{event.category}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="no-events">
                                <p>Bu tarihte etkinlik bulunmamaktadır.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EventCalendar;
