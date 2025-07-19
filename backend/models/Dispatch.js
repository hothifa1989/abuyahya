const mongoose = require('mongoose');

const dispatchSchema = new mongoose.Schema({
  driver: String,         // اسم السائق
  filename: String,       // اسم الملف المرفوع
  date: String,           // التاريخ بصيغة YYYY-MM-DD
  time: String            // الوقت بصيغة HH:MM
}, { timestamps: true });

module.exports = mongoose.model('Dispatch', dispatchSchema);