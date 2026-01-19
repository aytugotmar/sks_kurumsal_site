const mysql = require("mysql2/promise");
require("dotenv").config();

const resetDatabase = async () => {
  try {
    const host = process.env.DB_HOST || "localhost";
    const user = process.env.DB_USER || "root";
    const password = process.env.DB_PASSWORD || "";
    const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;
    const dbName = process.env.DB_NAME || "kultur_daire";
    const safeDbName = String(dbName).replace(/`/g, "``");

    // Root connection (without database)
    const connection = await mysql.createConnection({
      host,
      user,
      password,
      port,
    });

    console.log("MySQL bağlantısı kuruldu");

    // Drop database if exists
    await connection.query(`DROP DATABASE IF EXISTS \`${safeDbName}\``);
    console.log(`Eski veritabanı silindi: ${dbName}`);

    // Create database
    await connection.query(
      `CREATE DATABASE \`${safeDbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`Yeni veritabanı oluşturuldu: ${dbName}`);

    await connection.end();
    console.log("✅ Veritabanı sıfırlandı, şimdi seed çalıştırabilirsiniz!");
    process.exit(0);
  } catch (error) {
    console.error("Hata:", error);
    process.exit(1);
  }
};

resetDatabase();
