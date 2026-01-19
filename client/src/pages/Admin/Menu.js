import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import './Dashboard.css';
import './AdminEvents.css';

const AdminMenu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        url: '',
        order: 0,
        parentId: null,
        isExternal: false,
        isActive: true
    });

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            const response = await axios.get('/api/menu', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setMenuItems(response.data);
        } catch (error) {
            toast.error('Menü yüklenemedi');
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
            if (editingItem) {
                await axios.put(`/api/menu/${editingItem.id}`, formData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                toast.success('Menü güncellendi');
            } else {
                await axios.post('/api/menu', formData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                toast.success('Menü oluşturuldu');
            }
            resetForm();
            fetchMenuItems();
        } catch (error) {
            toast.error('Bir hata oluştu');
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData(item);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu menü öğesini silmek istediğinizden emin misiniz?')) {
            try {
                await axios.delete(`/api/menu/${id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                toast.success('Menü silindi');
                fetchMenuItems();
            } catch (error) {
                toast.error('Silme işlemi başarısız');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            url: '',
            order: 0,
            parentId: null,
            isExternal: false,
            isActive: true
        });
        setEditingItem(null);
        setShowModal(false);
    };

    return (
        <div className="admin-page">
            <div className="page-header admin-page-header">
                <h1>Menü Yönetimi</h1>
                <button onClick={() => setShowModal(true)} className="btn btn-primary">
                    <FaPlus /> Yeni Menü
                </button>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Başlık</th>
                            <th>URL</th>
                            <th>Sıra</th>
                            <th>Durum</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {menuItems.map(item => (
                            <React.Fragment key={item.id}>
                                <tr>
                                    <td><strong>{item.title}</strong></td>
                                    <td>{item.url}</td>
                                    <td>{item.order}</td>
                                    <td>
                                        <span className={`status ${item.isActive ? 'active' : 'inactive'}`}>
                                            {item.isActive ? 'Aktif' : 'Pasif'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button onClick={() => handleEdit(item)} className="btn-icon btn-edit">
                                                <FaEdit />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="btn-icon btn-delete">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {item.children && item.children.map(child => (
                                    <tr key={child.id} style={{ backgroundColor: '#f9fafb' }}>
                                        <td style={{ paddingLeft: '40px' }}>↳ {child.title}</td>
                                        <td>{child.url}</td>
                                        <td>{child.order}</td>
                                        <td>
                                            <span className={`status ${child.isActive ? 'active' : 'inactive'}`}>
                                                {child.isActive ? 'Aktif' : 'Pasif'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button onClick={() => handleEdit(child)} className="btn-icon btn-edit">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => handleDelete(child.id)} className="btn-icon btn-delete">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={resetForm}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingItem ? 'Menü Düzenle' : 'Yeni Menü'}</h2>
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
                                <label className="form-label">URL</label>
                                <input
                                    type="text"
                                    name="url"
                                    className="form-input"
                                    value={formData.url}
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
                                        name="isExternal"
                                        checked={formData.isExternal}
                                        onChange={handleChange}
                                    />
                                    <span>Harici Link</span>
                                </label>
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={resetForm} className="btn btn-secondary">
                                    İptal
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingItem ? 'Güncelle' : 'Oluştur'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMenu;
