const express = require('express');
const router = express.Router();
const { Slider } = require('../models/Slider');
const { Event } = require('../models/Event');
const { auth } = require('../middleware/auth');

// Get all active sliders
router.get('/', async (req, res) => {
    try {
        const sliders = await Slider.findAll({
            where: { isActive: true },
            include: [{ model: Event, as: 'event' }],
            order: [['order', 'ASC']]
        });
        res.json(sliders);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Get all sliders (admin)
router.get('/all', auth, async (req, res) => {
    try {
        const sliders = await Slider.findAll({
            include: [{ model: Event, as: 'event' }],
            order: [['order', 'ASC']]
        });
        res.json(sliders);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Create slider
router.post('/', auth, async (req, res) => {
    try {
        const slider = await Slider.create(req.body);
        res.status(201).json(slider);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Update slider
router.put('/:id', auth, async (req, res) => {
    try {
        const slider = await Slider.findByPk(req.params.id);
        if (!slider) {
            return res.status(404).json({ message: 'Slider bulunamadı' });
        }
        await slider.update(req.body);
        res.json(slider);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Delete slider
router.delete('/:id', auth, async (req, res) => {
    try {
        const slider = await Slider.findByPk(req.params.id);
        if (!slider) {
            return res.status(404).json({ message: 'Slider bulunamadı' });
        }
        await slider.destroy();
        res.json({ message: 'Slider silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

module.exports = router;
