# MongoDB'den MySQL'e Geçiş Rehberi

## Yapılan Değişiklikler

### 1. Veritabanı Sistemi
- **Önceki Sistem**: MongoDB (NoSQL)
- **Yeni Sistem**: MySQL (SQL)
- **ORM**: Mongoose → Sequelize

### 2. Değiştirilen Dosyalar

#### Konfigürasyon
- `server/config/database.js` - MySQL bağlantısı için Sequelize yapılandırması

#### Modeller (server/models/)
Tüm modeller Sequelize'e dönüştürüldü:
- `User.js` - Kullanıcı modeli (bcrypt şifreleme ile)
- `Event.js` - Etkinlik modeli
- `Announcement.js` - Duyuru modeli
- `Gallery.js` - Galeri modeli (Event ile ilişki)
- `MenuItem.js` - Menü öğeleri modeli
- `Page.js` - Dinamik sayfalar modeli
- `Slider.js` - Ana sayfa slider'ları (Event ile ilişki)

#### Route'lar (server/routes/)
Tüm route dosyaları Sequelize sorgu syntax'ına güncellendi:
- `auth.js` - Kimlik doğrulama
- `events.js` - Etkinlik CRUD işlemleri
- `announcements.js` - Duyuru yönetimi
- `gallery.js` - Galeri işlemleri
- `menu.js` - Menü yönetimi
- `pages.js` - Sayfa yönetimi
- `sliders.js` - Slider yönetimi

#### Middleware
- `server/middleware/auth.js` - JWT doğrulama Sequelize'e uyarlandı

#### Diğer
- `server/index.js` - MySQL bağlantısı entegre edildi
- `seed.js` - Örnek veri ekleme Sequelize'e dönüştürüldü
- `package.json` - mongoose kaldırıldı, sequelize ve mysql2 eklendi

### 3. Temel Farklar

#### MongoDB → MySQL Sorgu Karşılaştırması

**Kayıt Bulma:**
```javascript
// MongoDB
await User.findOne({ username: 'admin' })

// MySQL (Sequelize)
await User.findOne({ where: { username: 'admin' } })
```

**ID ile Bulma:**
```javascript
// MongoDB
await Event.findById(id)

// MySQL (Sequelize)
await Event.findByPk(id)
```

**Tüm Kayıtları Getirme:**
```javascript
// MongoDB
await Event.find({ isActive: true }).sort({ date: -1 })

// MySQL (Sequelize)
await Event.findAll({ 
    where: { isActive: true },
    order: [['date', 'DESC']]
})
```

**Kayıt Oluşturma:**
```javascript
// MongoDB
const event = new Event(data)
await event.save()

// MySQL (Sequelize)
const event = await Event.create(data)
```

**Kayıt Güncelleme:**
```javascript
// MongoDB
await Event.findByIdAndUpdate(id, data, { new: true })

// MySQL (Sequelize)
const event = await Event.findByPk(id)
await event.update(data)
```

**Kayıt Silme:**
```javascript
// MongoDB
await Event.findByIdAndDelete(id)

// MySQL (Sequelize)
const event = await Event.findByPk(id)
await event.destroy()
```

**İlişkili Veri Getirme:**
```javascript
// MongoDB
await Gallery.find().populate('eventId')

// MySQL (Sequelize)
await Gallery.findAll({ 
    include: [{ model: Event, as: 'event' }]
})
```

## Kurulum Adımları

### 1. MySQL Kurulumu

**Windows:**
1. [MySQL Installer](https://dev.mysql.com/downloads/installer/) indir
2. MySQL Server ve MySQL Workbench kur
3. Kurulum sırasında root şifresi belirle

**macOS:**
```bash
brew install mysql
brew services start mysql
mysql_secure_installation
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

### 2. Veritabanı Oluşturma

MySQL'e bağlan:
```bash
mysql -u root -p
```

Veritabanını oluştur:
```sql
CREATE DATABASE kultur_daire CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 3. Proje Yapılandırması

`.env` dosyasını oluştur (`.env.example` dosyasını kopyala):
```bash
cp .env.example .env
```

`.env` dosyasını düzenle:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=kultur_daire
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_secure_secret_key
```

### 4. Bağımlılıkları Yükle

Eski MongoDB paketlerini kaldır:
```bash
npm uninstall mongoose
```

Yeni paketleri yükle (zaten package.json'da var):
```bash
npm install
```

### 5. Veritabanını Başlat ve Test Verilerini Ekle

```bash
npm run seed
```

Bu komut:
- Tüm tabloları oluşturur
- Admin kullanıcısı ekler (username: admin, password: admin123)
- Örnek etkinlikler, duyurular ve diğer verileri ekler

### 6. Sunucuyu Başlat

```bash
npm run dev
```

## Veri Tabanı Şeması

### Users (Kullanıcılar)
- id (INT, Primary Key, Auto Increment)
- username (VARCHAR, Unique)
- email (VARCHAR, Unique)
- password (VARCHAR, Hashed)
- role (ENUM: 'admin', 'editor')
- createdAt, updatedAt (DATETIME)

### Events (Etkinlikler)
- id (INT, Primary Key)
- title, description, shortDescription
- date (DATE), time (VARCHAR)
- location, category, image
- isActive, showInSlider, registrationRequired
- capacity (INT)
- createdAt, updatedAt

### Announcements (Duyurular)
- id (INT, Primary Key)
- title, content
- type (ENUM: 'duyuru', 'önemli', 'acil')
- publishDate (DATE)
- isActive (BOOLEAN)
- createdAt, updatedAt

### Gallery (Galeri)
- id (INT, Primary Key)
- title, description
- images (JSON)
- eventId (INT, Foreign Key → Events)
- isActive (BOOLEAN)
- createdAt, updatedAt

### Sliders
- id (INT, Primary Key)
- title, subtitle, description
- image, buttonText, buttonLink
- eventId (INT, Foreign Key → Events, Nullable)
- order (INT), isActive (BOOLEAN)
- createdAt, updatedAt

### Pages (Sayfalar)
- id (INT, Primary Key)
- title, slug (Unique)
- content (TEXT)
- metaDescription
- isPublished (BOOLEAN)
- createdAt, updatedAt

### MenuItems (Menü)
- id (INT, Primary Key)
- title, url
- parentId (INT, Self Reference, Nullable)
- order (INT), isActive (BOOLEAN)
- createdAt, updatedAt

## İlişkiler

1. **Gallery → Event**: Her galeri bir etkinliğe bağlı olabilir
2. **Slider → Event**: Her slider bir etkinliğe bağlı olabilir (opsiyonel)
3. **MenuItem → MenuItem**: Self-reference (alt menüler için)

## Sorun Giderme

### "Cannot connect to database" hatası
- MySQL servisinin çalıştığından emin olun
- `.env` dosyasındaki bilgileri kontrol edin
- Kullanıcı adı ve şifrenin doğru olduğunu doğrulayın

### "Table doesn't exist" hatası
- `npm run seed` komutunu çalıştırın
- Veritabanının oluşturulduğundan emin olun

### Port zaten kullanımda
- Başka bir MySQL instance'ı kapatın veya port numarasını değiştirin

## Performans İpuçları

1. **İndeksler**: Sık sorgulanan alanlar için index oluşturun
2. **Eager Loading**: İlişkili verileri tek sorguda getirin (include kullanarak)
3. **Connection Pool**: Sequelize otomatik yönetir, config'de ayarlanabilir
4. **Caching**: Redis gibi cache sistemleri eklenebilir

## Güvenlik Notları

- `.env` dosyasını asla git'e eklemeyin
- Production'da güçlü JWT_SECRET kullanın
- MySQL kullanıcısına minimum gerekli yetkileri verin
- SQL injection'a karşı Sequelize otomatik koruma sağlar
- Şifreler bcrypt ile hashlenir (10 rounds)

## Yedekleme

MySQL veritabanını yedeklemek için:
```bash
mysqldump -u root -p kultur_daire > backup_$(date +%Y%m%d).sql
```

Yedeği geri yüklemek için:
```bash
mysql -u root -p kultur_daire < backup_20231210.sql
```
