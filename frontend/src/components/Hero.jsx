import { motion } from 'framer-motion';

export default function Hero({ onScanClick }) {
  const leaves = ['🍌', '🌿', '🍃', '🌱', '🍀', '🌾'];
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="leaf-grid" />
      {leaves.map((leaf, i) => (
        <span key={i} className="floating-leaf" style={{
          top: `${10 + i * 12}%`, left: `${5 + i * 16}%`,
          animationDelay: `${i * 1.2}s`, animationDuration: `${6 + i * 1.5}s`,
          fontSize: `${1.5 + (i % 3) * 0.5}rem`,
        }}>{leaf}</span>
      ))}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <div className="hero-badge">AI-Powered Plant Diagnostics</div>
        <h1 className="hero-title">
          <span className="line1">Banana Leaf</span>
          <span className="line2">Detector</span>
        </h1>
        <p className="hero-subtitle">
          Upload a photo of your banana leaf and our AI will instantly diagnose diseases —{' '}
          <strong style={{ color: 'rgba(232,245,233,0.85)' }}>Panama, Sigatoka, Potassium Deficiency</strong> — or confirm it's perfectly healthy.
        </p>
        <div className="hero-cta">
          <button className="btn-primary" onClick={onScanClick}>🔬 Scan a Leaf Now</button>
          <button className="btn-secondary" onClick={onScanClick}>Learn More ↓</button>
        </div>
        <div className="disease-tags">
          <span className="dtag panama">🔴 Panama Disease</span>
          <span className="dtag sigatoka">🟡 Sigatoka</span>
          <span className="dtag potassium">🔵 Potassium Deficiency</span>
          <span className="dtag fresh">🟢 Healthy Leaf</span>
        </div>
      </motion.div>
      <div className="scroll-indicator">
        <span className="scroll-text">Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}