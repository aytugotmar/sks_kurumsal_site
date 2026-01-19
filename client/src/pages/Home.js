import React, { useState, useEffect } from "react";
import axios from "axios";
import HeroSlider from "../components/HeroSlider/HeroSlider";
import EventCalendar from "../components/EventCalendar/EventCalendar";
import { Link } from "react-router-dom";
import { FaCalendar, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";
import { format } from "date-fns";
import { tr, enUS } from "date-fns/locale";
import { useTranslation } from "../hooks/useTranslation";
import "./Home.css";

const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useTranslation();
  const dateLocale = language === "tr" ? tr : enUS;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, announcementsRes] = await Promise.all([
        axios.get("/api/events?active=true"),
        axios.get("/api/announcements"),
      ]);

      // Get next 6 upcoming events
      const upcoming = eventsRes.data
        .filter((event) => new Date(event.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 6);

      setUpcomingEvents(upcoming);
      // Get last 5 announcements
      setAnnouncements(announcementsRes.data.slice(0, 5));
    } catch (error) {
      console.error("Veri yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <HeroSlider />

      {/* Welcome Section */}
      <section className="welcome-section section">
        <div className="container">
          <div className="welcome-content">
            <div className="welcome-text">
              <h2>{t("home.welcomeTitle")}</h2>
              <p>{t("home.welcomeText1")}</p>
              <p>{t("home.welcomeText2")}</p>
              <Link to="/hakkimizda" className="btn btn-primary">
                {t("home.moreInfo")}
              </Link>
            </div>
            <div className="welcome-image">
              <img src="/images/ytu-kampus.svg" alt="YTÜ Kampüs" />
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="upcoming-events-section section">
        <div className="container">
          <div className="section-header">
            <h2>{t("home.upcomingEvents")}</h2>
            <Link to="/etkinlikler" className="view-all">
              {t("home.viewAll")} <FaArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="events-grid">
              {upcomingEvents.map((event) => (
                <Link
                  to={`/etkinlik/${event.id}`}
                  key={event.id}
                  className="event-card card"
                >
                  <div className="event-card-image">
                    {event.image ? (
                      <img src={event.image} alt={event.title} />
                    ) : (
                      <div className="event-card-placeholder">
                        <span>{event.category}</span>
                      </div>
                    )}
                    <span className="event-card-category">
                      {event.category}
                    </span>
                  </div>
                  <div className="event-card-content">
                    <h3>{event.title}</h3>
                    <div className="event-card-meta">
                      <span className="meta-item">
                        <FaCalendar />
                        {format(new Date(event.date), "d MMMM yyyy", {
                          locale: dateLocale,
                        })}
                      </span>
                      {event.location && (
                        <span className="meta-item">
                          <FaMapMarkerAlt />
                          {event.location}
                        </span>
                      )}
                    </div>
                    {event.shortDescription && (
                      <p className="event-card-desc">
                        {event.shortDescription}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="no-data">{t("home.noEvents")}</p>
          )}
        </div>
      </section>

      {/* Event Calendar */}
      <EventCalendar />

      {/* Announcements */}
      {announcements.length > 0 && (
        <section className="announcements-section section">
          <div className="container">
            <div className="section-header">
              <h2>{t("home.announcements")}</h2>
              <Link to="/duyurular" className="view-all">
                {t("home.viewAll")} <FaArrowRight />
              </Link>
            </div>
            <div className="announcements-grid">
              {announcements.map((announcement) => (
                <Link
                  to={`/duyuru/${announcement.id}`}
                  key={announcement.id}
                  className={`announcement-card card ${announcement.type}`}
                >
                  <div className="announcement-type">
                    {announcement.type === "duyuru"
                      ? language === "tr"
                        ? "Duyuru"
                        : "Announcement"
                      : announcement.type === "haber"
                      ? language === "tr"
                        ? "Haber"
                        : "News"
                      : language === "tr"
                      ? "Önemli"
                      : "Important"}
                  </div>
                  <h3>{announcement.title}</h3>
                  <p>{announcement.content.substring(0, 120)}...</p>
                  <span className="announcement-date">
                    {format(new Date(announcement.publishDate), "d MMMM yyyy", {
                      locale: dateLocale,
                    })}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
