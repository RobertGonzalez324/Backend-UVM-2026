// servidor.js
require("dotenv").config({ path: "./config.env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const productoRutas = require("./rutas/productoRutas");
const authRutas = require("./rutas/authRutas");
const usuarioRutas = require("./rutas/usuarioRutas");
const favoritosRutas = require("./rutas/favoritosRutas");
const { crearAdminSiNoExiste } = require("./controladores/adminControlador");

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    message: "API funcionando correctamente",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", productoRutas);
app.use("/api/auth", authRutas);
app.use("/api/usuarios", usuarioRutas);
app.use("/api/favoritos", favoritosRutas);

app.use((err, _req, res, _next) => {
  console.error("Error no controlado:", err);
  res.status(500).json({
    mensaje: "Error interno del servidor",
    error: process.env.NODE_ENV === "production" ? undefined : err.message,
  });
});

const iniciarServidor = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("Falta MONGO_URI en config.env");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
      maxPoolSize: 10,
      autoIndex: true,
    });

    console.log("Conectado a MongoDB Atlas correctamente");
    await crearAdminSiNoExiste();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo conectar a MongoDB Atlas:", error.message);
    process.exit(1);
  }
};

iniciarServidor();
