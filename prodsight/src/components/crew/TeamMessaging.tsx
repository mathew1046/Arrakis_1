import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare, Send, Search, Filter, Users, Clock, Pin, Reply,
  MoreVertical, Edit3, Trash2, Heart, Share, Paperclip, Smile
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

interface Message {
  id: string;
  content: string;
  author: string;
  authorRole: string;
  timestamp: string;
  channel: string;
  mentions: string[];
  attachments?: string[];
  reactions: { emoji: string; count: number; users: string[] }[];
  isPinned: boolean;
  replyTo?: string;
  edited?: boolean;
  editedAt?: string;
}

interface Channel {
  id: string;
  name: string;
  description: string;
  type: 'general' | 'department' | 'project' | 'private';
  members: string[];
  unreadCount: number;
  lastActivity: string;
}

interface TeamMessagingProps {
  currentUser?: string;
}

export const TeamMessaging: React.FC<TeamMessagingProps> = ({ 
  currentUser = 'Production Manager' 
}) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChannel, setActiveChannel] = useState<string>('general');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showChannelList, setShowChannelList] = useState(true);

  // Demo data initialization
  useEffect(() => {
    const demoChannels: Channel[] = [
      {
        id: 'general',
        name: 'General',
        description: 'General production updates and announcements',
        type: 'general',
        members: ['Production Manager', 'Sarah Wilson', 'Tom Rodriguez', 'Maria Garcia', 'Alex Chen', 'Lisa Park'],
        unreadCount: 2,
        lastActivity: '2024-01-19T15:30:00Z'
      },
      {
        id: 'cinematography',
        name: 'Cinematography',
        description: 'Camera and lighting department coordination',
        type: 'department',
        members: ['Production Manager', 'Sarah Wilson', 'Mike Johnson'],
        unreadCount: 0,
        lastActivity: '2024-01-19T14:20:00Z'
      },
      {
        id: 'vfx',
        name: 'VFX Team',
        description: 'Visual effects coordination and updates',
        type: 'department',
        members: ['Production Manager', 'Tom Rodriguez', 'Alex Chen'],
        unreadCount: 1,
        lastActivity: '2024-01-19T16:45:00Z'
      },
      {
        id: 'sound',
        name: 'Sound Department',
        description: 'Audio recording and post-production',
        type: 'department',
        members: ['Production Manager', 'Maria Garcia'],
        unreadCount: 0,
        lastActivity: '2024-01-19T12:15:00Z'
      },
      {
        id: 'scene-1a',
        name: 'Scene 1A - Coffee Shop',
        description: 'Coordination for coffee shop interior scene',
        type: 'project',
        members: ['Production Manager', 'Sarah Wilson', 'Maria Garcia', 'Lisa Park'],
        unreadCount: 3,
        lastActivity: '2024-01-19T17:00:00Z'
      }
    ];

    const demoMessages: Message[] = [
      {
        id: '1',
        content: 'Good morning everyone! Today we\'re shooting Scene 1A. Please check your call times and arrive 30 minutes early for equipment setup.',
        author: 'Production Manager',
        authorRole: 'Production Manager',
        timestamp: '2024-01-19T08:00:00Z',
        channel: 'general',
        mentions: [],
        reactions: [
          { emoji: '👍', count: 4, users: ['Sarah Wilson', 'Tom Rodriguez', 'Maria Garcia', 'Alex Chen'] }
        ],
        isPinned: true
      },
      {
        id: '2',
        content: 'Camera equipment is ready. RED Epic is calibrated and all lenses are clean. @Sarah Wilson we\'re good to go!',
        author: 'Mike Johnson',
        authorRole: 'Camera Assistant',
        timestamp: '2024-01-19T08:15:00Z',
        channel: 'cinematography',
        mentions: ['Sarah Wilson'],
        reactions: [],
        isPinned: false
      },
      {
        id: '3',
        content: 'Sound levels tested and all microphones are working perfectly. Ready for first take.',
        author: 'Maria Garcia',
        authorRole: 'Sound Engineer',
        timestamp: '2024-01-19T08:30:00Z',
        channel: 'sound',
        mentions: [],
        reactions: [
          { emoji: '🎵', count: 2, users: ['Production Manager', 'Sarah Wilson'] }
        ],
        isPinned: false
      },
      {
        id: '4',
        content: 'VFX markers are in place for the background replacement. We\'ll need clean plates after the main shots.',
        author: 'Tom Rodriguez',
        authorRole: 'VFX Supervisor',
        timestamp: '2024-01-19T09:00:00Z',
        channel: 'vfx',
        mentions: [],
        reactions: [],
        isPinned: false
      },
      {
        id: '5',
        content: 'Costumes are ready for all actors. Quick fitting check at 9:30 AM before we start rolling.',
        author: 'Lisa Park',
        authorRole: 'Costume Designer',
        timestamp: '2024-01-19T09:15:00Z',
        channel: 'scene-1a',
        mentions: [],
        reactions: [
          { emoji: '👗', count: 1, users: ['Production Manager'] }
        ],
        isPinned: false
      },
      {
        id: '6',
        content: 'Great work everyone on the morning setup! We\'re ahead of schedule. Let\'s maintain this momentum.',
        author: 'Production Manager',
        authorRole: 'Production Manager',
        timestamp: '2024-01-19T10:30:00Z',
        channel: 'general',
        mentions: [],
        reactions: [
          { emoji: '🚀', count: 5, users: ['Sarah Wilson', 'Tom Rodriguez', 'Maria Garcia', 'Alex Chen', 'Lisa Park'] }
        ],
        isPinned: false
      },
      {
        id: '7',
        content: 'Weather update: Slight chance of rain this afternoon. Should we prepare indoor backup for Scene 2B?',
        author: 'Alex Chen',
        authorRole: 'Assistant Director',
        timestamp: '2024-01-19T11:45:00Z',
        channel: 'general',
        mentions: ['Production Manager'],
        reactions: [
          { emoji: '🌧️', count: 2, users: ['Production Manager', 'Sarah Wilson'] }
        ],
        isPinned: false
      }
    ];

    setChannels(demoChannels);
    setMessages(demoMessages);
  }, []);

  // Filter messages by active channel
  const channelMessages = messages.filter(msg => msg.channel === activeChannel);
  const filteredMessages = channelMessages.filter(msg =>
    msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        content: newMessage,
        author: currentUser,
        authorRole: 'Production Manager',
        timestamp: new Date().toISOString(),
        channel: activeChannel,
        mentions: [],
        reactions: [],
        isPinned: false
      };
      
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Update channel last activity
      setChannels(channels.map(channel =>
        channel.id === activeChannel
          ? { ...channel, lastActivity: new Date().toISOString() }
          : channel
      ));
    }
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          if (existingReaction.users.includes(currentUser)) {
            // Remove reaction
            return {
              ...msg,
              reactions: msg.reactions.map(r =>
                r.emoji === emoji
                  ? {
                      ...r,
                      count: r.count - 1,
                      users: r.users.filter(u => u !== currentUser)
                    }
                  : r
              ).filter(r => r.count > 0)
            };
          } else {
            // Add reaction
            return {
              ...msg,
              reactions: msg.reactions.map(r =>
                r.emoji === emoji
                  ? {
                      ...r,
                      count: r.count + 1,
                      users: [...r.users, currentUser]
                    }
                  : r
              )
            };
          }
        } else {
          // New reaction
          return {
            ...msg,
            reactions: [
              ...msg.reactions,
              { emoji, count: 1, users: [currentUser] }
            ]
          };
        }
      }
      return msg;
    }));
  };

  const togglePin = (messageId: string) => {
    setMessages(messages.map(msg =>
      msg.id === messageId ? { ...msg, isPinned: !msg.isPinned } : msg
    ));
  };

  const activeChannelData = channels.find(c => c.id === activeChannel);

  return (
    <div className="flex h-[600px] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Channel Sidebar */}
      {showChannelList && (
        <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Team Chat
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannel(channel.id)}
                  className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${
                    activeChannel === channel.id
                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-2">
                        {channel.type === 'general' ? '#' : 
                         channel.type === 'department' ? '🏢' :
                         channel.type === 'project' ? '📁' : '🔒'}
                      </span>
                      <span className="font-medium">{channel.name}</span>
                    </div>
                    {channel.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {channel.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                    {channel.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setShowChannelList(!showChannelList)}
                className="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-2"
              >
                <Users className="h-5 w-5" />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {activeChannelData?.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {activeChannelData?.members.length} members
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-64"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`group ${message.isPinned ? 'bg-yellow-50 dark:bg-yellow-900/10 rounded-lg p-3' : ''}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {message.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {message.author}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {message.authorRole}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(message.timestamp)}
                    </span>
                    {message.isPinned && (
                      <Pin className="h-3 w-3 text-yellow-500" />
                    )}
                    {message.edited && (
                      <span className="text-xs text-gray-400">(edited)</span>
                    )}
                  </div>
                  
                  <div className="text-gray-900 dark:text-gray-100 mb-2">
                    {message.content}
                  </div>
                  
                  {message.mentions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {message.mentions.map((mention, index) => (
                        <span
                          key={index}
                          className="text-blue-600 dark:text-blue-400 text-sm bg-blue-100 dark:bg-blue-900/20 px-2 py-1 rounded"
                        >
                          @{mention}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {message.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {message.reactions.map((reaction, index) => (
                        <button
                          key={index}
                          onClick={() => addReaction(message.id, reaction.emoji)}
                          className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm transition-colors ${
                            reaction.users.includes(currentUser)
                              ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          <span>{reaction.emoji}</span>
                          <span>{reaction.count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => addReaction(message.id, '👍')}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => togglePin(message.id)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <Pin className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    <Reply className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Message #${activeChannelData?.name}...`}
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  <Paperclip className="h-4 w-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  <Smile className="h-4 w-4" />
                </button>
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
