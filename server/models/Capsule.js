const mongoose = require('mongoose');

const CapsuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  hint: { type: String, required: true },
  color: { type: String, required: true },
  openAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Capsule', CapsuleSchema);