import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_STORIES, MOCK_USERS, Story, User } from './types';
import StoryCard from './components/StoryCard';
import GlassNav from './components/GlassNav';
import StoryAvatar from './components/StoryAvatar';
import AdminApp from './AdminApp';
import { Bell, Search, Settings, Grid, Bookmark, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pb-32 pt-20"
          >
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-50 glass px-6 py-4 flex items-center justify-between">
              <h1 className="text-2xl font-extrabold tracking-tighter text-primary">TOKMI</h1>
              <div className="flex items-center gap-4">
                <motion.button whileTap={{ scale: 0.9 }}>
                  <Search size={22} className="text-on-surface-variant" />
                </motion.button>
                <motion.button whileTap={{ scale: 0.9 }} className="relative">
                  <Bell size={22} className="text-on-surface-variant" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
                </motion.button>
              </div>
            </div>

            {/* Stories Feed */}
            <div className="max-w-xl mx-auto px-4">
              <AnimatePresence mode="popLayout">
                {MOCK_STORIES.map((story) => {
                  const user = MOCK_USERS.find(u => u.id === story.userId)!;
                  return (
                    <StoryCard 
                      key={story.id} 
                      story={story} 
                      user={user} 
                    />
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      case 'admin':
        return <AdminApp />;
      case 'profile':
        return <ProfileView user={MOCK_USERS[0]} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-screen text-on-surface-variant">
            <p className="text-sm font-bold uppercase tracking-widest">Coming Soon</p>
            <p className="text-xs mt-2 font-body">This feature is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <AnimatePresence mode="wait">
        {renderScreen()}
      </AnimatePresence>
      
      <GlassNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
    </div>
  );
}

function ProfileView({ user }: { user: User }) {
  const [activeProfileTab, setActiveProfileTab] = useState('grid');
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="pb-32 pt-20"
    >
      {/* Profile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 glass px-6 py-4 flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight">{user.username}</h2>
        <div className="flex items-center gap-4">
          <motion.button whileTap={{ scale: 0.9 }}>
            <Settings size={22} className="text-on-surface-variant" />
          </motion.button>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6">
        {/* Profile Info */}
        <div className="flex flex-col items-center text-center mb-10">
          <StoryAvatar src={user.avatar} size="xl" />
          <h1 className="text-2xl font-extrabold mt-6 tracking-tight">{user.name}</h1>
          <p className="text-sm text-on-surface-variant mt-2 max-w-xs font-body leading-relaxed">
            {user.bio}
          </p>
          
          <div className="flex items-center gap-8 mt-8">
            <div className="text-center">
              <p className="text-lg font-extrabold tracking-tight">{user.followers}</p>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-extrabold tracking-tight">{user.following}</p>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Following</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-extrabold tracking-tight">142</p>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Stories</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full mt-10">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="flex-1 gradient-primary py-3.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
            >
              Edit Profile
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3.5 rounded-full bg-surface-container-low text-xs font-bold uppercase tracking-widest"
            >
              Share
            </motion.button>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="flex items-center justify-around border-b border-surface-container-low mb-6">
          {[
            { id: 'grid', icon: Grid },
            { id: 'saved', icon: Bookmark },
            { id: 'liked', icon: Heart }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeProfileTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveProfileTab(tab.id)}
                className={`flex-1 py-4 flex justify-center relative transition-colors duration-300 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}
              >
                <Icon size={20} />
                {isActive && (
                  <motion.div 
                    layoutId="profileTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-3 gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="aspect-square bg-surface-container-low overflow-hidden rounded-md"
            >
              <img 
                src={`https://picsum.photos/seed/profile-${i}/400/400`} 
                alt="Post" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
