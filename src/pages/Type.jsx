import { useState } from 'react';
import { vocabN3 } from '../data/vocab-n3';

const Type = () => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [done, setDone] = useState(false);

  const startGame = () => {
    const vocab = [...vocabN3].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestions(vocab);
    setCurrent(0);
    setScore({ correct: 0, wrong: 0 });
    setStarted(true);
    setDone(false);
    setInput('');
    setTimeLeft(60);
    
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timer); setDone(true); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const check = () => {
    const correct = questions[current].kana.replace(/[.\-]/g, '');
    const typed = input.trim().replace(/[.\-]/g, '');
    if (typed === correct) {
      setScore(s => ({ ...s, correct: s.correct + 1 }));
    } else {
      setScore(s => ({ ...s, wrong: s.wrong + 1 }));
    }
    setInput('');
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
    } else {
      setDone(true);
    }
  };

  if (!started) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h1>⌨️ Type Practice</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Type the reading in hiragana - 60 seconds!
        </p>
        <button className="btn btn-primary" onClick={startGame}>Start 🚀</button>
      </div>
    );
  }

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h1>⌨️ Done!</h1>
        <p style={{ fontSize: '2rem' }}>{score.correct}/{score.correct + score.wrong}</p>
        <button className="btn btn-primary" onClick={startGame} style={{ marginTop: '16px' }}>Play Again</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h1>⌨️ Type</h1>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ color: timeLeft <= 10 ? '#E53935' : 'inherit' }}>⏱ {timeLeft}s</span>
          <span>✅ {score.correct}</span>
          <span>❌ {score.wrong}</span>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ fontSize: '5rem', marginBottom: '8px' }}>{questions[current].kanji}</div>
        <div style={{ color: 'var(--text-secondary)' }}>{questions[current].meaning}</div>
      </div>

      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && check()}
        placeholder="Type hiragana..."
        autoFocus
        style={{
          width: '100%',
          padding: '16px',
          fontSize: '1.5rem',
          textAlign: 'center',
          borderRadius: '12px',
          border: '2px solid var(--border)',
          background: 'var(--surface)',
          color: 'var(--text)'
        }}
      />

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
        <button className="btn btn-secondary" onClick={() => { setScore(s => ({...s, wrong: s.wrong + 1})); setCurrent(c => c + 1 < questions.length ? c + 1 : (setDone(true), c)); setInput(''); }}>Skip</button>
        <button className="btn btn-primary" onClick={check}>Check</button>
      </div>

      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '16px' }}>
        Question {current + 1} of {questions.length}
      </p>
    </div>
  );
};

export default Type;
