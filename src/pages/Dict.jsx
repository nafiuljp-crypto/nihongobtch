import { useState } from 'react';
import { vocabN3 } from '../data/vocab-n3';
import { vocabN2 } from '../data/vocab-n2';
import { vocabN1 } from '../data/vocab-n1';

const allVocab = [...vocabN3, ...vocabN2, ...vocabN1];

const Dict = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const search = (term) => {
    setQuery(term);
    if (!term.trim()) { setResults([]); return; }
    const found = allVocab.filter(v => 
      v.kanji.includes(term) || v.kana.includes(term) || v.meaning.toLowerCase().includes(term.toLowerCase())
    ).slice(0, 30);
    setResults(found);
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

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 16px' }}>
      <h1>📖 Dictionary</h1>
      
      <input
        type="text"
        value={query}
        onChange={e => search(e.target.value)}
        placeholder="Search kanji, kana, or meaning..."
        autoFocus
        style={{
          width: '100%',
          padding: '16px',
          fontSize: '1.25rem',
          borderRadius: '12px',
          border: '2px solid var(--border)',
          background: 'var(--surface)',
          color: 'var(--text)',
          marginBottom: '16px'
        }}
      />

      {results.length > 0 && (
        <p style={{ color: 'var(--text-secondary)' }}>Found {results.length} results</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {results.map((v, i) => (
          <div key={i} style={{ 
            display: 'flex', alignItems: 'center', gap: '16px',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '16px'
          }}>
            <span onClick={() => speak(v.kana)} style={{ fontSize: '2rem', cursor: 'pointer', minWidth: '70px', textAlign: 'center' }}>
              {v.kanji}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>{v.kana}</div>
              <div style={{ color: 'var(--text)' }}>{v.meaning}</div>
            </div>
            <button onClick={() => speak(v.kana)} style={{ 
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'var(--primary)', color: 'white', border: 'none', fontSize: '1.1rem', cursor: 'pointer'
            }}>🔊</button>
          </div>
        ))}
      </div>

      {!query && (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
          Search {allVocab.length} words across N3, N2, N1
        </p>
      )}
    </div>
  );
};

export default Dict;
