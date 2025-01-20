import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import PlayPage from './Pages/PlayPage';
import SummaryPage from './Pages/SummaryPage';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/play' element={<PlayPage />} />
        <Route path='/results' element={<SummaryPage />} />
      </Routes>
    </Router>
  );
}

export default App;