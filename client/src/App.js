import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Announcements from './pages/Announcements';
import AnnouncementDetail from './pages/AnnouncementDetail';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import Page from './pages/Page';

// Admin
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminEvents from './pages/Admin/Events';
import AdminSliders from './pages/Admin/Sliders';
import AdminPages from './pages/Admin/Pages';
import AdminMenu from './pages/Admin/Menu';
import AdminGallery from './pages/Admin/Gallery';
import AdminAnnouncements from './pages/Admin/Announcements';
import PrivateRoute from './components/PrivateRoute';

import './App.css';

function App() {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <AuthProvider>
                    <Router>
                        <div className="app">
                            <Header />
                            <main className="main-content">
                                <Routes>
                                    {/* Public Routes */}
                                    <Route path="/" element={<Home />} />
                                    <Route path="/etkinlikler" element={<Events />} />
                                    <Route path="/etkinlik/:id" element={<EventDetail />} />
                                    <Route path="/duyurular" element={<Announcements />} />
                                    <Route path="/duyuru/:id" element={<AnnouncementDetail />} />
                                    <Route path="/galeri" element={<Gallery />} />
                                    <Route path="/hakkimizda" element={<About />} />
                                    <Route path="/iletisim" element={<Contact />} />
                                    <Route path="/sayfa/:slug" element={<Page />} />

                                    {/* Admin Routes */}
                                    <Route path="/admin/login" element={<AdminLogin />} />
                                    <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
                                    <Route path="/admin/etkinlikler" element={<PrivateRoute><AdminEvents /></PrivateRoute>} />
                                    <Route path="/admin/slider" element={<PrivateRoute><AdminSliders /></PrivateRoute>} />
                                    <Route path="/admin/sayfalar" element={<PrivateRoute><AdminPages /></PrivateRoute>} />
                                    <Route path="/admin/menu" element={<PrivateRoute><AdminMenu /></PrivateRoute>} />
                                    <Route path="/admin/galeri" element={<PrivateRoute><AdminGallery /></PrivateRoute>} />
                                    <Route path="/admin/duyurular" element={<PrivateRoute><AdminAnnouncements /></PrivateRoute>} />
                                </Routes>
                            </main>
                            <Footer />
                            <ToastContainer position="top-right" autoClose={3000} />
                        </div>
                    </Router>
                </AuthProvider>
            </LanguageProvider>
        </ThemeProvider>
    );
}

export default App;
