import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaCalendar, FaArrowLeft, FaPaperclip, FaFilePdf, FaImage, FaDownload } from 'react-icons/fa';
import { format } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import './EventDetail.css';

const AnnouncementDetail = () => {
    const { id } = useParams();
    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);
    const { language } = useLanguage();
    const { t } = useTranslation();

    useEffect(() => {
        fetchAnnouncement();
    }, [id]);

    const fetchAnnouncement = async () => {
        try {
            const response = await axios.get(`/api/announcements/${id}`);
            const data = response.data;

            // MySQL'den gelen attachments JSON string'i parse et
            if (data.attachments && typeof data.attachments === 'string') {
                try {
                    data.attachments = JSON.parse(data.attachments);
                } catch (e) {
                    console.error('Attachments parse hatası:', e);
                    data.attachments = [];
                }
            } else if (!data.attachments) {
                data.attachments = [];
            }

            setAnnouncement(data);
        } catch (error) {
            console.error('Duyuru yüklenemedi:', error);
        } finally {
            setLoading(false);
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

    const getBadgeClass = (type) => {
        switch (type) {
            case 'önemli': return 'badge-important';
            case 'haber': return 'badge-news';
            default: return 'badge-announcement';
        }
    };

    if (loading) {
        return <div className="loading">{t('announcements.loading')}</div>;
    }

    if (!announcement) {
        return (
            <div className="page">
                <div className="container">
                    <div className="error-message">
                        <h2>{language === 'tr' ? 'Duyuru Bulunamadı' : 'Announcement Not Found'}</h2>
                        <Link to="/duyurular" className="btn btn-primary">
                            {language === 'tr' ? 'Duyurulara Dön' : 'Back to Announcements'}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="event-detail-page">
            <div className="event-detail-header">
                <div className="container">
                    <Link to="/duyurular" className="back-link">
                        <FaArrowLeft /> {language === 'tr' ? 'Duyurulara Dön' : 'Back to Announcements'}
                    </Link>
                    <div className="event-detail-title-section">
                        <span className={`announcement-badge ${getBadgeClass(announcement.type)}`}>
                            {getTypeLabel(announcement.type)}
                        </span>
                        <h1>{announcement.title}</h1>
                        <div className="event-detail-meta">
                            <span>
                                <FaCalendar />
                                {format(new Date(announcement.publishDate), 'd MMMM yyyy', {
                                    locale: language === 'tr' ? tr : enUS
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="event-detail-content">
                    <div className="content-text" dangerouslySetInnerHTML={{ __html: announcement.content }} />

                    {announcement.attachments && announcement.attachments.length > 0 && (
                        <div className="announcement-attachments-section">
                            <h3>
                                <FaPaperclip /> {t('announcements.attachments')}
                            </h3>
                            <div className="attachments-grid">
                                {announcement.attachments.map((attachment, index) => (
                                    <a
                                        key={index}
                                        href={attachment.url}
                                        className="attachment-card"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                    >
                                        {attachment.type === 'pdf' ? (
                                            <FaFilePdf className="attachment-icon pdf" />
                                        ) : (
                                            <FaImage className="attachment-icon image" />
                                        )}
                                        <div className="attachment-info">
                                            <span className="attachment-name">{attachment.name}</span>
                                            <span className="attachment-type">
                                                {attachment.type === 'pdf' ? 'PDF Dosyası' : 'Resim'}
                                            </span>
                                        </div>
                                        <FaDownload className="download-icon" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnnouncementDetail;
