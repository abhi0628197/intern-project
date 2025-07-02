import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Spreadsheet from './components/Spreadsheet';
import ProfileDetails from './components/ProfileDetails';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Spreadsheet/>} />
        <Route path="/profile" element={<ProfileDetails />} />
      </Routes>
    </Router>
  );
};

export default App;