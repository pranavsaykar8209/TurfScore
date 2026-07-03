import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateSession from './pages/CreateSession';
import TossScreen from './pages/TossScreen';
import MatchSetup from './pages/MatchSetup';
import LiveScoring from './pages/LiveScoring';

function App() {
  return (
    <BrowserRouter>
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
