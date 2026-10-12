// modelos/usuarioModelo.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const usuarioSchema = new mongoose.Schema({
  nombreUsuario: {
    type: String,
    required: [true, "Por favor ingresa el nombre de usuario"],
    unique: true,
  },
  nombreCompleto: {
    type: String,
    required: [true, "Por favor ingresa el nombre completo"],
  },
  email: {
    type: String,
    required: [true, "Por favor ingresa un email"],
    unique: true,
  },
  direccion: {
    type: String,
  },
  telefono: {
    type: String,
  },
  contraseña: {
    type: String,
    required: [true, "Por favor ingresa una contraseña"],
  },
  rol: {
    type: String,
    enum: ["usuario", "admin"],
    default: "usuario",
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
});

// Hash de la contraseña antes de guardarla en la base de datos
usuarioSchema.pre("save", async function () {
  if (!this.isModified("contraseña")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.contraseña = await bcrypt.hash(this.contraseña, salt);
});

// Método para verificar la contraseña
usuarioSchema.methods.compararContraseña = async function (
  contraseñaIngresada
) {
  return await bcrypt.compare(contraseñaIngresada, this.contraseña);
};

module.exports = mongoose.model("Usuario", usuarioSchema);
