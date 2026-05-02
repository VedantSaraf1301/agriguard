import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const DISEASE_INFO = {
  fresh: {
    icon: '✅', label: 'Diagnosis Result', name: 'Healthy Leaf', colorClass: 'fresh',
    description: 'Great news! This banana leaf appears to be in excellent health. No signs of disease or nutrient deficiency were detected.',
    tips: ['Maintain regular watering schedule', 'Ensure 6–8 hrs sunlight daily', 'Apply balanced fertilizer monthly', 'Monitor for pests weekly'],
  },
  panama: {
    icon: '🚨', label: 'Disease Detected', name: 'Panama Disease', colorClass: 'panama',
    description: 'Panama Disease (Fusarium wilt) detected. Severe soil-borne fungal infection. Spreads rapidly — no chemical cure exists.',
    tips: ['Quarantine affected plants immediately', 'Remove and destroy infected plants — do NOT compost', 'Disinfect all tools', 'Avoid moving soil from infected areas', 'Consider resistant cultivar replanting'],
  },
  sigatoka: {
    icon: '⚠️', label: 'Disease Detected', name: 'Sigatoka Disease', colorClass: 'sigatoka',
    description: 'Black Sigatoka fungal infection detected. This foliar disease reduces photosynthesis and causes significant yield loss if untreated.',
    tips: ['Apply approved fungicide (mancozeb or trifloxystrobin)', 'Remove severely infected leaves', 'Improve air circulation', 'Avoid overhead irrigation', 'Rotate fungicides to prevent resistance'],
  },
  potassium: {
    icon: '💛', label: 'Deficiency Detected', name: 'Potassium Deficiency', colorClass: 'potassium',
    description: 'Potassium deficiency detected. Causes yellowing of leaf margins and stunted growth. Fully treatable with proper fertilization.',
    tips: ['Apply potassium-rich fertilizer (K₂SO₄ or KCl)', 'Test soil pH — uptake blocked below 5.5', 'Avoid excessive nitrogen', 'Add banana peel compost', 'Re-test leaves in 3–4 weeks'],
  },
};

export default function Result({ result, onRetry }) {
  const [barWidth, setBarWidth] = useState(0);
  const info = DISEASE_INFO[result?.disease] || DISEASE_INFO.fresh;
  const confidence = parseFloat(result?.confidence || 0);

  useEffect(() => {
    const t = setTimeout(() => setBarWidth(confidence), 300);
    return () => clearTimeout(t);
  }, [confidence]);

  if (!result) return null;

  return (
    <section className="result-section">
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
        <p className="section-label">Step 02 — Results</p>
        <h2 className="section-title" style={{ marginBottom: '2rem' }}>AI Diagnosis<br />Complete</h2>
        <div className={`result-card ${info.colorClass}`}>
          <div className="result-header">
            <motion.span className="result-icon"
              initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}>
              {info.icon}
            </motion.span>
            <div>
              <p className="result-label">{info.label}</p>
              <h3 className="result-name">{info.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(232,245,233,0.5)' }}>Detected with {confidence}% confidence</p>
            </div>
          </div>
          <div className="confidence-row">
            <span className="confidence-label">Confidence</span>
            <div className="confidence-bar-wrap">
              <motion.div className="confidence-bar-fill"
                initial={{ width: 0 }} animate={{ width: `${barWidth}%` }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }} />
            </div>
            <span className="confidence-value">{confidence}%</span>
          </div>
          <p className="result-description">{info.description}</p>
          <div className="result-tips">
            <h4>🌿 Recommended Actions</h4>
            {info.tips.map((tip, i) => (
              <motion.div key={i} className="tip-item"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}>
                {tip}
              </motion.div>
            ))}
          </div>
          <button className="retry-btn" onClick={onRetry}>← Scan Another Leaf</button>
        </div>
      </motion.div>
    </section>
  );
}