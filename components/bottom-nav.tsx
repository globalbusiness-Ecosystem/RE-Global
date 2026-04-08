'use client';

import { Home, Building2, HomeIcon, MapPin, Heart, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface BottomNavProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'buy', label: 'Buy', icon: Building2 },
  { id: 'rent', label: 'Rent', icon: HomeIcon },
  { id: 'map', label: 'Map', icon: MapPin },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function BottomNav({ currentPage, setCurrentPage }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 px-2 py-3 flex justify-around items-center md:max-w-md md:mx-auto md:left-0 md:right-0 z-30">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              try {
                setCurrentPage(item.id);
              } catch (error) {
                console.error('Navigation error:', error);
                toast.error('Something went wrong, please try again');
              }
            }}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition duration-200 ${
              isActive
                ? 'text-accent'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
