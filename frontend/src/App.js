import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';
import Hero from './components/Hero';
import Uploader from './components/Uploader';
import Result from './components/Result';

const FEATURES = [
  {
    bg: 'rgba(34,197,94,0.12)',
    icon: '🟢',
    title: 'Healthy Leaf',
    desc: 'No issues detected. Your banana plant is thriving and in optimal condition.',
  },
  {
    bg: 'rgba(239,68,68,0.12)',
    icon: '🔴',
    title: 'Panama Disease',
    desc: 'Fusarium wilt — a devastating soil-borne fungal infection with no chemical cure.',
  },
  {
    bg: 'rgba(234,179,8,0.12)',
    icon: '🟡',
    title: 'Black Sigatoka',
    desc: 'Foliar fungal infection that reduces photosynthesis and causes significant yield loss.',
  },
  {
    bg: 'rgba(96,165,250,0.12)',
    icon: '🔵',
    title: 'Potassium Deficiency',
    desc: 'Nutrient disorder causing leaf yellowing. Fully treatable with proper fertilization.',
  },
];

function App() {
  const [result, setResult] = useState(null);

  const scrollToScanner = () => {
    document.getElementById('scanner')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleResult = (data) => {
    setResult(data);
    setTimeout(() => {
      document.querySelector('.result-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <>
      <Hero onScanClick={scrollToScanner} />

      <section className="features-section">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <p className="section-eyebrow">What We Detect</p>
          <h2 className="section-heading">
            4 conditions,{' '}
            <span>instant results</span>
          </h2>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                className="feature-card"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="feature-icon-wrap" style={{ background: f.bg }}>
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <AnimatePresence>
        {!result && <Uploader onResult={handleResult} onLoading={() => {}} />}
      </AnimatePresence>

      <AnimatePresence>
        {result && <Result result={result} onRetry={() => setResult(null)} />}
      </AnimatePresence>

      <footer>
        <p className="footer-text">
          Built with 🌿 for banana farmers · Powered by <span>AI & Machine Learning</span>
        </p>
      </footer>
    </>
  );
}

export default App;
