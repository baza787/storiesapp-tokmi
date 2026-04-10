import { motion } from 'motion/react';
import { Home, Search, PlusSquare, Heart, User, Shield } from 'lucide-react';

interface GlassNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function GlassNav({ activeTab, onTabChange }: GlassNavProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'discover', icon: Search, label: 'Discover' },
    { id: 'create', icon: PlusSquare, label: 'Create' },
    { id: 'activity', icon: Heart, label: 'Activity' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'admin', icon: Shield, label: 'Admin' },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
      <div className="glass rounded-xl px-6 py-4 flex items-center justify-between shadow-2xl shadow-primary/10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => onTabChange(tab.id)}
              className="relative p-2"
            >
              <Icon 
                size={24} 
                className={`transition-colors duration-300 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`} 
              />
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
