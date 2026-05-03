import { motion } from 'framer-motion';

export default function Hero({ onScanClick }) {
  return (
    <>
      <nav className="navbar">
        <a className="nav-logo" href="/">
          <span className="nav-logo-icon">🌿</span>
          AgriGuard
        </a>
        <div className="nav-center">
          <button className="nav-link" onClick={onScanClick}>Features</button>
          <button className="nav-link" onClick={onScanClick}>How it works</button>
        </div>
        <button className="nav-cta" onClick={onScanClick}>Try Now →</button>
      </nav>

      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-badge">
            <span className="badge-dot" />
            AI-Powered Plant Diagnostics
          </div>

          <h1 className="hero-title">
            Detect Banana Leaf<br />
            <span className="accent">Diseases Instantly</span>
          </h1>

          <p className="hero-sub">
            Upload a photo of your banana leaf and get AI-powered diagnosis in seconds.
            Identify Panama Disease, Black Sigatoka, Potassium Deficiency, and more.
          </p>

          <div className="hero-actions">
            <button className="btn-primary" onClick={onScanClick}>
              🔬 Scan a Leaf Now
            </button>
            <button className="btn-ghost" onClick={onScanClick}>
              Learn More ↓
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-val">98.2%</span>
              <span className="stat-label">Accuracy</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">&lt;3s</span>
              <span className="stat-label">Analysis Time</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">4</span>
              <span className="stat-label">Conditions</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">Free</span>
              <span className="stat-label">Always</span>
            </div>
          </div>

          <div className="disease-strip">
            <span className="dtag panama"><span className="dtag-dot" />Panama Disease</span>
            <span className="dtag sigatoka"><span className="dtag-dot" />Black Sigatoka</span>
            <span className="dtag potassium"><span className="dtag-dot" />Potassium Deficiency</span>
            <span className="dtag fresh"><span className="dtag-dot" />Healthy Leaf</span>
          </div>
        </motion.div>
      </section>
    </>
  );
}
