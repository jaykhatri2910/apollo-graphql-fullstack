const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  class: { type: String, required: true },
  subjects: { type: [String], required: true },
  attendance: { type: Number, required: true }, // Percentage
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed
  avatar: { type: String }, // URL
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Employee', employeeSchema);
