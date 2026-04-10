export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isFollowing: boolean;
  bio?: string;
  followers: string;
  following: string;
}

export interface Story {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string;
  timestamp: string;
  category: string;
  likes: number;
}

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Julianne Moore',
    username: '@jules_moore',
    avatar: 'https://picsum.photos/seed/user1/200/200',
    isFollowing: true,
    bio: 'Visual storyteller & digital curator. Exploring the intersection of light and shadow.',
    followers: '12.4K',
    following: '842'
  },
  {
    id: '2',
    name: 'Marcus Chen',
    username: '@marcus_vibe',
    avatar: 'https://picsum.photos/seed/user2/200/200',
    isFollowing: false,
    followers: '8.1K',
    following: '1.2K'
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    username: '@elena_r',
    avatar: 'https://picsum.photos/seed/user3/200/200',
    isFollowing: true,
    followers: '45.2K',
    following: '231'
  }
];

export const MOCK_STORIES: Story[] = [
  {
    id: 's1',
    userId: '1',
    imageUrl: 'https://picsum.photos/seed/story1/800/1200',
    caption: 'Golden hour in the city of lights. Everything feels like a dream.',
    timestamp: '2h ago',
    category: 'Lifestyle',
    likes: 1240
  },
  {
    id: 's2',
    userId: '2',
    imageUrl: 'https://picsum.photos/seed/story2/800/1200',
    caption: 'Minimalist architecture in Tokyo. The lines are perfect.',
    timestamp: '4h ago',
    category: 'Design',
    likes: 856
  },
  {
    id: 's3',
    userId: '3',
    imageUrl: 'https://picsum.photos/seed/story3/800/1200',
    caption: 'New editorial shoot for Vogue. Coming soon.',
    timestamp: '6h ago',
    category: 'Fashion',
    likes: 3421
  },
  {
    id: 's4',
    userId: '1',
    imageUrl: 'https://picsum.photos/seed/story4/800/1200',
    caption: 'Morning coffee and quiet reflections.',
    timestamp: '8h ago',
    category: 'Lifestyle',
    likes: 920
  }
];
