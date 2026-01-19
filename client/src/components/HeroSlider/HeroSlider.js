import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import './HeroSlider.css';

const HeroSlider = () => {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSliders();
    }, []);

    const fetchSliders = async () => {
        try {
            const response = await axios.get('/api/sliders');
            setSlides(response.data);
        } catch (error) {
            console.error('Slider yüklenemedi:', error);
            console.error('Hata detayı:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="slider-loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (slides.length === 0) {
        return null;
    }

    return (
        <div className="hero-slider">
            <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                effect="fade"
                navigation
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                loop={true}
                className="hero-swiper"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="slide-content">
                            <div
                                className="slide-background"
                                style={{ backgroundImage: `url(${slide.image})` }}
                            />
                            <div className="slide-overlay" />
                            <div className="container">
                                <div className="slide-text">
                                    <h1 className="slide-title">{slide.title}</h1>
                                    {slide.subtitle && (
                                        <h2 className="slide-subtitle">{slide.subtitle}</h2>
                                    )}
                                    {slide.description && (
                                        <p className="slide-description">{slide.description}</p>
                                    )}
                                    {slide.link && (
                                        <Link to={slide.link} className="btn btn-primary btn-large">
                                            {slide.buttonText || 'Detaylar'}
                                        </Link>
                                    )}
                                    {slide.eventId && !slide.link && (
                                        <Link to={`/etkinlik/${slide.eventId}`} className="btn btn-primary btn-large">
                                            Etkinlik Detayları
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default HeroSlider;
