import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Page.css';

const Page = () => {
    const { slug } = useParams();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchPage = useCallback(async () => {
        try {
            const response = await axios.get(`/api/pages/${slug}`);
            setPage(response.data);
        } catch (error) {
            console.error('Sayfa yüklenemedi:', error);
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchPage();
    }, [fetchPage]); if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!page) {
        return (
            <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>
                <h2>Sayfa bulunamadı</h2>
            </div>
        );
    }

    return (
        <div className="page-content-page">
            <div className="page-header">
                <div className="container">
                    <h1>{page.title}</h1>
                </div>
            </div>

            <div className="container">
                <div className="page-content">
                    <div dangerouslySetInnerHTML={{ __html: page.content }} />
                </div>
            </div>
        </div>
    );
};

export default Page;
