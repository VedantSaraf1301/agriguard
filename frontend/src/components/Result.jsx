import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const DISEASE_INFO = {
  fresh: {
    icon: '✅',
    label: 'Diagnosis Result',
    name: 'Healthy Leaf',
    colorClass: 'fresh',
    description: 'Great news! This banana leaf appears to be in excellent health. No signs of disease or nutrient deficiency were detected.',
    tips: [
      'Maintain regular watering schedule',
      'Ensure 6–8 hours of sunlight daily',
      'Apply balanced fertilizer monthly',
      'Monitor for pests weekly',
    ],
  },
  panama: {
    icon: '🚨',
    label: 'Disease Detected',
    name: 'Panama Disease',
    colorClass: 'panama',
    description: 'Panama Disease (Fusarium wilt) detected. Severe soil-borne fungal infection. Spreads rapidly — no chemical cure exists.',
    tips: [
      'Quarantine affected plants immediately',
      'Remove and destroy infected plants — do NOT compost',
      'Disinfect all tools with bleach solution',
      'Avoid moving soil from infected areas',
      'Consider replanting with resistant cultivars',
    ],
  },
  sigatoka: {
    icon: '⚠️',
    label: 'Disease Detected',
    name: 'Black Sigatoka',
    colorClass: 'sigatoka',
    description: 'Black Sigatoka fungal infection detected. This foliar disease reduces photosynthesis and causes significant yield loss if untreated.',
    tips: [
      'Apply approved fungicide (mancozeb or trifloxystrobin)',
      'Remove severely infected leaves immediately',
      'Improve air circulation between plants',
      'Avoid overhead irrigation',
      'Rotate fungicides to prevent resistance',
    ],
  },
  potassium: {
    icon: '💛',
    label: 'Deficiency Detected',
    name: 'Potassium Deficiency',
    colorClass: 'potassium',
    description: 'Potassium deficiency detected. Causes yellowing of leaf margins and stunted growth. Fully treatable with proper fertilization.',
    tips: [
      'Apply potassium-rich fertilizer (K₂SO₄ or KCl)',
      'Test soil pH — uptake is blocked below 5.5',
      'Avoid excessive nitrogen applications',
      'Add banana peel compost to the soil',
      'Re-test leaves in 3–4 weeks after treatment',
    ],
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
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="section-eyebrow">Step 02</p>
        <h2 className="section-heading">
          AI Diagnosis <span>Complete</span>
        </h2>

        <div className={`result-card ${info.colorClass}`}>
          <div className="result-card-top">
            <div className="result-header">
              <motion.div
                className="result-icon-wrap"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 220, delay: 0.25 }}
              >
                {info.icon}
              </motion.div>
              <div>
                <p className="result-label">{info.label}</p>
                <h3 className="result-name">{info.name}</h3>
                <p className="result-confidence-text">
                  Detected with {confidence}% confidence
                </p>
              </div>
            </div>

            <div className="confidence-row">
              <span className="confidence-label">Confidence</span>
              <div className="confidence-bar-wrap">
                <motion.div
                  className="confidence-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
                />
              </div>
              <span className="confidence-value">{confidence}%</span>
            </div>

            <p className="result-description">{info.description}</p>
          </div>

          <div className="result-card-bottom">
            <div className="result-tips">
              <h4>🌿 Recommended Actions</h4>
              {info.tips.map((tip, i) => (
                <motion.div
                  key={i}
                  className="tip-item"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                >
                  {tip}
                </motion.div>
              ))}
            </div>
            <button className="retry-btn" onClick={onRetry}>
              ← Scan Another Leaf
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
