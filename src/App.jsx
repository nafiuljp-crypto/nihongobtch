import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Flashcards from './pages/Flashcards';
import Quiz from './pages/Quiz';
import Kanji from './pages/Kanji';
import Progress from './pages/Progress';
import Match from './pages/Match';
import Type from './pages/Type';
import Listen from './pages/Listen';
import Speed from './pages/Speed';
import Dict from './pages/Dict';
import Favorites from './pages/Favorites';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/kanji" element={<Kanji />} />
            <Route path="/match" element={<Match />} />
            <Route path="/type" element={<Type />} />
            <Route path="/listen" element={<Listen />} />
            <Route path="/speed" element={<Speed />} />
            <Route path="/dict" element={<Dict />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/progress" element={<Progress />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
