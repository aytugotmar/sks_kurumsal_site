import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaImage, FaTimes, FaLink } from 'react-icons/fa';
import './Dashboard.css';
import './AdminEvents.css';

const AdminGallery = () => {
    const [galleries, setGalleries] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [editingGallery, setEditingGallery] = useState(null);
    const [selectedGallery, setSelectedGallery] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        isActive: true
    });
    const [uploadingImages, setUploadingImages] = useState(false);

    useEffect(() => {
        fetchGalleries();
    }, []);

    const fetchGalleries = async () => {
        try {
            const response = await axios.get('/api/gallery/all', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setGalleries(response.data);
        } catch (error) {
            toast.error('Galeriler yüklenemedi');
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (editingGallery) {
                await axios.put(`/api/gallery/${editingGallery.id}`, formData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                toast.success('Galeri güncellendi');
            } else {
                await axios.post('/api/gallery', formData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                toast.success('Galeri oluşturuldu');
            }
            resetForm();
            fetchGalleries();
        } catch (error) {
            toast.error('Bir hata oluştu');
        }
    };

    const handleEdit = (gallery) => {
        setEditingGallery(gallery);
        setFormData(gallery);
        setShowModal(true);
    };

    const handleManageImages = (gallery) => {
        setSelectedGallery(gallery);
        setShowImageModal(true);
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        setUploadingImages(true);

        try {
            const uploadedUrls = [];

            for (const file of files) {
                const formData = new FormData();
                formData.append('file', file);

                const response = await axios.post('/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                uploadedUrls.push(response.data.url);
            }

            // Update gallery with new images
            const updatedImages = [...(selectedGallery.images || []), ...uploadedUrls];
            await axios.put(`/api/gallery/${selectedGallery.id}`, {
                ...selectedGallery,
                images: updatedImages
            }, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            toast.success(`${files.length} resim yüklendi`);
            fetchGalleries();

            // Update selected gallery
            setSelectedGallery({
                ...selectedGallery,
                images: updatedImages
            });
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Resim yüklenemedi: ' + (error.response?.data?.message || error.message));
        } finally {
            setUploadingImages(false);
        }
    };

    const handleAddImageUrl = async () => {
        const imageUrl = prompt('Resim URL\'sini girin:');
        if (!imageUrl) return;

        try {
            const updatedImages = [...(selectedGallery.images || []), imageUrl];
            await axios.put(`/api/gallery/${selectedGallery.id}`, {
                ...selectedGallery,
                images: updatedImages
            }, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            toast.success('Resim eklendi');
            setSelectedGallery({
                ...selectedGallery,
                images: updatedImages
            });
            fetchGalleries();
        } catch (error) {
            toast.error('Resim eklenemedi');
        }
    };

    const handleDeleteImage = async (imageUrl) => {
        if (!window.confirm('Bu resmi silmek istediğinizden emin misiniz?')) return;

        try {
            const updatedImages = selectedGallery.images.filter(img => img !== imageUrl);

            await axios.put(`/api/gallery/${selectedGallery.id}`, {
                ...selectedGallery,
                images: updatedImages
            }, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            toast.success('Resim silindi');
            setSelectedGallery({
                ...selectedGallery,
                images: updatedImages
            });
            fetchGalleries();
        } catch (error) {
            toast.error('Resim silinemedi');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu galeriyi silmek istediğinizden emin misiniz?')) {
            try {
                await axios.delete(`/api/gallery/${id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                toast.success('Galeri silindi');
                fetchGalleries();
            } catch (error) {
                toast.error('Silme işlemi başarısız');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: '',
            isActive: true
        });
        setEditingGallery(null);
        setShowModal(false);
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Galeri Yönetimi</h1>
                <button onClick={() => setShowModal(true)} className="btn btn-primary">
                    <FaPlus /> Yeni Galeri
                </button>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Başlık</th>
                            <th>Kategori</th>
                            <th>Fotoğraf Sayısı</th>
                            <th>Durum</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {galleries.map(gallery => (
                            <tr key={gallery.id}>
                                <td>{gallery.title}</td>
                                <td>{gallery.category || '-'}</td>
                                <td>{gallery.images?.length || 0}</td>
                                <td>
                                    <span className={`status ${gallery.isActive ? 'active' : 'inactive'}`}>
                                        {gallery.isActive ? 'Aktif' : 'Pasif'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button onClick={() => handleManageImages(gallery)} className="btn-icon btn-primary" title="Resimleri Yönet">
                                            <FaImage />
                                        </button>
                                        <button onClick={() => handleEdit(gallery)} className="btn-icon btn-edit">
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => handleDelete(gallery.id)} className="btn-icon btn-delete">
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
                            <h2>{editingGallery ? 'Galeri Düzenle' : 'Yeni Galeri'}</h2>
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
                                <label className="form-label">Kategori</label>
                                <input
                                    type="text"
                                    name="category"
                                    className="form-input"
                                    value={formData.category}
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
                                    {editingGallery ? 'Güncelle' : 'Oluştur'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showImageModal && selectedGallery && (
                <div className="modal-overlay" onClick={() => setShowImageModal(false)}>
                    <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{selectedGallery.title} - Resimler</h2>
                            <button onClick={() => setShowImageModal(false)} className="modal-close">
                                <FaTimes />
                            </button>
                        </div>

                        <div className="image-upload-section">
                            <label className="upload-button">
                                <FaPlus /> Dosyadan Ekle
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                            </label>
                            <button type="button" onClick={handleAddImageUrl} className="btn btn-secondary">
                                <FaLink /> URL Ekle
                            </button>
                            {uploadingImages && <span className="uploading-text">Yükleniyor...</span>}
                        </div>

                        <div className="gallery-grid">
                            {selectedGallery.images?.map((image, index) => (
                                <div key={index} className="gallery-item">
                                    <img src={image} alt={`Gallery ${index + 1}`} />
                                    <button
                                        className="delete-image-btn"
                                        onClick={() => handleDeleteImage(image)}
                                        title="Sil"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {(!selectedGallery.images || selectedGallery.images.length === 0) && (
                            <div className="empty-state">
                                <FaImage size={48} />
                                <p>Henüz resim eklenmemiş</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminGallery;
