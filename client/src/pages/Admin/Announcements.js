import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaPaperclip, FaFilePdf, FaImage, FaTimes } from 'react-icons/fa';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Dashboard.css';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        type: 'duyuru',
        isActive: true,
        publishDate: new Date().toISOString().split('T')[0]
    });
    const [attachments, setAttachments] = useState([]);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const response = await axios.get('/api/announcements/all', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setAnnouncements(response.data);
        } catch (error) {
            toast.error('Duyurular yüklenemedi');
        }
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);

        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axios.post('/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                const fileType = file.type.includes('pdf') ? 'pdf' :
                    file.type.includes('image') ? 'image' : 'other';

                setAttachments(prev => [...prev, {
                    name: file.name,
                    url: response.data.url,
                    type: fileType
                }]);

                toast.success(`${file.name} yüklendi`);
            } catch (error) {
                toast.error(`${file.name} yüklenemedi`);
            }
        }
    };

    const removeAttachment = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = {
                ...formData,
                attachments: attachments
            };

            if (editingAnnouncement) {
                await axios.put(`/api/announcements/${editingAnnouncement.id}`, data, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                toast.success('Duyuru güncellendi');
            } else {
                await axios.post('/api/announcements', data, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                toast.success('Duyuru eklendi');
            }

            fetchAnnouncements();
            closeModal();
        } catch (error) {
            toast.error('İşlem başarısız');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (announcement) => {
        setEditingAnnouncement(announcement);
        setFormData({
            title: announcement.title,
            content: announcement.content,
            type: announcement.type,
            isActive: announcement.isActive,
            publishDate: new Date(announcement.publishDate).toISOString().split('T')[0]
        });
        // MySQL'den gelen attachments JSON string olabilir, array'e çevir
        let attachmentsData = [];
        if (announcement.attachments) {
            if (typeof announcement.attachments === 'string') {
                try {
                    attachmentsData = JSON.parse(announcement.attachments);
                } catch (e) {
                    attachmentsData = [];
                }
            } else if (Array.isArray(announcement.attachments)) {
                attachmentsData = announcement.attachments;
            }
        }
        setAttachments(attachmentsData);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu duyuruyu silmek istediğinizden emin misiniz?')) {
            try {
                await axios.delete(`/api/announcements/${id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                toast.success('Duyuru silindi');
                fetchAnnouncements();
            } catch (error) {
                toast.error('Silme işlemi başarısız');
            }
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingAnnouncement(null);
        setFormData({
            title: '',
            content: '',
            type: 'duyuru',
            isActive: true,
            publishDate: new Date().toISOString().split('T')[0]
        });
        setAttachments([]);
    };

    return (
        <div className="admin-page">
            <div className="page-header admin-page-header">
                <h1>Duyurular</h1>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <FaPlus /> Yeni Duyuru
                </button>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Başlık</th>
                            <th>Tür</th>
                            <th>Ekler</th>
                            <th>Yayın Tarihi</th>
                            <th>Durum</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {announcements.map(announcement => (
                            <tr key={announcement.id}>
                                <td>{announcement.title}</td>
                                <td>
                                    <span className={`badge badge-${announcement.type}`}>
                                        {announcement.type}
                                    </span>
                                </td>
                                <td>
                                    {(() => {
                                        let attachments = [];
                                        if (announcement.attachments) {
                                            if (typeof announcement.attachments === 'string') {
                                                try {
                                                    attachments = JSON.parse(announcement.attachments);
                                                } catch (e) {
                                                    attachments = [];
                                                }
                                            } else if (Array.isArray(announcement.attachments)) {
                                                attachments = announcement.attachments;
                                            }
                                        }
                                        return attachments.length > 0 && (
                                            <span className="attachments-count">
                                                <FaPaperclip /> {attachments.length}
                                            </span>
                                        );
                                    })()}
                                </td>
                                <td>{format(new Date(announcement.publishDate), 'd MMM yyyy', { locale: tr })}</td>
                                <td>
                                    <span className={`status ${announcement.isActive ? 'active' : 'inactive'}`}>
                                        {announcement.isActive ? 'Aktif' : 'Pasif'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="btn-icon btn-edit" onClick={() => handleEdit(announcement)}>
                                            <FaEdit />
                                        </button>
                                        <button className="btn-icon btn-delete" onClick={() => handleDelete(announcement.id)}>
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
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingAnnouncement ? 'Duyuru Düzenle' : 'Yeni Duyuru'}</h2>
                            <button className="modal-close" onClick={closeModal}>
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Başlık *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>İçerik *</label>
                                <ReactQuill
                                    theme="snow"
                                    value={formData.content}
                                    onChange={(value) => setFormData({ ...formData, content: value })}
                                    modules={{
                                        toolbar: [
                                            [{ 'header': [1, 2, 3, false] }],
                                            ['bold', 'italic', 'underline', 'strike'],
                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                            [{ 'align': [] }],
                                            ['link'],
                                            ['clean']
                                        ]
                                    }}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Tür</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="duyuru">Duyuru</option>
                                        <option value="haber">Haber</option>
                                        <option value="önemli">Önemli</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Yayın Tarihi</label>
                                    <input
                                        type="date"
                                        value={formData.publishDate}
                                        onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    />
                                    Aktif
                                </label>
                            </div>

                            <div className="form-group">
                                <label>Ekler (PDF, Görsel)</label>
                                <input
                                    type="file"
                                    multiple
                                    accept=".pdf,.jpg,.jpeg,.png,.gif"
                                    onChange={handleFileChange}
                                />
                                {attachments.length > 0 && (
                                    <div className="attachments-list">
                                        {attachments.map((file, index) => (
                                            <div key={index} className="attachment-item">
                                                {file.type === 'pdf' ? <FaFilePdf /> : <FaImage />}
                                                <span>{file.name}</span>
                                                <button type="button" onClick={() => removeAttachment(index)}>
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    İptal
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Announcements;
