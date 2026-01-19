import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaUpload } from 'react-icons/fa';
import './Dashboard.css';
import './AdminEvents.css';

const AdminSliders = () => {
    const [sliders, setSliders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingSlider, setEditingSlider] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        image: '',
        link: '',
        buttonText: 'Detaylar',
        order: 0,
        isActive: true
    });

    useEffect(() => {
        fetchSliders();
    }, []);

    const fetchSliders = async () => {
        try {
            const response = await axios.get('/api/sliders/all', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setSliders(response.data);
        } catch (error) {
            toast.error('Slider yüklenemedi');
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
            if (editingSlider) {
                await axios.put(`/api/sliders/${editingSlider.id}`, formData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                toast.success('Slider güncellendi');
            } else {
                await axios.post('/api/sliders', formData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                toast.success('Slider oluşturuldu');
            }
            resetForm();
            fetchSliders();
        } catch (error) {
            toast.error('Bir hata oluştu');
        }
    };

    const handleEdit = (slider) => {
        setEditingSlider(slider);
        setFormData(slider);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu slider\'ı silmek istediğinizden emin misiniz?')) {
            try {
                await axios.delete(`/api/sliders/${id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                toast.success('Slider silindi');
                fetchSliders();
            } catch (error) {
                toast.error('Silme işlemi başarısız');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            subtitle: '',
            description: '',
            image: '',
            link: '',
            buttonText: 'Detaylar',
            order: 0,
            isActive: true
        });
        setEditingSlider(null);
        setShowModal(false);
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Slider Yönetimi</h1>
                <button onClick={() => setShowModal(true)} className="btn btn-primary">
                    <FaPlus /> Yeni Slider
                </button>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Başlık</th>
                            <th>Sıra</th>
                            <th>Durum</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sliders.map(slider => (
                            <tr key={slider.id}>
                                <td>{slider.title}</td>
                                <td>{slider.order}</td>
                                <td>
                                    <span className={`status ${slider.isActive ? 'active' : 'inactive'}`}>
                                        {slider.isActive ? 'Aktif' : 'Pasif'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button onClick={() => handleEdit(slider)} className="btn-icon btn-edit">
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => handleDelete(slider.id)} className="btn-icon btn-delete">
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
                            <h2>{editingSlider ? 'Slider Düzenle' : 'Yeni Slider'}</h2>
                            <button onClick={resetForm} className="modal-close">&times;</button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
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
                                <label className="form-label">Alt Başlık</label>
                                <input
                                    type="text"
                                    name="subtitle"
                                    className="form-input"
                                    value={formData.subtitle}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Açıklama</label>
                                <textarea
                                    name="description"
                                    className="form-textarea"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
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

                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Link</label>
                                    <input
                                        type="text"
                                        name="link"
                                        className="form-input"
                                        value={formData.link}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Buton Metni</label>
                                    <input
                                        type="text"
                                        name="buttonText"
                                        className="form-input"
                                        value={formData.buttonText}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Sıra</label>
                                    <input
                                        type="number"
                                        name="order"
                                        className="form-input"
                                        value={formData.order}
                                        onChange={handleChange}
                                    />
                                </div>
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
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={resetForm} className="btn btn-secondary">
                                    İptal
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingSlider ? 'Güncelle' : 'Oluştur'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSliders;
