const express = require('express');
const router = express.Router();
const { Announcement } = require('../models/Announcement');
const { auth } = require('../middleware/auth');

// Get all announcements (public - only active)
router.get('/', async (req, res) => {
    try {
        const announcements = await Announcement.findAll({
            where: { isActive: true },
            order: [['publishDate', 'DESC']]
        });
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Get all announcements (admin - all)
router.get('/all', auth, async (req, res) => {
    try {
        const announcements = await Announcement.findAll({
            order: [['publishDate', 'DESC']]
        });
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Get single announcement
router.get('/:id', async (req, res) => {
    try {
        const announcement = await Announcement.findByPk(req.params.id);
        if (!announcement) {
            return res.status(404).json({ message: 'Duyuru bulunamadı' });
        }
        res.json(announcement);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Create announcement
router.post('/', auth, async (req, res) => {
    try {
        const announcement = await Announcement.create(req.body);
        res.status(201).json(announcement);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Update announcement
router.put('/:id', auth, async (req, res) => {
    try {
        const announcement = await Announcement.findByPk(req.params.id);
        if (!announcement) {
            return res.status(404).json({ message: 'Duyuru bulunamadı' });
        }
        await announcement.update(req.body);
        res.json(announcement);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Delete announcement
router.delete('/:id', auth, async (req, res) => {
    try {
        const announcement = await Announcement.findByPk(req.params.id);
        if (!announcement) {
            return res.status(404).json({ message: 'Duyuru bulunamadı' });
        }
        await announcement.destroy();
        res.json({ message: 'Duyuru silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

module.exports = router;
