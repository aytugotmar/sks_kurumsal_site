const express = require('express');
const router = express.Router();
const { Event } = require('../models/Event');
const { auth } = require('../middleware/auth');
const { Op } = require('sequelize');

// Get all events (public - active only by default)
router.get('/', async (req, res) => {
    try {
        const { active, slider, month, year } = req.query;
        let where = {};

        // Varsayılan olarak sadece aktif etkinlikler
        if (active !== 'false') where.isActive = true;
        if (slider === 'true') where.showInSlider = true;

        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);
            where.date = { [Op.between]: [startDate, endDate] };
        }

        const events = await Event.findAll({
            where,
            order: [['date', 'DESC']]
        });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Get all events (admin - including inactive)
router.get('/all', auth, async (req, res) => {
    try {
        const events = await Event.findAll({
            order: [['date', 'DESC']]
        });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Get single event
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Etkinlik bulunamadı' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Create event
router.post('/', auth, async (req, res) => {
    try {
        const event = await Event.create(req.body);
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Update event
router.put('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Etkinlik bulunamadı' });
        }

        await event.update(req.body);
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Delete event
router.delete('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Etkinlik bulunamadı' });
        }

        await event.destroy();
        res.json({ message: 'Etkinlik silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

module.exports = router;
