import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Dashboard.css';
import './AdminEvents.css';

const AdminPages = () => {
    const [pages, setPages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingPage, setEditingPage] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        metaDescription: '',
        isPublished: true
    });

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const response = await axios.get('/api/pages', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setPages(response.data);
        } catch (error) {
            toast.error('Sayfalar yüklenemedi');
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });

        // Auto-generate slug from title
        if (e.target.name === 'title' && !editingPage) {
            const slug = e.target.value
                .toLowerCase()
                .replace(/ğ/g, 'g')
                .replace(/ü/g, 'u')
                .replace(/ş/g, 's')
                .replace(/ı/g, 'i')
                .replace(/ö/g, 'o')
                .replace(/ç/g, 'c')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleContentChange = (content) => {
        setFormData({ ...formData, content });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (editingPage) {
                await axios.put(`/api/pages/${editingPage.id}`, formData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                toast.success('Sayfa güncellendi');
            } else {
                await axios.post('/api/pages', formData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                toast.success('Sayfa oluşturuldu');
            }
            resetForm();
            fetchPages();
        } catch (error) {
            toast.error('Bir hata oluştu');
        }
    };

    const handleEdit = (page) => {
        setEditingPage(page);
        setFormData(page);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu sayfayı silmek istediğinizden emin misiniz?')) {
            try {
                await axios.delete(`/api/pages/${id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                toast.success('Sayfa silindi');
                fetchPages();
            } catch (error) {
                toast.error('Silme işlemi başarısız');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            slug: '',
            content: '',
            metaDescription: '',
            isPublished: true
        });
        setEditingPage(null);
        setShowModal(false);
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Sayfa Yönetimi</h1>
                <button onClick={() => setShowModal(true)} className="btn btn-primary">
                    <FaPlus /> Yeni Sayfa
                </button>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Başlık</th>
                            <th>Slug</th>
                            <th>Durum</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pages.map(page => (
                            <tr key={page.id}>
                                <td>{page.title}</td>
                                <td><code>{page.slug}</code></td>
                                <td>
                                    <span className={`status ${page.isPublished ? 'active' : 'inactive'}`}>
                                        {page.isPublished ? 'Yayında' : 'Taslak'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button onClick={() => handleEdit(page)} className="btn-icon btn-edit">
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => handleDelete(page.id)} className="btn-icon btn-delete">
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={resetForm}>
                    <div className="modal-content" style={{ maxWidth: '1000px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingPage ? 'Sayfa Düzenle' : 'Yeni Sayfa'}</h2>
                            <button onClick={resetForm} className="modal-close">&times;</button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Başlık *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="form-input"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Slug *</label>
                                    <input
                                        type="text"
                                        name="slug"
                                        className="form-input"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">İçerik *</label>
                                <ReactQuill
                                    value={formData.content}
                                    onChange={handleContentChange}
                                    theme="snow"
                                    style={{ height: '300px', marginBottom: '60px' }}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Meta Açıklama</label>
                                <textarea
                                    name="metaDescription"
                                    className="form-textarea"
                                    value={formData.metaDescription}
                                    onChange={handleChange}
                                    rows="3"
                                />
                            </div>

                            <div className="form-checkboxes">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="isPublished"
                                        checked={formData.isPublished}
                                        onChange={handleChange}
                                    />
                                    <span>Yayında</span>
                                </label>
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={resetForm} className="btn btn-secondary">
                                    İptal
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingPage ? 'Güncelle' : 'Oluştur'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPages;
