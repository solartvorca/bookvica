import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Book, Calendar, User, Star } from 'lucide-react';

export default function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Главная', id: 'home' },
    { path: '/study', icon: Book, label: 'Учебник', id: 'study' },
    { path: '/daily', icon: Calendar, label: 'Послание дня', id: 'daily' },
    { path: '/birthday', icon: User, label: 'По дате', id: 'birthday' },
    { path: '/favorites', icon: Star, label: 'Избранное', id: 'favorites' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bukvitsa-dark-blue/95 backdrop-blur border-t border-bukvitsa-gold/30 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-around items-center">
          {navItems.map(({ path, icon: Icon, label, id }) => (
            <Link
              key={id}
              to={path}
              className={`flex flex-col items-center gap-1 py-3 px-4 transition ${
                isActive(path)
                  ? 'text-bukvitsa-gold border-b-2 border-bukvitsa-gold'
                  : 'text-gray-400 hover:text-bukvitsa-cream'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs font-semibold hidden sm:inline">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
