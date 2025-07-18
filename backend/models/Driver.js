const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  job: { type: String, required: true },
  personalPhoto: { type: String, required: true },
  licensePhoto: { type: String, required: true },
  idPhoto: { type: String, required: true },
  workCardPhoto: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);