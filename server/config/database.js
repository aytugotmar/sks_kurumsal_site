const { Sequelize } = require("sequelize");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "kultur_daire",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: false,
    },
  }
);

let dbReady = false;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ensureDatabaseExists = async () => {
  const dbName = process.env.DB_NAME || "kultur_daire";
  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || 3306;
  const user = process.env.DB_USER || "root";
  const password = process.env.DB_PASSWORD || "";

  const safeDbName = String(dbName).replace(/`/g, "``");
  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
  });
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${safeDbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  );
  await connection.end();
};

const connectDB = async (options = {}) => {
  const {
    retries = Number.POSITIVE_INFINITY,
    delayMs = 2000,
    logEvery = 5,
  } = options;

  let attempt = 0;

  while (attempt < retries) {
    try {
      await sequelize.authenticate();
      dbReady = true;
      console.log("MySQL veritabanı bağlantısı başarılı");

      // Sync all models
      await sequelize.sync({ alter: false });
      console.log("Veritabanı modelleri senkronize edildi");

      return;
    } catch (error) {
      dbReady = false;
      attempt += 1;

      const original = error?.original || error;

      // MySQL ayakta ama DB henüz yoksa otomatik oluşturmayı dene
      if (original?.code === "ER_BAD_DB_ERROR") {
        try {
          await ensureDatabaseExists();
        } catch (createErr) {
          if (attempt % logEvery === 0) {
            console.error(
              "MySQL veritabanı oluşturulamadı. Yetkilerinizi kontrol edin.",
              createErr
            );
          }
        }
      }

      if (attempt % logEvery === 0) {
        const host = process.env.DB_HOST || "localhost";
        const port = process.env.DB_PORT || 3306;
        console.error(
          `MySQL bağlantı hatası (deneme ${attempt}${
            Number.isFinite(retries) ? `/${retries}` : ""
          }). ` + `MySQL çalışıyor mu? (${host}:${port})`,
          original
        );
      }

      await sleep(delayMs);
    }
  }

  throw new Error(
    "MySQL veritabanına bağlanılamadı (yeniden deneme limiti aşıldı)."
  );
};

const isDbReady = () => dbReady;

module.exports = { sequelize, connectDB, isDbReady };
