import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ScrollToTop } from './components/shared';
import Home from './pages/Home';
import CreateSession from './pages/CreateSession';
import TossScreen from './pages/TossScreen';
import MatchSetup from './pages/MatchSetup';
import NotFound from './pages/NotFound';
import LiveScoring from './features/live-scoring/LiveScoringPage';
import { Toaster } from './components/ui';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-session" element={<CreateSession />} />
        <Route path="/session/:sessionCode/toss" element={<TossScreen />} />
        <Route path="/session/:sessionCode/match-setup" element={<MatchSetup />} />
        <Route path="/session/:sessionCode/match/:matchId/live-scoring" element={<LiveScoring />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
