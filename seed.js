const { sequelize } = require("./server/config/database");
const mysql = require("mysql2/promise");
const { User } = require("./server/models/User");
const { Event } = require("./server/models/Event");
const { Slider } = require("./server/models/Slider");
const { Page } = require("./server/models/Page");
const { MenuItem } = require("./server/models/MenuItem");
const { Announcement } = require("./server/models/Announcement");
require("dotenv").config();

const ensureDatabaseExists = async () => {
  const host = process.env.DB_HOST || "localhost";
  const user = process.env.DB_USER || "root";
  const password = process.env.DB_PASSWORD || "";
  const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;
  const dbName = process.env.DB_NAME || "kultur_daire";
  const safeDbName = String(dbName).replace(/`/g, "``");

  const connection = await mysql.createConnection({
    host,
    user,
    password,
    port,
  });
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${safeDbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  );
  await connection.end();
};

const seedData = async () => {
  try {
    await ensureDatabaseExists();

    // Foreign key kontrollerini geçici olarak devre dışı bırak
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

    // MySQL'e bağlan ve tabloları oluştur
    await sequelize.sync({ force: true }); // force: true tüm tabloları yeniden oluşturur
    console.log("MySQL bağlantısı başarılı ve tablolar oluşturuldu");

    // Foreign key kontrollerini tekrar aktif et
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    // Admin kullanıcı oluştur
    const admin = await User.create({
      username: "admin",
      email: "admin@yildiz.edu.tr",
      password: "admin123",
      role: "admin",
    });
    console.log("Admin kullanıcı oluşturuldu");

    // Örnek etkinlikler
    const events = await Event.bulkCreate([
      {
        title: "Bahar Konseri 2024",
        description:
          "YTÜ Kültür Hizmetleri tarafından düzenlenen geleneksel bahar konseri. Klasik Türk müziğinin en seçkin eserlerini dinleyeceksiniz.",
        shortDescription: "Klasik Türk müziği konseri",
        date: new Date("2024-03-15"),
        time: "19:00",
        location: "Davutpaşa Konferans Salonu",
        category: "konser",
        isActive: true,
        showInSlider: true,
        capacity: 500,
      },
      {
        title: "Modern Sanat Sergisi",
        description:
          "Genç sanatçıların modern sanat eserlerinin sergileneceği etkinlik. Resim, heykel ve mixed media çalışmaları yer alacak.",
        shortDescription: "Genç sanatçılar sergisi",
        date: new Date("2024-03-20"),
        time: "10:00",
        location: "Sanat Galerisi",
        category: "sergi",
        isActive: true,
        showInSlider: true,
      },
      {
        title: "Tiyatro Gösterimi: Hamlet",
        description:
          "Shakespeare'in ünlü eseri Hamlet, YTÜ Tiyatro Kulübü tarafından sahneleniyor.",
        shortDescription: "Shakespeare'in Hamlet oyunu",
        date: new Date("2024-03-25"),
        time: "20:00",
        location: "Merkez Amfi Tiyatro",
        category: "tiyatro",
        isActive: true,
        registrationRequired: true,
        capacity: 300,
      },
    ]);
    console.log("Örnek etkinlikler oluşturuldu");

    // Slider'lar (etkinliklerden)
    await Slider.bulkCreate([
      {
        title: "Bahar Konseri 2024",
        subtitle: "Klasik Türk Müziği",
        description: "En güzel eserleri bir arada dinleyin",
        image:
          "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200",
        buttonText: "Detayları Gör",
        eventId: events[0].id,
        order: 1,
        isActive: true,
      },
      {
        title: "Modern Sanat Sergisi",
        subtitle: "Genç Sanatçılar",
        description: "Geleceğin sanatçılarını keşfedin",
        image:
          "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=1200",
        buttonText: "Sergiye Git",
        eventId: events[1].id,
        order: 2,
        isActive: true,
      },
    ]);
    console.log("Slider'lar oluşturuldu");

    // Menü öğeleri
    await MenuItem.bulkCreate([
      {
        title: "Kurumsal",
        url: "/hakkimizda",
        order: 1,
        isActive: true,
      },
      {
        title: "Yönerge ve Yönetmelikler",
        url: "/sayfa/yonergeler",
        order: 2,
        isActive: true,
      },
      {
        title: "İletişim",
        url: "/iletisim",
        order: 3,
        isActive: true,
      },
    ]);
    console.log("Menü öğeleri oluşturuldu");

    // Sayfalar
    await Page.bulkCreate([
      {
        title: "Yönerge ve Yönetmelikler",
        slug: "yonergeler",
        content:
          "<h2>Yönerge ve Yönetmelikler</h2><p>YTÜ Kültür Hizmetleri yönerge ve yönetmelikleri burada yer alacaktır.</p>",
        metaDescription: "YTÜ Kültür Hizmetleri yönerge ve yönetmelikleri",
        isPublished: true,
      },
    ]);
    console.log("Sayfalar oluşturuldu");

    // Duyurular
    await Announcement.bulkCreate([
      {
        title: "Bahar Dönemi Etkinlikleri Başlıyor",
        content:
          "2024 Bahar dönemi kültür ve sanat etkinliklerimiz 15 Mart tarihinde başlayacaktır. Tüm öğrencilerimizi etkinliklerimize bekliyoruz.",
        type: "duyuru",
        isActive: true,
      },
      {
        title: "Atölye Kayıtları Açıldı",
        content:
          "Resim, müzik ve tiyatro atölyelerimiz için kayıtlar başlamıştır. Kontenjan sınırlıdır.",
        type: "önemli",
        isActive: true,
      },
    ]);
    console.log("Duyurular oluşturuldu");

    // Slider'lar ekle
    await Slider.bulkCreate([
      {
        title: "Bahar Dönemi Etkinlikleri",
        subtitle: "2024 Kültür ve Sanat Etkinlikleri",
        description: "Konserler, sergiler, atölyeler ve daha fazlası...",
        image:
          "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920",
        buttonText: "Keşfet",
        link: "/etkinlikler",
        order: 1,
        isActive: true,
      },
      {
        title: "Hoş Geldiniz",
        subtitle: "YTÜ Kültür Hizmetleri",
        description: "Kampüs yaşamınızı renklendiren etkinliklerimize katılın",
        image:
          "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1920",
        buttonText: "Hakkımızda",
        link: "/hakkimizda",
        order: 2,
        isActive: true,
      },
    ]);
    console.log("Slider'lar oluşturuldu");

    console.log("\n✅ Seed işlemi başarıyla tamamlandı!");
    console.log("\nGiriş Bilgileri:");
    console.log("Kullanıcı Adı: admin");
    console.log("Şifre: admin123");
    console.log("\nAdmin Panel: http://localhost:3000/admin/login");

    process.exit(0);
  } catch (error) {
    console.error("Seed hatası:", error);
    process.exit(1);
  }
};

seedData();
