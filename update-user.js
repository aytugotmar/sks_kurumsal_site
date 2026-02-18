const { sequelize } = require("./server/config/database");
const { User } = require("./server/models/User");
require("dotenv").config();

const updateUser = async () => {
  try {
    // Veritabanına bağlan
    await sequelize.authenticate();
    console.log("Veritabanı bağlantısı başarılı");

    // Mevcut kullanıcıyı bul ve güncelle
    const user = await User.findOne({
      where: { username: "admin" }, // veya { email: "admin@yildiz.edu.tr" }
    });

    if (!user) {
      console.log("Kullanıcı bulunamadı!");
      return;
    }

    console.log("Mevcut kullanıcı bulundu:", user.username);

    // Yeni bilgileri güncelle
    await user.update({
      username: "skskultur", // İstediğiniz kullanıcı adı
      email: "admin@skskultur.yildiz.edu.tr", // İstediğiniz email
      password: "SKSKultursite2026", // İstediğiniz şifre (otomatik hashlenecek)
    });

    console.log("✅ Kullanıcı bilgileri başarıyla güncellendi!");
    console.log("Yeni kullanıcı adı:", user.username);
    console.log("Yeni email:", user.email);
    console.log("Şifre hashlenmiş olarak kaydedildi");

    process.exit(0);
  } catch (error) {
    console.error("❌ Hata oluştu:", error);
    process.exit(1);
  }
};

updateUser();
