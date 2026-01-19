# XAMPP ile MySQL Kurulumu

## Adım 1: XAMPP'ı Başlatın

1. **XAMPP Control Panel**'i açın
2. **MySQL** satırında **Start** butonuna tıklayın
3. MySQL'in yeşil renkte "Running" durumunda olduğundan emin olun

## Adım 2: Veritabanını Oluşturun

### Yöntem 1: phpMyAdmin Kullanarak (Kolay)

1. Tarayıcınızda `http://localhost/phpmyadmin` adresine gidin
2. Sol tarafta **"New"** (Yeni) butonuna tıklayın
3. Veritabanı adı: `kultur_daire`
4. Collation: `utf8mb4_unicode_ci` seçin
5. **Create** (Oluştur) butonuna tıklayın

### Yöntem 2: SQL Komutu ile

1. phpMyAdmin'de üst menüden **SQL** sekmesine tıklayın
2. Şu komutu yapıştırın:

```sql
CREATE DATABASE kultur_daire CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. **Go** butonuna tıklayın

## Adım 3: .env Dosyasını Yapılandırın

`.env` dosyanızı oluşturun (`.env.example`'dan kopyalayın):

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# MySQL Database Configuration (XAMPP)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=kultur_daire
DB_USER=root
DB_PASSWORD=

# JWT Secret
JWT_SECRET=your_very_secure_secret_key_change_this_in_production

# Frontend URL
CLIENT_URL=http://localhost:3000
```

Not: macOS'ta `5000` portu bazen sistem servisleri tarafından kullanıldığı için geliştirmede `5001` kullanılıyor.

**Önemli:** XAMPP'da varsayılan MySQL şifresi **BOŞ** olduğu için `DB_PASSWORD=` boş bırakın!

## Adım 4: Tabloları Oluşturun ve Test Verilerini Ekleyin

Proje klasöründe terminal açın ve şu komutu çalıştırın:

```bash
npm run db:init
```

Bu komut:

- ✅ `kultur_daire` veritabanını (yeniden) oluşturur
- ✅ Tüm veritabanı tablolarını oluşturur
- ✅ Admin kullanıcısı ekler (username: `admin`, password: `admin123`)
- ✅ Örnek etkinlikler, duyurular ve diğer test verilerini ekler

## Adım 5: Uygulamayı Başlatın

```bash
npm run dev
```

Uygulama şu adreslerde çalışacak:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5001
- **Admin Panel:** http://localhost:3000/admin/login

## Giriş Bilgileri

- **Kullanıcı Adı:** admin
- **Şifre:** admin123

## Sorun Giderme

### "ECONNREFUSED" Hatası

- XAMPP Control Panel'de MySQL'in çalıştığından emin olun
- Yeşil renkte "Running" yazıyor olmalı

### "Access Denied" Hatası

- `.env` dosyasında `DB_PASSWORD=` satırının boş olduğundan emin olun
- Eğer XAMPP kurulumunda şifre belirlediyseniz, o şifreyi yazın

### Port 3306 Kullanımda

- XAMPP MySQL portunu değiştirin veya çakışan uygulamayı kapatın
- XAMPP Control Panel > MySQL > Config > my.ini > Port numarasını değiştirin

### phpMyAdmin Açılmıyor

- XAMPP'da Apache servisinin de çalıştığından emin olun
- Her iki servis (Apache + MySQL) yeşil olmalı

## MySQL Veritabanını Görüntüleme

XAMPP ile veritabanınızı görüntülemek için:

1. **phpMyAdmin:** http://localhost/phpmyadmin
2. Sol menüden `kultur_daire` veritabanını seçin
3. Tabloları görebilir, düzenleyebilir ve verileri görebilirsiniz

## Yedekleme

### Veritabanını Yedekleme (phpMyAdmin)

1. phpMyAdmin'de `kultur_daire` veritabanını seçin
2. Üst menüden **Export** (Dışa Aktar) sekmesine tıklayın
3. **Go** butonuna tıklayın
4. `.sql` dosyası indirilir

### Yedeği Geri Yükleme

1. phpMyAdmin'de `kultur_daire` veritabanını seçin
2. Üst menüden **Import** (İçe Aktar) sekmesine tıklayın
3. **Choose File** ile yedek `.sql` dosyasını seçin
4. **Go** butonuna tıklayın

## Güvenlik Notu (Production)

XAMPP **sadece geliştirme** için kullanılmalıdır! Production ortamı için:

- Gerçek bir MySQL sunucusu kullanın
- Güçlü root şifresi belirleyin
- Gereksiz servisleri kapatın
- Firewall kuralları ayarlayın
