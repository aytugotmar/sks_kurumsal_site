import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaBullhorn, FaCalendar, FaPaperclip, FaFilePdf, FaImage, FaDownload } from 'react-icons/fa';
import { format } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import './Events.css';
import './Announcements.css';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const { language } = useLanguage();
    const { t } = useTranslation();

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const response = await axios.get('/api/announcements');
            setAnnouncements(response.data);
        } catch (error) {
            console.error('Duyurular yüklenemedi:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAnnouncements = filter === 'all'
        ? announcements
        : announcements.filter(a => a.type === filter);

    const getBadgeClass = (type) => {
        switch (type) {
            case 'önemli': return 'badge-important';
            case 'haber': return 'badge-news';
            default: return 'badge-announcement';
        }
    };

    const getTypeLabel = (type) => {
        const labels = {
            'duyuru': language === 'tr' ? 'Duyuru' : 'Announcement',
            'haber': language === 'tr' ? 'Haber' : 'News',
            'önemli': language === 'tr' ? 'Önemli' : 'Important'
        };
        return labels[type] || type;
    };

    return (
        <div className="page announcements-page">
            <div className="page-header">
                <div className="container">
                    <h1>{t('announcements.title')}</h1>
                    <p>{t('announcements.subtitle')}</p>
                </div>
            </div>

            <div className="container">
                <div className="filter-section">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        {t('announcements.all')}
                    </button>
                    <button
                        className={`filter-btn ${filter === 'duyuru' ? 'active' : ''}`}
                        onClick={() => setFilter('duyuru')}
                    >
                        {t('announcements.announcement')}
                    </button>
                    <button
                        className={`filter-btn ${filter === 'haber' ? 'active' : ''}`}
                        onClick={() => setFilter('haber')}
                    >
                        {t('announcements.news')}
                    </button>
                    <button
                        className={`filter-btn ${filter === 'önemli' ? 'active' : ''}`}
                        onClick={() => setFilter('önemli')}
                    >
                        {t('announcements.important')}
                    </button>
                </div>

                {loading ? (
                    <div className="loading">{t('announcements.loading')}</div>
                ) : filteredAnnouncements.length === 0 ? (
                    <div className="no-results">{t('announcements.noResults')}</div>
                ) : (
                    <div className="announcements-list">
                        {filteredAnnouncements.map((announcement) => (
                            <Link
                                to={`/duyuru/${announcement.id}`}
                                key={announcement.id}
                                className="announcement-card"
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <div className="announcement-header">
                                    <div className="announcement-icon">
                                        <FaBullhorn />
                                    </div>
                                    <div className="announcement-meta">
                                        <span className={`announcement-badge ${getBadgeClass(announcement.type)}`}>
                                            {getTypeLabel(announcement.type)}
                                        </span>
                                        <span className="announcement-date">
                                            <FaCalendar />
                                            {format(new Date(announcement.publishDate), 'd MMMM yyyy', {
                                                locale: language === 'tr' ? tr : enUS
                                            })}
                                        </span>
                                    </div>
                                </div>

                                <h2 className="announcement-title">{announcement.title}</h2>
                                <p className="announcement-content">
                                    {announcement.content.substring(0, 200)}...
                                </p>

                                {announcement.attachments && announcement.attachments.length > 0 && (
                                    <div className="announcement-attachments-preview">
                                        <FaPaperclip /> {announcement.attachments.length} {t('announcements.attachments')}
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Announcements;
