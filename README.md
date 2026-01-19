# YTÜ Kültür Hizmetleri Web Sitesi

Modern ve dinamik bir kurumsal web sitesi - Yıldız Teknik Üniversitesi Kültür Hizmetleri Şube Müdürlüğü için geliştirilmiştir.

## 🚀 Özellikler

### Genel Özellikler
- ✅ Modern ve responsive tasarım
- ✅ Tam özellikli admin paneli
- ✅ **MySQL veritabanı** (Sequelize ORM)
- ✅ JWT tabanlı authentication
- ✅ RESTful API
- ✅ Resim yükleme sistemi

### Frontend Özellikleri
- ✅ **Modern Slider** - Ana sayfada aktif etkinliklerin gösterildiği dinamik slider
- ✅ **Etkinlik Takvimi** - React Calendar ile interaktif takvim görünümü
- ✅ **Etkinlik Yönetimi** - Kategori bazlı filtreleme ve detaylı etkinlik sayfaları
- ✅ **Galeri Sistemi** - Fotoğraf galerileri
- ✅ **Dinamik Menü** - Yönetilebilir menü yapısı
- ✅ **Duyuru Sistemi** - Ana sayfada duyurular

### Admin Panel Özellikleri
- ✅ **Dashboard** - İstatistikler ve hızlı erişim
- ✅ **Etkinlik Yönetimi** - CRUD işlemleri
- ✅ **Slider Yönetimi** - Ana sayfa slider'ları
- ✅ **Sayfa Yönetimi** - Dinamik sayfa oluşturma (Rich Text Editor)
- ✅ **Menü Yönetimi** - Menü öğeleri düzenleme
- ✅ **Galeri Yönetimi** - Fotoğraf galerisi yönetimi
- ✅ **Kullanıcı Yönetimi** - Admin ve editör rolleri

## 📋 Gereksinimler

- Node.js (v14 veya üzeri)
- **MySQL (v8.0 veya üzeri)**
- npm veya yarn

## 🔧 Kurulum

### 1. MySQL Kurulumu

**Windows:**
1. [MySQL Installer](https://dev.mysql.com/downloads/installer/) indirin
2. MySQL Server'ı kurun ve root şifresi belirleyin

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Linux:**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

### 2. Veritabanı Oluşturma

MySQL'e bağlanın:
```bash
mysql -u root -p
```

Veritabanını oluşturun:
```sql
CREATE DATABASE kultur_daire CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 3. Projeyi Klonlayın
```bash
cd d:\Project\SKS\kultur_daire_v4
```

### 4. Backend Bağımlılıklarını Yükleyin
```bash
npm install
```

### 5. Frontend Bağımlılıklarını Yükleyin
```bash
cd client
npm install
cd ..
```

### 6. Ortam Değişkenlerini Ayarlayın
`.env.example` dosyasını kopyalayarak `.env` oluşturun:
```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=kultur_daire
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_secure_secret_key
NODE_ENV=development
```

### 7. Veritabanını Başlatın ve Test Verilerini Ekleyin
```bash
npm run seed
```

Bu komut:
- Tüm tabloları oluşturur
- Admin kullanıcısı ekler (username: `admin`, password: `admin123`)
- Örnek etkinlikler ve duyurular ekler

## 🚀 Çalıştırma

### Development Modu (Backend + Frontend)
```bash
npm run dev
```

### Sadece Backend
```bash
npm run server
```

### Sadece Frontend
```bash
npm run client
```

## 📱 Erişim

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3000/admin/login

### Varsayılan Admin Giriş
- **Kullanıcı Adı**: admin
- **Şifre**: admin123

## 📁 Proje Yapısı

```
kultur_daire_v2/
├── client/                 # React Frontend
│   ├── public/
│   └── src/
│       ├── components/    # React bileşenleri
│       ├── context/       # Context API
│       ├── pages/         # Sayfalar
│       │   ├── Admin/    # Admin sayfaları
│       │   └── ...       # Public sayfalar
│       ├── App.js
│       └── index.js
├── server/                # Express Backend
│   ├── models/           # MongoDB modelleri
│   ├── routes/           # API route'ları
│   ├── middleware/       # Middleware'ler
│   └── index.js
├── uploads/              # Yüklenen dosyalar
├── .env                  # Ortam değişkenleri
├── .gitignore
└── package.json
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Yeni kullanıcı kayıt
- `POST /api/auth/login` - Giriş
- `GET /api/auth/me` - Aktif kullanıcı bilgisi

### Events
- `GET /api/events` - Tüm etkinlikler
- `GET /api/events/:id` - Tek etkinlik
- `POST /api/events` - Yeni etkinlik (Auth)
- `PUT /api/events/:id` - Etkinlik güncelle (Auth)
- `DELETE /api/events/:id` - Etkinlik sil (Auth)

### Sliders
- `GET /api/sliders` - Aktif slider'lar
- `GET /api/sliders/all` - Tüm slider'lar (Auth)
- `POST /api/sliders` - Yeni slider (Auth)
- `PUT /api/sliders/:id` - Slider güncelle (Auth)
- `DELETE /api/sliders/:id` - Slider sil (Auth)

### Pages
- `GET /api/pages` - Tüm sayfalar
- `GET /api/pages/:slug` - Slug'a göre sayfa
- `POST /api/pages` - Yeni sayfa (Auth)
- `PUT /api/pages/:id` - Sayfa güncelle (Auth)
- `DELETE /api/pages/:id` - Sayfa sil (Auth)

### Menu
- `GET /api/menu` - Menü yapısı
- `POST /api/menu` - Yeni menü (Auth)
- `PUT /api/menu/:id` - Menü güncelle (Auth)
- `DELETE /api/menu/:id` - Menü sil (Auth)

### Gallery
- `GET /api/gallery` - Tüm galeriler
- `POST /api/gallery` - Yeni galeri (Auth)
- `PUT /api/gallery/:id` - Galeri güncelle (Auth)
- `DELETE /api/gallery/:id` - Galeri sil (Auth)

### Announcements
- `GET /api/announcements` - Tüm duyurular
- `POST /api/announcements` - Yeni duyuru (Auth)
- `PUT /api/announcements/:id` - Duyuru güncelle (Auth)
- `DELETE /api/announcements/:id` - Duyuru sil (Auth)

### Uploads
- `POST /api/uploads/image` - Tek resim yükle (Auth)
- `POST /api/uploads/images` - Çoklu resim yükle (Auth)

## 🛠️ Teknolojiler

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- Multer (dosya yükleme)
- Express Validator

### Frontend
- React 18
- React Router v6
- Context API
- Axios
- React Icons
- Swiper (slider)
- React Calendar
- React Toastify
- React Quill (rich text editor)
- date-fns

## 📝 Kullanım Kılavuzu

### Admin Panel Kullanımı

1. **Giriş Yapın**: `/admin/login` adresinden giriş yapın
2. **Dashboard**: Genel istatistikleri görün
3. **Etkinlik Ekle**: Etkinlikler sayfasından yeni etkinlik ekleyin
4. **Slider Yönetimi**: Ana sayfadaki slider'ları düzenleyin
5. **Sayfa Oluştur**: Dinamik içerik sayfaları oluşturun
6. **Menü Düzenle**: Site menüsünü özelleştirin

### Önemli Notlar

- ✅ Tüm tarihler ISO 8601 formatındadır
- ✅ Resimler `/uploads` klasöründe saklanır
- ✅ JWT token 7 gün geçerlidir
- ✅ Maksimum dosya boyutu 5MB
- ✅ Sadece resim dosyaları yüklenebilir

## 🔒 Güvenlik

- Şifreleri bcrypt ile hashlenir
- JWT ile token tabanlı authentication
- Protected routes (admin paneli)
- Input validation
- CORS koruması

## 📈 Geliştirme Önerileri

- [ ] E-posta bildirimleri
- [ ] Etkinlik kayıt sistemi
- [ ] Sosyal medya entegrasyonu
- [ ] Çoklu dil desteği
- [ ] SEO optimizasyonu
- [ ] PWA desteği
- [ ] Analytics entegrasyonu

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altındadır.

## 👨‍💻 Geliştirici

YTÜ Kültür Hizmetleri Şube Müdürlüğü için geliştirilmiştir.

## 📞 Destek

Sorularınız için: kultur@yildiz.edu.tr
