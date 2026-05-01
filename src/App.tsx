import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomeScreen from './screens/HomeScreen';
import StudyScreen from './screens/StudyScreen';
import DailyScreen from './screens/DailyScreen';
import BirthdayScreen from './screens/BirthdayScreen';
import FavoritesScreen from './screens/FavoritesScreen';

function App() {
  return (
    <Router basename={import.meta.env.PROD ? '/bookvisa' : ''}>
      <div className="min-h-screen bg-gradient-to-b from-bukvitsa-black via-bukvitsa-dark-blue to-bukvitsa-black text-white">
        <Navigation />
        <main className="pb-24 pt-16">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/study" element={<StudyScreen />} />
            <Route path="/daily" element={<DailyScreen />} />
            <Route path="/birthday" element={<BirthdayScreen />} />
            <Route path="/favorites" element={<FavoritesScreen />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
