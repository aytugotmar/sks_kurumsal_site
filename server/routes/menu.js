const express = require('express');
const router = express.Router();
const { MenuItem } = require('../models/MenuItem');
const { auth } = require('../middleware/auth');

// Get menu structure
router.get('/', async (req, res) => {
    try {
        const menuItems = await MenuItem.findAll({
            where: { isActive: true },
            order: [['order', 'ASC']]
        });

        // Build hierarchical structure
        const menuTree = menuItems
            .filter(item => !item.parentId)
            .map(parent => ({
                ...parent.toJSON(),
                children: menuItems.filter(child =>
                    child.parentId && child.parentId === parent.id
                )
            }));

        res.json(menuTree);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Create menu item
router.post('/', auth, async (req, res) => {
    try {
        const menuItem = await MenuItem.create(req.body);
        res.status(201).json(menuItem);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Update menu item
router.put('/:id', auth, async (req, res) => {
    try {
        const menuItem = await MenuItem.findByPk(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menü bulunamadı' });
        }
        await menuItem.update(req.body);
        res.json(menuItem);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Delete menu item
router.delete('/:id', auth, async (req, res) => {
    try {
        const menuItem = await MenuItem.findByPk(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menü bulunamadı' });
        }
        await menuItem.destroy();
        res.json({ message: 'Menü silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

module.exports = router;
