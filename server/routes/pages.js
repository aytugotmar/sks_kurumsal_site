const express = require('express');
const router = express.Router();
const { Page } = require('../models/Page');
const { auth } = require('../middleware/auth');

// Get all published pages (public)
router.get('/', async (req, res) => {
    try {
        const pages = await Page.findAll({
            where: { isPublished: true }
        });
        res.json(pages);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Get all pages (admin - including drafts)
router.get('/all', auth, async (req, res) => {
    try {
        const pages = await Page.findAll();
        res.json(pages);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Get page by slug (public)
router.get('/slug/:slug', async (req, res) => {
    try {
        const page = await Page.findOne({
            where: {
                slug: req.params.slug,
                isPublished: true
            }
        });
        if (!page) {
            return res.status(404).json({ message: 'Sayfa bulunamadı' });
        }
        res.json(page);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Get page by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const page = await Page.findByPk(req.params.id);
        if (!page) {
            return res.status(404).json({ message: 'Sayfa bulunamadı' });
        }
        res.json(page);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Create page
router.post('/', auth, async (req, res) => {
    try {
        const page = await Page.create(req.body);
        res.status(201).json(page);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Update page
router.put('/:id', auth, async (req, res) => {
    try {
        const page = await Page.findByPk(req.params.id);
        if (!page) {
            return res.status(404).json({ message: 'Sayfa bulunamadı' });
        }
        await page.update(req.body);
        res.json(page);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Delete page
router.delete('/:id', auth, async (req, res) => {
    try {
        const page = await Page.findByPk(req.params.id);
        if (!page) {
            return res.status(404).json({ message: 'Sayfa bulunamadı' });
        }
        await page.destroy();
        res.json({ message: 'Sayfa silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

module.exports = router;
