import { useState } from 'react';
import { vocabN3 } from '../data/vocab-n3';

const Match = () => {
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [started, setStarted] = useState(false);

  const startGame = () => {
    const vocab = [...vocabN3].sort(() => Math.random() - 0.5).slice(0, 8);
    const pairs = vocab.map(v => ({ id: v.id, kanji: v.kanji, meaning: v.meaning, type: 'kanji', uid: v.id + '-k' }))
      .concat(vocab.map(v => ({ id: v.id, kanji: v.kanji, meaning: v.meaning, type: 'meaning', uid: v.id + '-m' })))
      .sort(() => Math.random() - 0.5);
    setCards(pairs);
    setSelected([]);
    setMatched([]);
    setMoves(0);
    setTimeLeft(60);
    setGameOver(false);
    setStarted(true);
    
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const handleSelect = (card) => {
    if (selected.length === 1) {
      const [first] = selected;
      if (first.id === card.id && first.type !== card.type) {
        setMatched(m => [...m, first.uid, card.uid]);
        setSelected([]);
        setMoves(m => m + 1);
      } else {
        setSelected([card]);
        setMoves(m => m + 1);
        setTimeout(() => setSelected([]), 500);
      }
    } else {
      setSelected([card]);
    }
  };

  if (!started) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h1>🎮 Match Game</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Match kanji to meanings in 60 seconds!
        </p>
        <button className="btn btn-primary" onClick={startGame}>Start 🚀</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h1>🎮 Match</h1>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ color: timeLeft <= 10 ? '#E53935' : 'inherit' }}>⏱ {timeLeft}s</span>
          <span>Moves: {moves}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        {cards.map((card, i) => {
          const isMatched = matched.includes(card.uid);
          const isSelected = selected.some(s => s.uid === card.uid);
          return (
            <div
              key={i}
              onClick={() => !isMatched && handleSelect(card)}
              style={{
                padding: '16px 8px',
                background: isMatched ? '#4CAF50' : isSelected ? '#E53935' : 'var(--surface)',
                color: isMatched || isSelected ? 'white' : 'var(--text)',
                borderRadius: '8px',
                textAlign: 'center',
                cursor: isMatched ? 'default' : 'pointer',
                fontSize: '1.25rem',
                minHeight: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {card.type === 'kanji' ? card.kanji : card.meaning}
            </div>
          );
        })}
      </div>

      {(gameOver || matched.length === cards.length) && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <h2>{matched.length === cards.length ? '🎉 Won!' : '⏰ Time Up!'}</h2>
          <p>Moves: {moves}</p>
          <button className="btn btn-primary" onClick={startGame}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default Match;
