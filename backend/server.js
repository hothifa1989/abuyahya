const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// النماذج
const Post = require('./models/Post');
const Dispatch = require('./models/Dispatch');

const app = express();

// ميدلويرز
app.use(cors());
app.use(express.json());

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB متصل'))
.catch((err) => console.error('❌ خطأ في الاتصال بـ MongoDB:', err));

// اختبار السيرفر
app.get('/', (req, res) => {
  res.send('🚀 السيرفر شغال');
});

// تسجيل دخول للمستخدمين العاديين
const users = [
  { email: "admin@example.com", password: "123456", role: "admin" }
];

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    res.json({ message: '✅ تسجيل الدخول ناجح', user: { email: user.email, role: user.role } });
  } else {
    res.status(401).json({ message: '❌ بيانات خاطئة' });
  }
});

// المشاركات - Get & Post
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: '❌ خطأ في جلب المشاركات' });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const { title, description } = req.body;
    const newPost = new Post({ title, description });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: '❌ فشل في حفظ المشاركة' });
  }
});

// رفع الإرسالية من السائق
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const driverEmail = req.headers['driver-email'];
    const folderPath = `uploads/${driverEmail}`;
    fs.mkdirSync(folderPath, { recursive: true });
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    const date = new Date();
    const timestamp = date.toISOString().replace(/[:.]/g, "-");
    cb(null, `dispatch-${timestamp}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

app.post("/api/dispatch/upload", upload.single("dispatchImage"), async (req, res) => {
  const driverEmail = req.headers['driver-email'];
  const dateObj = new Date();
  const date = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
  const time = dateObj.toTimeString().split(':').slice(0,2).join(':'); // HH:MM
  const filename = req.file.filename;

  try {
    const dispatch = new Dispatch({
      driver: driverEmail,
      filename,
      date,
      time
    });
    await dispatch.save();
    res.status(201).json({ message: "✅ تم حفظ الإرسالية مع تفاصيلها" });
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في حفظ البيانات" });
  }
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 السيرفر يعمل على http://localhost:${PORT}`);
});