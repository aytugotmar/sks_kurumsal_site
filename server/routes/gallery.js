const express = require('express');
const router = express.Router();
const { Gallery } = require('../models/Gallery');
const { Event } = require('../models/Event');
const { auth } = require('../middleware/auth');

// Get all galleries
router.get('/', async (req, res) => {
    try {
        const galleries = await Gallery.findAll({
            where: { isActive: true },
            include: [{ model: Event, as: 'event' }]
        });
        res.json(galleries);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Get all galleries (admin - including inactive)
router.get('/all', auth, async (req, res) => {
    try {
        const galleries = await Gallery.findAll({
            include: [{ model: Event, as: 'event' }]
        });
        res.json(galleries);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Create gallery
router.post('/', auth, async (req, res) => {
    try {
        const gallery = await Gallery.create(req.body);
        res.status(201).json(gallery);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Update gallery
router.put('/:id', auth, async (req, res) => {
    try {
        const gallery = await Gallery.findByPk(req.params.id);
        if (!gallery) {
            return res.status(404).json({ message: 'Galeri bulunamadı' });
        }
        await gallery.update(req.body);
        res.json(gallery);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Delete gallery
router.delete('/:id', auth, async (req, res) => {
    try {
        const gallery = await Gallery.findByPk(req.params.id);
        if (!gallery) {
            return res.status(404).json({ message: 'Galeri bulunamadı' });
        }
        await gallery.destroy();
        res.json({ message: 'Galeri silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

module.exports = router;
