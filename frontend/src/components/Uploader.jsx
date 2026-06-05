import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import axios from 'axios';

const CLASS_MAP = {
  healthy_leaves: 'fresh',
  panama_wilt: 'panama',
  potassium_deficiency: 'potassium',
  sigatoka: 'sigatoka',
};

export default function Uploader({ onResult, onLoading }) {
  const [tab, setTab] = useState('upload');
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const inputRef = useRef(null);
  const webcamRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setPreview({ url: URL.createObjectURL(file), file });
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    fetch(imageSrc).then(r => r.blob()).then(blob => {
      const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
      setPreview({ url: imageSrc, file });
    });
  }, []);

  const analyze = async () => {
    if (!preview?.file) return;
    setIsAnalyzing(true);
    onLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', preview.file);
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
      const { data } = await axios.post(`${backendUrl}/predict`, formData);
      onResult({
        disease: CLASS_MAP[data.class] || 'fresh',
        confidence: data.confidence,
        probabilities: data.probabilities,
      });
    } catch {
      onResult({ disease: 'fresh', confidence: 0 });
    } finally {
      setIsAnalyzing(false);
      onLoading(false);
    }
  };

  const clear = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <section className="uploader-section" id="scanner">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
      >
        <p className="section-eyebrow">Step 01</p>
        <h2 className="section-heading">Scan Your Leaf</h2>

        <div className="upload-card">
          <div className="upload-card-header">
            <span className="upload-card-title">Choose input method</span>
            <div className="upload-tabs">
              <button
                className={`tab-btn ${tab === 'upload' ? 'active' : ''}`}
                onClick={() => setTab('upload')}
              >
                📁 Upload
              </button>
              <button
                className={`tab-btn ${tab === 'camera' ? 'active' : ''}`}
                onClick={() => setTab('camera')}
              >
                📷 Camera
              </button>
            </div>
          </div>

          <div className="upload-card-body">
            <AnimatePresence mode="wait">
              {tab === 'upload' && !preview && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className={`dropzone ${dragging ? 'dragging' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    onClick={() => inputRef.current.click()}
                  >
                    <div className="dropzone-icon">🍃</div>
                    <h3>Drop your leaf photo here</h3>
                    <p>or <span>click to browse</span> from your gallery</p>
                    <div className="file-types">
                      {['JPG', 'PNG', 'WEBP'].map(t => (
                        <span key={t} className="file-type-badge">.{t}</span>
                      ))}
                    </div>
                  </div>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFile(e.target.files[0])}
                  />
                </motion.div>
              )}

              {tab === 'camera' && !preview && (
                <motion.div
                  key="camera"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="camera-container">
                    <Webcam
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{ facingMode: { ideal: 'environment' } }}
                    />
                    <div className="camera-overlay">
                      <div className="camera-corner tl" />
                      <div className="camera-corner tr" />
                      <div className="camera-corner bl" />
                      <div className="camera-corner br" />
                    </div>
                  </div>
                  <button className="capture-btn" onClick={capturePhoto}>
                    📸 Capture Photo
                  </button>
                </motion.div>
              )}

              {preview && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="preview-box">
                    {isAnalyzing && <div className="scan-bar" />}
                    <img src={preview.url} alt="Leaf preview" />
                    <div className="preview-actions">
                      <button
                        className="analyze-btn"
                        onClick={analyze}
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? '🔬 Analyzing...' : '🔬 Analyze Leaf'}
                      </button>
                      <button className="clear-btn" onClick={clear}>✕ Clear</button>
                    </div>
                  </div>
                  {isAnalyzing && (
                    <div className="loading-overlay">
                      <div className="leaf-spinner">🍃</div>
                      <p className="loading-text">Running AI diagnosis...</p>
                      <p style={{ color: 'var(--subtle)', fontSize: '0.8rem' }}>
                        Processing image through neural network
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
