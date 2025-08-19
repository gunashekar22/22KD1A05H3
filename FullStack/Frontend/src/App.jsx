import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ShortenerPage from './ShortenerPage';
import StatsPage from './StatsPage';

function App() {
  return (
    <Router>
      <div style={{ padding: 20 }}>
        <nav>
          <Link to="/">Shortener</Link>
        </nav>
        <Routes>
          <Route path="/" element={<ShortenerPage />} />
          <Route path="/stats/:shortCode" element={<StatsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;