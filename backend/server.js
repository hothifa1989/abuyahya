// استدعاء المكتبات الأساسية
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// إنشاء تطبيق Express
const app = express();

// إضافة الميدلويرز
app.use(cors());
app.use(express.json());

// الاتصال بقاعدة بيانات MongoDB عبر البيئة
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// مسار رئيسي للتأكد من اشتغال السيرفر
app.get('/', (req, res) => {
  res.send('🚀 Server is live and healthy!');
});

// تحديد المنفذ الديناميكي (يُستخدم في Render)
const PORT = process.env.PORT || 3000;
app.get('/api/posts', (req, res) => {
  res.json([
    { title: "مقال أول", description: "وصف المقال الأول من السيرفر" },
    { title: "مقال ثاني", description: "تفاصيل المقال الثاني هنا" }
  ]);
});
// تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});const Post = require('./models/Post');

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في جلب المشاركات من قاعدة البيانات' });
  }
});