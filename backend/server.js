const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = 3010;

// ⛓️ الاتصال بـ MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/driversDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once('open', () => {
  console.log('✅ Connected to MongoDB');
});

// 🧠 استدعاء نموذج السائق
const Driver = require('./models/Driver');

// 📦 إعداد تخزين الصور في مجلد uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // مجلد الحفظ
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// 🧾 قراءة بيانات JSON وحقول HTML
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🧭 تقديم ملفات الواجهة من مجلد frontend (الموجود خارج backend)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// 📂 تقديم الصور من مجلد uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🔐 تسجيل الدخول الأساسي
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'AbuYahya_2025') {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

// ➕ إضافة سائق جديد
app.post('/api/add-driver', upload.fields([
  { name: 'personalPhoto' },
  { name: 'licensePhoto' },
  { name: 'idPhoto' },
  { name: 'workCardPhoto' },
]), async (req, res) => {
  try {
    const { name, phone, job } = req.body;
    const newDriver = new Driver({
      name,
      phone,
      job,
      personalPhoto: req.files['personalPhoto'][0].filename,
      licensePhoto: req.files['licensePhoto'][0].filename,
      idPhoto: req.files['idPhoto'][0].filename,
      workCardPhoto: req.files['workCardPhoto'][0].filename,
    });
    await newDriver.save();
    res.status(200).json({ message: '✅ تم إضافة السائق بنجاح' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ حدث خطأ أثناء الإضافة' });
  }
});

// 📋 عرض كل السائقين
app.get('/api/drivers', async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: '❌ فشل في جلب السائقين' });
  }
});

// 🗑️ حذف سائق حسب ID
app.delete('/api/delete-driver/:id', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ error: '❌ السائق غير موجود' });

    // حذف الصور من مجلد uploads
    const photoFields = ['personalPhoto', 'licensePhoto', 'idPhoto', 'workCardPhoto'];
    photoFields.forEach(field => {
      const filePath = path.join(__dirname, 'uploads', driver[field]);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    await Driver.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: '🗑️ تم حذف السائق بنجاح' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ فشل أثناء الحذف' });
  }
});

// 🚀 تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});