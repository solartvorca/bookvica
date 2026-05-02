import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomeScreen from './screens/HomeScreen';
import StudyScreen from './screens/StudyScreen';
import DailyScreen from './screens/DailyScreen';
import BirthdayScreen from './screens/BirthdayScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import { useBukvitsyStore } from './store/bukvitsyStore';

function App() {
  const { initializeStore, isLoading } = useBukvitsyStore();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Загрузка мудрости предков...</p>
      </div>
    );
  }

  return (
    <Router basename="/bookvica">
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
