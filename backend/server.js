const express = require('express');
const multer = require('multer');
const cors = require('cors');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `leaf_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files allowed'));
    }
    cb(null, true);
  },
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Banana Leaf Doctor API is running 🍌' });
});

app.post('/api/predict', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  try {
    const mlApiUrl = process.env.ML_API_URL;
    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path));

    const mlResponse = await axios.post(mlApiUrl, formData, {
      headers: { ...formData.getHeaders() },
      timeout: 30000,
    });

    fs.unlink(req.file.path, () => {});

    const mlData = mlResponse.data;
    return res.json({
      disease: mlData.disease || mlData.prediction || mlData.class || 'fresh',
      confidence: mlData.confidence || mlData.probability || 0,
      raw: mlData.probabilities || null,
    });

  } catch (error) {
    if (req.file?.path) fs.unlink(req.file.path, () => {});

    // DEMO MODE — random result when ML not connected
    if (process.env.NODE_ENV === 'development') {
      const classes = ['fresh', 'panama', 'sigatoka', 'potassium'];
      const disease = classes[Math.floor(Math.random() * classes.length)];
      return res.json({
        disease,
        confidence: (75 + Math.random() * 24).toFixed(1),
        note: 'Demo mode - ML not connected yet',
      });
    }

    return res.status(502).json({ error: 'ML model unavailable' });
  }
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`\n🍌 Banana Leaf Doctor API running on http://localhost:${PORT}\n`);
});