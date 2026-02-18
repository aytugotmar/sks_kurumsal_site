-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: localhost
-- Üretim Zamanı: 18 Şub 2026, 17:04:06
-- Sunucu sürümü: 10.4.28-MariaDB
-- PHP Sürümü: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `kultur_daire`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `announcements`
--

CREATE TABLE `announcements` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `type` enum('duyuru','haber','önemli') DEFAULT 'duyuru',
  `attachments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attachments`)),
  `isActive` tinyint(1) DEFAULT 1,
  `publishDate` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `announcements`
--

INSERT INTO `announcements` (`id`, `title`, `content`, `type`, `attachments`, `isActive`, `publishDate`, `createdAt`, `updatedAt`) VALUES
(1, 'Bahar Dönemi Etkinlikleri Başlıyor', '2024 Bahar dönemi kültür ve sanat etkinliklerimiz 15 Mart tarihinde başlayacaktır. Tüm öğrencilerimizi etkinliklerimize bekliyoruz.', 'duyuru', '[]', 1, '2026-02-18 14:25:28', '2026-02-18 14:25:28', '2026-02-18 14:25:28'),
(2, 'Atölye Kayıtları Açıldı', 'Resim, müzik ve tiyatro atölyelerimiz için kayıtlar başlamıştır. Kontenjan sınırlıdır.', 'önemli', '[]', 1, '2026-02-18 14:25:28', '2026-02-18 14:25:28', '2026-02-18 14:25:28');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `shortDescription` text DEFAULT NULL,
  `date` datetime NOT NULL,
  `endDate` datetime DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `category` enum('konser','tiyatro','sergi','söyleşi','atölye','diğer') DEFAULT 'diğer',
  `isActive` tinyint(1) DEFAULT 1,
  `showInSlider` tinyint(1) DEFAULT 0,
  `registrationRequired` tinyint(1) DEFAULT 0,
  `capacity` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `shortDescription`, `date`, `endDate`, `time`, `location`, `image`, `category`, `isActive`, `showInSlider`, `registrationRequired`, `capacity`, `createdAt`, `updatedAt`) VALUES
(1, 'Bahar Konseri 2024', 'YTÜ Kültür Hizmetleri tarafından düzenlenen geleneksel bahar konseri. Klasik Türk müziğinin en seçkin eserlerini dinleyeceksiniz.', 'Klasik Türk müziği konseri', '2024-03-15 00:00:00', NULL, '19:00', 'Davutpaşa Konferans Salonu', NULL, 'konser', 1, 1, 0, 500, '2026-02-18 14:25:28', '2026-02-18 14:25:28'),
(2, 'Modern Sanat Sergisi', 'Genç sanatçıların modern sanat eserlerinin sergileneceği etkinlik. Resim, heykel ve mixed media çalışmaları yer alacak.', 'Genç sanatçılar sergisi', '2024-03-20 00:00:00', NULL, '10:00', 'Sanat Galerisi', NULL, 'sergi', 1, 1, 0, NULL, '2026-02-18 14:25:28', '2026-02-18 14:25:28'),
(3, 'Tiyatro Gösterimi: Hamlet', 'Shakespeare\'in ünlü eseri Hamlet, YTÜ Tiyatro Kulübü tarafından sahneleniyor.', 'Shakespeare\'in Hamlet oyunu', '2024-03-25 00:00:00', NULL, '20:00', 'Merkez Amfi Tiyatro', NULL, 'tiyatro', 1, 0, 1, 300, '2026-02-18 14:25:28', '2026-02-18 14:25:28');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `galleries`
--

CREATE TABLE `galleries` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `category` varchar(255) DEFAULT NULL,
  `eventId` int(11) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `menu_items`
--

CREATE TABLE `menu_items` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `order` int(11) DEFAULT 0,
  `parentId` int(11) DEFAULT NULL,
  `isExternal` tinyint(1) DEFAULT 0,
  `isActive` tinyint(1) DEFAULT 1,
  `icon` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `pages`
--

CREATE TABLE `pages` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `metaDescription` text DEFAULT NULL,
  `isPublished` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `sliders`
--

CREATE TABLE `sliders` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `buttonText` varchar(255) DEFAULT NULL,
  `order` int(11) DEFAULT 0,
  `isActive` tinyint(1) DEFAULT 1,
  `eventId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `sliders`
--

INSERT INTO `sliders` (`id`, `title`, `subtitle`, `description`, `image`, `link`, `buttonText`, `order`, `isActive`, `eventId`, `createdAt`, `updatedAt`) VALUES
(1, 'Bahar Konseri 2024', 'Klasik Türk Müziği', 'En güzel eserleri bir arada dinleyin', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200', NULL, 'Detayları Gör', 1, 1, 1, '2026-02-18 14:25:28', '2026-02-18 14:25:28'),
(2, 'Modern Sanat Sergisi', 'Genç Sanatçılar', 'Geleceğin sanatçılarını keşfedin', 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=1200', NULL, 'Sergiye Git', 2, 1, 2, '2026-02-18 14:25:28', '2026-02-18 14:25:28'),
(3, 'Bahar Dönemi Etkinlikleri', '2024 Kültür ve Sanat Etkinlikleri', 'Konserler, sergiler, atölyeler ve daha fazlası...', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920', '/etkinlikler', 'Keşfet', 1, 1, NULL, '2026-02-18 14:25:28', '2026-02-18 14:25:28'),
(4, 'Hoş Geldiniz', 'YTÜ Kültür Hizmetleri', 'Kampüs yaşamınızı renklendiren etkinliklerimize katılın', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1920', '/hakkimizda', 'Hakkımızda', 2, 1, NULL, '2026-02-18 14:25:28', '2026-02-18 14:25:28');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','editor') DEFAULT 'editor',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'skskultur', 'admin@skskultur.yildiz.edu.tr', '$2a$10$Q2ZcZd1wElfGbmavs6G7MOYhKmGAkU03yMfPbefaEaidm45bH5Poe', 'admin', '2026-02-18 14:25:27', '2026-02-18 15:59:00');

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `galleries`
--
ALTER TABLE `galleries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `eventId` (`eventId`);

--
-- Tablo için indeksler `menu_items`
--
ALTER TABLE `menu_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parentId` (`parentId`);

--
-- Tablo için indeksler `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Tablo için indeksler `sliders`
--
ALTER TABLE `sliders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `eventId` (`eventId`);

--
-- Tablo için indeksler `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Tablo için AUTO_INCREMENT değeri `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Tablo için AUTO_INCREMENT değeri `galleries`
--
ALTER TABLE `galleries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `menu_items`
--
ALTER TABLE `menu_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Tablo için AUTO_INCREMENT değeri `pages`
--
ALTER TABLE `pages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Tablo için AUTO_INCREMENT değeri `sliders`
--
ALTER TABLE `sliders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Tablo için AUTO_INCREMENT değeri `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `galleries`
--
ALTER TABLE `galleries`
  ADD CONSTRAINT `galleries_ibfk_1` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Tablo kısıtlamaları `menu_items`
--
ALTER TABLE `menu_items`
  ADD CONSTRAINT `menu_items_ibfk_1` FOREIGN KEY (`parentId`) REFERENCES `menu_items` (`id`);

--
-- Tablo kısıtlamaları `sliders`
--
ALTER TABLE `sliders`
  ADD CONSTRAINT `sliders_ibfk_1` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
