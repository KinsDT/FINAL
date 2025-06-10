import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Thirdpage from './pages/Thirdpage'
function App() {
  return (
  <Routes>
    <Route path= "/" element={<HomePage/>} />
    <Route path="/Thirdpage" element={<Thirdpage/>}/>

  </Routes>
  );
}

export default App;
