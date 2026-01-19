import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaCalendar, FaImage, FaFile, FaUsers, FaBullhorn } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        events: 0,
        sliders: 0,
        pages: 0,
        galleries: 0,
        announcements: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            const [events, sliders, pages, galleries, announcements] = await Promise.all([
                axios.get('/api/events/all', config),
                axios.get('/api/sliders/all', config),
                axios.get('/api/pages/all', config),
                axios.get('/api/gallery/all', config),
                axios.get('/api/announcements/all', config)
            ]);

            setStats({
                events: events.data.length,
                sliders: sliders.data.length,
                pages: pages.data.length,
                galleries: galleries.data.length,
                announcements: announcements.data.length
            });
        } catch (error) {
            console.error('İstatistikler yüklenemedi:', error);
            console.error('Hata detayı:', error.response?.data || error.message);
            console.error('Token:', localStorage.getItem('token') ? 'Mevcut' : 'Yok');
        }
    };

    const cards = [
        { title: 'Etkinlikler', count: stats.events, icon: FaCalendar, link: '/admin/etkinlikler', color: '#3b82f6' },
        { title: 'Slider', count: stats.sliders, icon: FaImage, link: '/admin/slider', color: '#10b981' },
        { title: 'Sayfalar', count: stats.pages, icon: FaFile, link: '/admin/sayfalar', color: '#f59e0b' },
        { title: 'Galeri', count: stats.galleries, icon: FaImage, link: '/admin/galeri', color: '#8b5cf6' },
        { title: 'Duyurular', count: stats.announcements, icon: FaBullhorn, link: '/admin/duyurular', color: '#ef4444' }
    ];

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <p>Hoş geldiniz! Sistemi buradan yönetebilirsiniz.</p>
            </div>

            <div className="dashboard-grid">
                {cards.map((card, index) => (
                    <Link key={index} to={card.link} className="stat-card" style={{ borderLeftColor: card.color }}>
                        <div className="stat-icon" style={{ background: card.color }}>
                            <card.icon />
                        </div>
                        <div className="stat-content">
                            <h3>{card.title}</h3>
                            <p className="stat-number">{card.count}</p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="quick-actions">
                <h2>Hızlı İşlemler</h2>
                <div className="actions-grid">
                    <Link to="/admin/etkinlikler" className="action-btn">
                        <FaCalendar />
                        <span>Yeni Etkinlik Ekle</span>
                    </Link>
                    <Link to="/admin/slider" className="action-btn">
                        <FaImage />
                        <span>Slider Yönet</span>
                    </Link>
                    <Link to="/admin/sayfalar" className="action-btn">
                        <FaFile />
                        <span>Sayfa Oluştur</span>
                    </Link>
                    <Link to="/admin/menu" className="action-btn">
                        <FaUsers />
                        <span>Menü Düzenle</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
