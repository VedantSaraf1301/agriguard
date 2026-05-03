import { Router } from 'express';
import axios from 'axios';
import FormData from 'form-data';
import upload from '../middleware/upload.js';
import { FLASK_URL } from '../config.js';

const router = Router();

router.post('/predict', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image provided' });
  }

  const form = new FormData();
  form.append('image', req.file.buffer, {
    filename: req.file.originalname || 'image.jpg',
    contentType: req.file.mimetype,
  });

  try {
    const response = await axios.post(`${FLASK_URL}/predict`, form, {
      headers: form.getHeaders(),
    });
    res.json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data || err.message;
    res.status(status).json({ error: message });
  }
});

export default router;
