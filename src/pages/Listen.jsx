import { useState } from 'react';
import { vocabN3 } from '../data/vocab-n3';

const Listen = () => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setPlaying(true);
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ja-JP';
      u.rate = 0.7;
      u.onend = () => setPlaying(false);
      window.speechSynthesis.speak(u);
    }
  };

  const startGame = () => {
    const vocab = [...vocabN3].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestions(vocab);
    setCurrent(0);
    setScore({ correct: 0, wrong: 0 });
    setStarted(true);
    setDone(false);
    setSelected(null);
    setTimeLeft(60);
    generateOptions(vocab[0], vocab);
    setTimeout(() => speak(vocab[0].kana), 500);
    
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timer); setDone(true); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const generateOptions = (correct, vocab) => {
    const others = vocab.filter(v => v.id !== correct.id).sort(() => Math.random() - 0.5).slice(0, 3);
    const opts = [correct.meaning, ...others.map(v => v.meaning)].sort(() => Math.random() - 0.5);
    setOptions(opts);
  };

  const handleSelect = (opt) => {
    if (selected !== null) return;
    setSelected(opt);
    if (opt === questions[current].meaning) {
      setScore(s => ({ ...s, correct: s.correct + 1 }));
    } else {
      setScore(s => ({ ...s, wrong: s.wrong + 1 }));
    }
  };

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      generateOptions(questions[current + 1], questions);
      setTimeout(() => speak(questions[current + 1].kana), 300);
    } else {
      setDone(true);
    }
  };

  if (!started) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h1>🎧 Listen Practice</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Listen and choose the meaning - 60 seconds!
        </p>
        <button className="btn btn-primary" onClick={startGame}>Start 🚀</button>
      </div>
    );
  }

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h1>🎧 Done!</h1>
        <p style={{ fontSize: '2rem' }}>{score.correct}/{score.correct + score.wrong}</p>
        <button className="btn btn-primary" onClick={startGame} style={{ marginTop: '16px' }}>Play Again</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h1>🎧 Listen</h1>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ color: timeLeft <= 10 ? '#E53935' : 'inherit' }}>⏱ {timeLeft}s</span>
          <span>✅ {score.correct}</span>
          <span>❌ {score.wrong}</span>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <button
          onClick={() => speak(questions[current].kana)}
          disabled={playing}
          style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'var(--primary)', color: 'white', border: 'none',
            fontSize: '2rem', cursor: 'pointer'
          }}
        >
          {playing ? '🔊' : '🔊'}
        </button>
        <p style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>Tap to replay</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(opt)}
            disabled={selected !== null}
            style={{
              padding: '16px',
              borderRadius: '12px',
              border: selected === opt ? (opt === questions[current].meaning ? '3px solid #4CAF50' : '3px solid #E53935') : '2px solid var(--border)',
              background: selected === opt ? (opt === questions[current].meaning ? '#E8F5E9' : '#FFEBEE') : 'var(--surface)',
              color: 'var(--text)',
              cursor: selected !== null ? 'default' : 'pointer',
              fontSize: '1rem'
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      {selected !== null && (
        <button className="btn btn-primary" onClick={next} style={{ marginTop: '16px', width: '100%' }}>
          {current < questions.length - 1 ? 'Next →' : 'Finish'}
        </button>
      )}
    </div>
  );
};

export default Listen;
