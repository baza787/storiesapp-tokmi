import { motion } from 'motion/react';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { Story, User } from '../types';
import StoryAvatar from './StoryAvatar';

interface StoryCardProps {
  story: Story;
  user: User;
  onClick?: () => void;
  key?: string | number;
}

export default function StoryCard({ story, user, onClick }: StoryCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative w-full mb-12"
      onClick={onClick}
    >
      {/* User Info Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-3">
          <StoryAvatar src={user.avatar} size="md" />
          <div>
            <h3 className="text-sm font-bold tracking-tight">{user.name}</h3>
            <p className="text-xs text-on-surface-variant font-body">{story.timestamp}</p>
          </div>
        </div>
        <button className="text-xs font-bold text-primary tracking-wider uppercase">Follow</button>
      </div>

      {/* Story Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-surface-container-low">
        <img 
          src={story.imageUrl} 
          alt={story.caption} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        
        {/* Category Badge */}
        <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
          {story.category}
        </div>

        {/* Bottom Overlay Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/90 via-background/40 to-transparent">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <motion.button whileTap={{ scale: 0.8 }} className="flex items-center gap-1.5">
                <Heart size={20} className="text-on-surface hover:text-primary transition-colors" />
                <span className="text-xs font-bold">{story.likes}</span>
              </motion.button>
              <motion.button whileTap={{ scale: 0.8 }}>
                <MessageCircle size={20} className="text-on-surface" />
              </motion.button>
              <motion.button whileTap={{ scale: 0.8 }}>
                <Share2 size={20} className="text-on-surface" />
              </motion.button>
            </div>
            <motion.button whileTap={{ scale: 0.8 }}>
              <Bookmark size={20} className="text-on-surface" />
            </motion.button>
          </div>
          <p className="text-sm leading-relaxed font-body line-clamp-2 text-on-surface/90">
            <span className="font-bold mr-2">{user.username}</span>
            {story.caption}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
