// استدعاء المكتبات الأساسية
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// استدعاء نموذج المشاركات
const Post = require('./models/Post');

// إنشاء تطبيق Express
const app = express();

// استخدام الميدلويرز
app.use(cors());
app.use(express.json());

// الاتصال بقاعدة MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// مسار اختبار السيرفر
app.get('/', (req, res) => {
  res.send('🚀 Server is live and healthy!');
});

// ✅ مسار جلب المشاركات من MongoDB
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في جلب المشاركات من قاعدة البيانات' });
  }
});

// ✅ مسار إنشاء مشاركة جديدة في MongoDB
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

// تحديد المنفذ الديناميكي
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});const users = [
  { email: "admin@example.com", password: "123456" }, // مستخدم تجريبي
];

// ✅ مسار تسجيل الدخول
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    res.json({ message: '✅ تسجيل دخول ناجح', user: { email } });
  } else {
    res.status(401).json({ message: '❌ بيانات غير صحيحة' });
  }
});