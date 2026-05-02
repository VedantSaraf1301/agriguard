import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';
import Hero from './components/Hero';
import Uploader from './components/Uploader';
import Result from './components/Result';

function App() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    const move = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursor) cursor.style.transform = `translate(${mouseX - 6}px, ${mouseY - 6}px)`;
    };

    const animate = () => {
      followerX += (mouseX - followerX - 18) * 0.12;
      followerY += (mouseY - followerY - 18) * 0.12;
      if (follower) follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
      requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', move);
    animate();
    return () => document.removeEventListener('mousemove', move);
  }, []);

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
      <div className="cursor" />
      <div className="cursor-follower" />
      <Hero onScanClick={scrollToScanner} />

      <section className="features-section">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-label">What We Detect</p>
          <h2 className="section-title">4 Conditions,<br />Instant Results</h2>
          <div className="features-grid">
            {[
              { emoji: '🟢', title: 'Healthy Leaf', desc: 'No issues found. Your banana plant is thriving and in perfect condition.' },
              { emoji: '🔴', title: 'Panama Disease', desc: 'Fusarium wilt — a devastating soil-borne fungal disease with no chemical cure.' },
              { emoji: '🟡', title: 'Black Sigatoka', desc: 'Foliar fungal infection that destroys leaves and reduces yield significantly.' },
              { emoji: '🔵', title: 'Potassium Deficiency', desc: 'Nutrient disorder causing leaf yellowing. Fully treatable with proper fertilization.' },
            ].map((f, i) => (
              <motion.div key={i} className="feature-card"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              >
                <span className="feature-emoji">{f.emoji}</span>
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
        <p>Built with 🍃 for banana farmers · Powered by <span>AI & Machine Learning</span></p>
      </footer>
    </>
  );
}

export default App;