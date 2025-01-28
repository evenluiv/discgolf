import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react"
import HomePage from './Pages/HomePage';
import PlayPage from './Pages/PlayPage';
import SummaryPage from './Pages/SummaryPage';

function App() {

  return (
    <div className='app max-w-[1024px] mx-auto'>
      <Analytics/>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/play' element={<PlayPage />} />
          <Route path='/results' element={<SummaryPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;