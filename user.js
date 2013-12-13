//Sample Mongoose Schema (Person class)
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var usuarioSchema = new Schema({
    usuario: String,
    nombre: String,
    apellido: String,
    email: String,
    empresa: String,
    telefono: String,
    latitud: String,
    longitud: String
});

//Export the schema
module.exports = mongoose.model('Usuario', usuarioSchema);