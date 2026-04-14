import { useState, useEffect } from 'react';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('nihongo_favorites') || '[]');
    setFavorites(saved);
  }, []);

  const remove = (id) => {
    const updated = favorites.filter(f => f.id !== id);
    setFavorites(updated);
    localStorage.setItem('nihongo_favorites', JSON.stringify(updated));
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

  const filtered = filter === 'all' ? favorites : favorites.filter(f => f.type === filter);

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 16px' }}>
      <h1>⭐ Favorites</h1>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button onClick={() => setFilter('all')} className={`filter-btn ${filter === 'all' ? 'active' : ''}`}>
          All ({favorites.length})
        </button>
        <button onClick={() => setFilter('vocab')} className={`filter-btn ${filter === 'vocab' ? 'active' : ''}`}>
          Vocab ({favorites.filter(f => f.type === 'vocab').length})
        </button>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '4rem' }}>⭐</div>
          <h2>No favorites yet</h2>
          <p>Star words from Flashcards to save them here!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((f, i) => (
            <div key={i} style={{ 
              display: 'flex', alignItems: 'center', gap: '16px',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '16px'
            }}>
              <span onClick={() => speak(f.kana || f.kunyomi?.split('、')[0])} 
                style={{ fontSize: '2rem', cursor: 'pointer', minWidth: '70px', textAlign: 'center' }}>
                {f.kanji || f.character}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>{f.kana || `${f.onyomi} / ${f.kunyomi}`}</div>
                <div style={{ color: 'var(--text)' }}>{f.meaning}</div>
              </div>
              <button onClick={() => speak(f.kana || f.kunyomi?.split('、')[0])} style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'var(--primary)', color: 'white', border: 'none', fontSize: '1.1rem', cursor: 'pointer'
              }}>🔊</button>
              <button onClick={() => remove(f.id)} style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: '#E53935', color: 'white', border: 'none', fontSize: '1.1rem', cursor: 'pointer'
              }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
