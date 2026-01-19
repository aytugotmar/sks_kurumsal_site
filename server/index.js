const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { connectDB, isDbReady } = require("./config/database");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// MySQL Connection
connectDB().catch((err) => {
  console.error(
    "MySQL bağlantısı kurulamadı. Sunucu DB olmadan çalışmaya devam ediyor.",
    err
  );
});

// Return a clear 503 instead of crashing when DB is down
app.use("/api", (req, res, next) => {
  if (!isDbReady()) {
    return res.status(503).json({
      message: "Veritabanı bağlantısı yok. MySQL/XAMPP çalışıyor mu?",
      code: "DB_UNAVAILABLE",
    });
  }
  next();
});

// Import models and setup associations
const { Event } = require("./models/Event");
const { Slider } = require("./models/Slider");
const { Gallery } = require("./models/Gallery");

// Define associations
Event.hasMany(Slider, { foreignKey: "eventId", as: "sliders" });
Slider.belongsTo(Event, { foreignKey: "eventId", as: "event" });

Event.hasMany(Gallery, { foreignKey: "eventId", as: "galleries" });
Gallery.belongsTo(Event, { foreignKey: "eventId", as: "event" });

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));
app.use("/api/sliders", require("./routes/sliders"));
app.use("/api/pages", require("./routes/pages"));
app.use("/api/menu", require("./routes/menu"));
app.use("/api/gallery", require("./routes/gallery"));
app.use("/api/announcements", require("./routes/announcements"));
app.use("/api/upload", require("./routes/uploads"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Bir hata oluştu!", error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
