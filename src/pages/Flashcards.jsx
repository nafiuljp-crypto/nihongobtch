import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { vocabN3 } from '../data/vocab-n3';
import { vocabN2 } from '../data/vocab-n2';
import { vocabN1 } from '../data/vocab-n1';

const Flashcards = () => {
  const [searchParams] = useSearchParams();
  const initialLevel = searchParams.get('level') || 'n3';
  
  const [level, setLevel] = useState(initialLevel);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studied, setStudied] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const vocabData = {
      n3: vocabN3,
      n2: vocabN2,
      n1: vocabN1,
    };
    const shuffled = [...(vocabData[level] || vocabN3)].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [level]);

  const currentCard = cards[currentIndex];

  useEffect(() => {
    if (currentCard) {
      const saved = JSON.parse(localStorage.getItem('nihongo_favorites') || '[]');
      setIsFavorited(saved.some(f => f.id === currentCard.id));
    }
  }, [currentCard]);

  const toggleFav = () => {
    if (!currentCard) return;
    const fav = { id: currentCard.id, kanji: currentCard.kanji, kana: currentCard.kana, meaning: currentCard.meaning, type: 'vocab' };
    const saved = JSON.parse(localStorage.getItem('nihongo_favorites') || '[]');
    const exists = saved.find(f => f.id === fav.id);
    if (exists) {
      setIsFavorited(false);
      localStorage.setItem('nihongo_favorites', JSON.stringify(saved.filter(f => f.id !== fav.id)));
    } else {
      setIsFavorited(true);
      localStorage.setItem('nihongo_favorites', JSON.stringify([...saved, fav]));
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ja-JP';
      u.rate = 0.8;
      window.speechSynthesis.speak(u);
    }
  };

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleNext = (quality) => {
    setStudied(prev => [...prev, { card: currentCard, quality, level }]);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setCards(shuffled);
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (!currentCard) return <div>Loading...</div>;

  return (
    <div className="flashcards-page">
      <div className="flashcards-header">
        <h1>📚 Flashcards</h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
        <select value={level} onChange={e => setLevel(e.target.value)} className="level-select">
          <option value="n3">N3</option>
          <option value="n2">N2</option>
          <option value="n1">N1</option>
        </select>
        <button className="btn btn-secondary" onClick={handleShuffle}>🔀</button>
      </div>

      <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
        Card {currentIndex + 1} of {cards.length}
      </p>

      <div className="flashcard-container" onClick={handleFlip}>
        <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
          <div className="flashcard-front">
            <div className="flashcard-kanji">{currentCard.kanji}</div>
            <div className="flashcard-kana">{currentCard.kana}</div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '12px' }}>
              <button className="audio-btn" onClick={e => { e.stopPropagation(); speak(currentCard.kana); }}>🔊</button>
              <button className="fav-btn" onClick={e => { e.stopPropagation(); toggleFav(); }} style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                {isFavorited ? '⭐' : '☆'}
              </button>
            </div>
          </div>
          <div className="flashcard-back">
            <div className="flashcard-meaning">{currentCard.meaning}</div>
          </div>
        </div>
      </div>

      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '12px' }}>Click card to flip</p>

      <div className="flashcard-actions">
        <button className="action-btn wrong" onClick={() => handleNext(0)}>❌</button>
        <button className="action-btn good" onClick={() => handleNext(2)}>😊</button>
        <button className="action-btn easy" onClick={() => handleNext(3)}>😎</button>
      </div>
    </div>
  );
};

export default Flashcards;
