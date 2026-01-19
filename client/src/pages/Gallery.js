import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from '../hooks/useTranslation';
import './Gallery.css';

const Gallery = () => {
    const [galleries, setGalleries] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t, language } = useTranslation(); useEffect(() => {
        fetchGalleries();
    }, []);

    const fetchGalleries = async () => {
        try {
            const response = await axios.get('/api/gallery');
            setGalleries(response.data);
        } catch (error) {
            console.error('Galeri yüklenemedi:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="gallery-page">
            <div className="page-header">
                <div className="container">
                    <h1>{t('gallery.title')}</h1>
                    <p>{language === 'tr' ? 'Etkinliklerimizden kareler' : 'Moments from our events'}</p>
                </div>
            </div>

            <div className="container">
                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : galleries.length > 0 ? (
                    <div className="gallery-grid">
                        {galleries.map(gallery => (
                            <div key={gallery.id} className="gallery-item card">
                                <div className="gallery-cover">
                                    {gallery.images && gallery.images[0] ? (
                                        <img src={gallery.images[0].url} alt={gallery.title} />
                                    ) : (
                                        <div className="gallery-placeholder">Galeri</div>
                                    )}
                                    <div className="gallery-overlay">
                                        <h3>{gallery.title}</h3>
                                        <p>{gallery.images?.length || 0} fotoğraf</p>
                                    </div>
                                </div>
                                {gallery.description && (
                                    <div className="gallery-content">
                                        <p>{gallery.description}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-data">
                        <p>Henüz galeri bulunmamaktadır.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gallery;
