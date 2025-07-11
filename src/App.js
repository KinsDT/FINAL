import React from 'react';
import "./App.css";
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Thirdpage from './pages/Thirdpage'
import Secondpage from './pages/Secondpage';
import FourthPage from './pages/Fourthpage';
import Fifthpage from './pages/Fifthpage';
function App() {
  return (
  <Routes>
    <Route path="/Fourthpage" element={<FourthPage/>}/>
    <Route path= "/" element={<HomePage/>} />
    <Route path="/Thirdpage" element={<Thirdpage/>}/>
    <Route path="/Secondpage" element={<Secondpage />} />
    <Route path="/Fifthpage" element={<Fifthpage />} />

  </Routes>
  );
}

export default App;
