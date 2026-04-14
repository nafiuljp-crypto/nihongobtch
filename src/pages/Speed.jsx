import { useState } from 'react';
import { vocabN3 } from '../data/vocab-n3';

const Speed = () => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [done, setDone] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');

  const times = { easy: 10, medium: 7, hard: 5 };

  const startGame = () => {
    const vocab = [...vocabN3].sort(() => Math.random() - 0.5).slice(0, 20);
    setQuestions(vocab);
    setCurrent(0);
    setScore({ correct: 0, wrong: 0 });
    setStarted(true);
    setDone(false);
    setTimeLeft(times[difficulty]);
    
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          setDone(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const handleAnswer = (correct) => {
    if (correct) setScore(s => ({ ...s, correct: s.correct + 1 }));
    else setScore(s => ({ ...s, wrong: s.wrong + 1 }));
    
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setTimeLeft(times[difficulty]);
    } else {
      setDone(true);
    }
  };

  if (!started) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h1>⚡ Speed Review</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Quick! Know it or skip - {times[difficulty]}s per question
        </p>
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)} 
          style={{ padding: '12px', fontSize: '1rem', marginBottom: '24px', borderRadius: '8px' }}>
          <option value="easy">🟢 Easy (10s)</option>
          <option value="medium">🟡 Medium (7s)</option>
          <option value="hard">🔴 Hard (5s)</option>
        </select>
        <br />
        <button className="btn btn-primary" onClick={startGame}>Start ⚡</button>
      </div>
    );
  }

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h1>⚡ Done!</h1>
        <p style={{ fontSize: '2rem' }}>{score.correct}/{score.correct + score.wrong}</p>
        <button className="btn btn-primary" onClick={startGame} style={{ marginTop: '16px' }}>Play Again</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h1>⚡ Speed</h1>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ color: timeLeft <= 2 ? '#E53935' : 'inherit', fontSize: '1.25rem' }}>⏱ {timeLeft}s</span>
          <span>✅ {score.correct}</span>
          <span>❌ {score.wrong}</span>
        </div>
      </div>

      <div className="progress-bar" style={{ marginBottom: '24px' }}>
        <div className="progress-bar-fill" style={{ width: `${((current + 1) / questions.length) * 100}%` }}></div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ fontSize: '5rem', marginBottom: '8px' }}>{questions[current].kanji}</div>
        <div style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>{questions[current].kana}</div>
        <div style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>{questions[current].meaning}</div>
      </div>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <button onClick={() => handleAnswer(false)} 
          style={{ padding: '20px 40px', fontSize: '2rem', background: '#E53935', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>
          ❌
        </button>
        <button onClick={() => handleAnswer(true)} 
          style={{ padding: '20px 40px', fontSize: '2rem', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>
          ✅
        </button>
      </div>

      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '16px' }}>
        Press ← or → keys, or click buttons
      </p>
    </div>
  );
};

export default Speed;
