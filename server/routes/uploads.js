const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { auth } = require('../middleware/auth');

// Uploads klasörünün var olduğundan emin ol
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === 'application/pdf';

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Sadece resim ve PDF dosyaları yüklenebilir!');
        }
    }
});

// Upload single file (image or PDF)
router.post('/', auth, (req, res) => {
    upload.single('file')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: 'Dosya yükleme hatası', error: err.message });
        } else if (err) {
            return res.status(400).json({ message: err });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Dosya yüklenmedi' });
        }

        res.json({
            filename: req.file.filename,
            url: `/uploads/${req.file.filename}`
        });
    });
});

// Upload single image
router.post('/image', auth, (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: 'Dosya yükleme hatası', error: err.message });
        } else if (err) {
            return res.status(400).json({ message: err });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Dosya yüklenmedi' });
        }

        res.json({
            filename: req.file.filename,
            url: `/uploads/${req.file.filename}`
        });
    });
});

// Upload multiple images
router.post('/images', auth, (req, res) => {
    upload.array('images', 10)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: 'Dosya yükleme hatası', error: err.message });
        } else if (err) {
            return res.status(400).json({ message: err });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Dosya yüklenmedi' });
        }

        const files = req.files.map(file => ({
            filename: file.filename,
            url: `/uploads/${file.filename}`
        }));

        res.json(files);
    });
});

module.exports = router;
