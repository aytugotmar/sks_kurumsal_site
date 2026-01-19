import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaUpload } from 'react-icons/fa';
import { format } from 'date-fns';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Dashboard.css';
import './AdminEvents.css';

const AdminEvents = () => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        shortDescription: '',
        date: '',
        endDate: '',
        time: '',
        location: '',
        category: 'diğer',
        image: '',
        isActive: true,
        showInSlider: false,
        registrationRequired: false,
        capacity: ''
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('/api/events', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setEvents(response.data);
        } catch (error) {
            toast.error('Etkinlikler yüklenemedi');
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            const response = await axios.post('/api/upload', formDataUpload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            setFormData({ ...formData, image: response.data.url });
            toast.success('Resim yüklendi');
        } catch (error) {
            toast.error('Resim yüklenemedi');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (editingEvent) {
                await axios.put(`/api/events/${editingEvent.id}`, formData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                toast.success('Etkinlik güncellendi');
            } else {
                await axios.post('/api/events', formData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                toast.success('Etkinlik oluşturuldu');
            }
            resetForm();
            fetchEvents();
        } catch (error) {
            toast.error('Bir hata oluştu');
        }
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData({
            ...event,
            date: event.date ? format(new Date(event.date), 'yyyy-MM-dd') : '',
            endDate: event.endDate ? format(new Date(event.endDate), 'yyyy-MM-dd') : ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) {
            try {
                await axios.delete(`/api/events/${id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                toast.success('Etkinlik silindi');
                fetchEvents();
            } catch (error) {
                toast.error('Silme işlemi başarısız');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            shortDescription: '',
            date: '',
            endDate: '',
            time: '',
            location: '',
            category: 'diğer',
            image: '',
            isActive: true,
            showInSlider: false,
            registrationRequired: false,
            capacity: ''
        });
        setEditingEvent(null);
        setShowModal(false);
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Etkinlik Yönetimi</h1>
                <button onClick={() => setShowModal(true)} className="btn btn-primary">
                    <FaPlus /> Yeni Etkinlik
                </button>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Başlık</th>
                            <th>Kategori</th>
                            <th>Tarih</th>
                            <th>Konum</th>
                            <th>Durum</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map(event => (
                            <tr key={event.id}>
                                <td>{event.title}</td>
                                <td><span className="badge">{event.category}</span></td>
                                <td>{format(new Date(event.date), 'dd/MM/yyyy')}</td>
                                <td>{event.location || '-'}</td>
                                <td>
                                    <span className={`status ${event.isActive ? 'active' : 'inactive'}`}>
                                        {event.isActive ? 'Aktif' : 'Pasif'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button onClick={() => handleEdit(event)} className="btn-icon btn-edit">
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => handleDelete(event.id)} className="btn-icon btn-delete">
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
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingEvent ? 'Etkinlik Düzenle' : 'Yeni Etkinlik'}</h2>
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
                                    <label className="form-label">Kategori *</label>
                                    <select name="category" className="form-select" value={formData.category} onChange={handleChange}>
                                        <option value="konser">Konser</option>
                                        <option value="tiyatro">Tiyatro</option>
                                        <option value="sergi">Sergi</option>
                                        <option value="söyleşi">Söyleşi</option>
                                        <option value="atölye">Atölye</option>
                                        <option value="diğer">Diğer</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Tarih *</label>
                                    <input
                                        type="date"
                                        name="date"
                                        className="form-input"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Saat</label>
                                    <input
                                        type="time"
                                        name="time"
                                        className="form-input"
                                        value={formData.time}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Konum</label>
                                    <input
                                        type="text"
                                        name="location"
                                        className="form-input"
                                        value={formData.location}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Kapasite</label>
                                    <input
                                        type="number"
                                        name="capacity"
                                        className="form-input"
                                        value={formData.capacity}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Kısa Açıklama</label>
                                <input
                                    type="text"
                                    name="shortDescription"
                                    className="form-input"
                                    value={formData.shortDescription}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Resim</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploadingImage}
                                />
                                {uploadingImage && <p className="uploading-text">Yükleniyor...</p>}
                                {formData.image && (
                                    <div className="image-preview">
                                        <img src={formData.image} alt="Preview" />
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Açıklama *</label>
                                <ReactQuill
                                    theme="snow"
                                    value={formData.description}
                                    onChange={(value) => setFormData({ ...formData, description: value })}
                                    modules={{
                                        toolbar: [
                                            [{ 'header': [1, 2, 3, false] }],
                                            ['bold', 'italic', 'underline', 'strike'],
                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                            [{ 'align': [] }],
                                            ['link', 'image'],
                                            ['clean']
                                        ]
                                    }}
                                />
                            </div>

                            <div className="form-checkboxes">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                    />
                                    <span>Aktif</span>
                                </label>

                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="showInSlider"
                                        checked={formData.showInSlider}
                                        onChange={handleChange}
                                    />
                                    <span>Slider'da Göster</span>
                                </label>

                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="registrationRequired"
                                        checked={formData.registrationRequired}
                                        onChange={handleChange}
                                    />
                                    <span>Kayıt Gerekli</span>
                                </label>
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={resetForm} className="btn btn-secondary">
                                    İptal
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingEvent ? 'Güncelle' : 'Oluştur'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminEvents;
