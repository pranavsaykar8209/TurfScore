import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ScrollToTop } from './components/shared';
import Home from './pages/Home';
import CreateSession from './pages/CreateSession';
import TossScreen from './pages/TossScreen';
import MatchSetup from './pages/MatchSetup';
import LiveScoring from './features/live-scoring/LiveScoringPage';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-session" element={<CreateSession />} />
        <Route path="/toss" element={<TossScreen />} />
        <Route path="/match-setup" element={<MatchSetup />} />
        <Route path="/live-scoring" element={<LiveScoring />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
