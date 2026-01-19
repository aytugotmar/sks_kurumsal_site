const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Yetkilendirme gerekli' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.userId, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(401).json({ message: 'Kullanıcı bulunamadı' });
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Lütfen giriş yapın' });
    }
};

const adminAuth = async (req, res, next) => {
    try {
        await auth(req, res, () => { });

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Yetkiniz yok' });
        }

        next();
    } catch (error) {
        res.status(403).json({ message: 'Yetkilendirme hatası' });
    }
};

module.exports = { auth, adminAuth };
