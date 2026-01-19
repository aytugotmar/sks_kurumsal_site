# YTÜ Kültür Hizmetleri - Hızlı Başlangıç

## 🚀 3 Adımda Kurulum

### Adım 1: Bağımlılıkları Yükleyin

```powershell
# Ana dizinde
npm install

# Client dizininde
cd client
npm install
cd ..
```

### Adım 2: MySQL'i Başlatın

- XAMPP kullanıyorsanız: XAMPP Control Panel > **MySQL** > **Start**
- Veritabanı adı: `kultur_daire`

### Adım 3: Örnek Verileri Yükleyin

```powershell
# Seed script ile örnek verileri yükleyin
npm run seed
```

### Adım 4: Projeyi Çalıştırın

```powershell
# Hem backend hem frontend'i çalıştırın
npm run dev
```

## 📱 Erişim Adresleri

- **Ana Sayfa**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login
- **Backend API**: http://localhost:5001

## 🔑 Giriş Bilgileri

```
Kullanıcı Adı: admin
Şifre: admin123
```

## ✅ Kontrol Listesi

- [ ] Node.js yüklü mü? (`node --version`)
- [ ] MySQL çalışıyor mu?
- [ ] Bağımlılıklar yüklendi mi?
- [ ] Seed çalıştırıldı mı?
- [ ] Dev server başladı mı?

## 🎯 Hızlı Test

1. http://localhost:3000 adresini açın
2. Ana sayfada slider ve etkinlikleri görmelisiniz
3. http://localhost:3000/admin/login adresinden giriş yapın
4. Dashboard'u görmelisiniz

## ❗ Sorun Giderme

### MySQL (ECONNREFUSED) Hatası

- MySQL servisinin çalıştığından emin olun (XAMPP > MySQL Running)
- Gerekirse `.env` oluşturun (`.env.example`'dan kopyalayın)

### Port Kullanımda Hatası

```powershell
# 3000 veya 5000 portunu kullanan işlemi bulun
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# İşlemi sonlandırın (PID numarasıyla)
taskkill /PID <PID_NUMARASI> /F
```

### Bağımlılık Hatası

```powershell
# node_modules'ü silin ve tekrar yükleyin
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force client\node_modules
npm run install-all
```

## 📚 Sonraki Adımlar

1. ✅ Giriş yapın ve dashboard'u inceleyin
2. ✅ Yeni bir etkinlik ekleyin
3. ✅ Slider'ları düzenleyin
4. ✅ Menü yapısını özelleştirin
5. ✅ Yeni sayfalar oluşturun

## 🎨 Özelleştirme

### Renk Değiştirme

`client/src/index.css` dosyasındaki CSS değişkenlerini düzenleyin:

```css
:root {
  --primary-color: #1e3a8a; /* Ana renk */
  --secondary-color: #3b82f6; /* İkinci renk */
  --accent-color: #f59e0b; /* Vurgu rengi */
}
```

### Logo Değiştirme

`client/src/components/Layout/Header.js` dosyasındaki logo bölümünü düzenleyin

## 📞 Yardım

Sorun yaşarsanız README.md dosyasına bakın veya issue açın.

---

**Başarılar! 🎉**
