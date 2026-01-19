import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from '../hooks/useTranslation';
import './About.css';

const About = () => {
    const { t } = useTranslation();
    const [pageContent, setPageContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAboutPage();
    }, []);

    const fetchAboutPage = async () => {
        try {
            const response = await axios.get('/api/pages/slug/hakkimizda');
            setPageContent(response.data);
        } catch (error) {
            console.error('About page not found, using default content');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="container">Yükleniyor...</div>;
    }

    // If custom page exists, show it
    if (pageContent) {
        return (
            <div className="about-page">
                <div className="page-header">
                    <div className="container">
                        <h1>{pageContent.title}</h1>
                    </div>
                </div>
                <div className="container">
                    <div className="about-content" dangerouslySetInnerHTML={{ __html: pageContent.content }} />
                </div>
            </div>
        );
    }

    // Default content if no custom page
    return (
        <div className="about-page">
            <div className="page-header">
                <div className="container">
                    <h1>{t('about.title')}</h1>
                    <p>YTÜ Kültür Hizmetleri Şube Müdürlüğü</p>
                </div>
            </div>

            <div className="container">
                <div className="about-content">
                    <section className="about-section">
                        <h2>Misyonumuz</h2>
                        <p>
                            Yıldız Teknik Üniversitesi Kültür Hizmetleri Şube Müdürlüğü olarak,
                            öğrencilerimize ve tüm üniversite camiasına zengin bir kültürel ve sanatsal
                            deneyim sunmak, sanat ve kültür alanında farkındalık yaratmak ve kampüs
                            yaşamını renklendirmek en temel görevimizdir.
                        </p>
                    </section>

                    <section className="about-section">
                        <h2>Vizyonumuz</h2>
                        <p>
                            Türkiye'nin önde gelen üniversitelerinden biri olan Yıldız Teknik Üniversitesi'nde,
                            kültür ve sanat etkinlikleri ile öğrencilerimizin sosyal ve kültürel gelişimlerine
                            katkıda bulunmak, ülkemizin sanat ve kültür hayatına değer katacak bireyler
                            yetiştirmek vizyonumuzun temelini oluşturmaktadır.
                        </p>
                    </section>

                    <section className="about-section">
                        <h2>Faaliyetlerimiz</h2>
                        <div className="activities-grid">
                            <div className="activity-card">
                                <h3>Konserler</h3>
                                <p>Klasik müzikten popu, caza kadar geniş bir yelpazede konserler düzenliyoruz.</p>
                            </div>
                            <div className="activity-card">
                                <h3>Tiyatro</h3>
                                <p>Yerli ve yabancı oyunların sahnelenmesi ile tiyatro severleri buluşturuyoruz.</p>
                            </div>
                            <div className="activity-card">
                                <h3>Sergiler</h3>
                                <p>Resim, fotoğraf ve heykel sergiler ile sanatçıları destekliyoruz.</p>
                            </div>
                            <div className="activity-card">
                                <h3>Söyleşiler</h3>
                                <p>Alanında uzman kişilerle söyleşiler düzenleyerek bilgi paylaşımı sağlıyoruz.</p>
                            </div>
                            <div className="activity-card">
                                <h3>Atölyeler</h3>
                                <p>Çeşitli sanat dallarında atölye çalışmaları ile yetenekleri geliştiriyoruz.</p>
                            </div>
                            <div className="activity-card">
                                <h3>Film Gösterimleri</h3>
                                <p>Seçkin filmlerle sinema tutkunlarını buluşturuyoruz.</p>
                            </div>
                        </div>
                    </section>

                    <section className="about-section">
                        <h2>İletişim</h2>
                        <p>
                            Etkinliklerimiz ve faaliyetlerimiz hakkında detaylı bilgi almak,
                            görüş ve önerilerinizi bizimle paylaşmak için iletişim sayfamızı ziyaret edebilirsiniz.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default About;
