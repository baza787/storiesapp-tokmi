import { motion } from 'motion/react';

interface StoryAvatarProps {
  src: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hasStory?: boolean;
}

export default function StoryAvatar({ src, size = 'md', hasStory = true }: StoryAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative inline-block ${hasStory ? 'gradient-border' : ''}`}
    >
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-surface-container-low`}>
        <img 
          src={src} 
          alt="Avatar" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    </motion.div>
  );
}
