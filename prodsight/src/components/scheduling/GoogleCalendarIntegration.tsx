import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Plus, Users, Clock, MapPin, Bell, RefreshCw, Settings,
  CheckCircle, AlertCircle, ExternalLink, Download, Upload
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  attendees: string[];
  type: 'shoot' | 'meeting' | 'prep' | 'wrap' | 'travel';
  status: 'confirmed' | 'tentative' | 'cancelled';
  sceneNumbers?: string[];
  equipment?: string[];
  notes?: string;
  googleEventId?: string;
  synced: boolean;
}

interface GoogleCalendarIntegrationProps {
  onEventCreated?: (event: CalendarEvent) => void;
  onEventUpdated?: (event: CalendarEvent) => void;
}

export const GoogleCalendarIntegration: React.FC<GoogleCalendarIntegrationProps> = ({
  onEventCreated,
  onEventUpdated
}) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startTime: '09:00',
    endTime: '18:00',
    location: '',
    attendees: [] as string[],
    type: 'shoot' as CalendarEvent['type'],
    sceneNumbers: [] as string[],
    equipment: [] as string[]
  });

  // Demo data initialization
  useEffect(() => {
    const demoEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Scene 1A-1B: Coffee Shop Interior',
        description: 'Shooting coffee shop scenes with lead actors. Interior setup with 20 background actors.',
        startTime: '2024-02-15T08:00:00Z',
        endTime: '2024-02-15T18:00:00Z',
        location: 'Mumbai Film City Studio 7',
        attendees: ['Director', 'Cinematographer', 'Lead Actor 1', 'Lead Actor 2', 'Script Supervisor'],
        type: 'shoot',
        status: 'confirmed',
        sceneNumbers: ['1A', '1B'],
        equipment: ['RED Epic Camera', 'Lighting Kit', 'Sound Equipment'],
        notes: 'Early call time for setup. Catering arranged for 25 people.',
        googleEventId: 'google_event_123',
        synced: true
      },
      {
        id: '2',
        title: 'Pre-Production Meeting',
        description: 'Final pre-production meeting before helicopter chase sequence',
        startTime: '2024-02-16T10:00:00Z',
        endTime: '2024-02-16T12:00:00Z',
        location: 'Production Office, Bandra',
        attendees: ['Director', 'Producer', 'Stunt Coordinator', 'VFX Supervisor'],
        type: 'meeting',
        status: 'confirmed',
        notes: 'Discuss safety protocols and shot list',
        googleEventId: 'google_event_124',
        synced: true
      },
      {
        id: '3',
        title: 'Scene 3B: Helicopter Chase Sequence',
        description: 'Aerial chase sequence on Bandra-Worli Sea Link with helicopter and stunt team',
        startTime: '2024-02-18T06:00:00Z',
        endTime: '2024-02-18T16:00:00Z',
        location: 'Bandra-Worli Sea Link, Mumbai',
        attendees: ['Director', 'Cinematographer', 'Stunt Coordinator', 'Helicopter Pilot', 'Safety Officer'],
        type: 'shoot',
        status: 'tentative',
        sceneNumbers: ['3B', '3C'],
        equipment: ['Helicopter', 'Aerial Camera Rig', 'Safety Equipment', 'Communication Radios'],
        notes: 'Weather dependent. Backup date: Feb 19. All permits confirmed.',
        googleEventId: 'google_event_125',
        synced: false
      },
      {
        id: '4',
        title: 'VFX Review Session',
        description: 'Review explosion simulation and helicopter VFX sequences',
        startTime: '2024-02-20T14:00:00Z',
        endTime: '2024-02-20T17:00:00Z',
        location: 'VFX Studio, Andheri',
        attendees: ['Director', 'VFX Supervisor', 'Producer', 'Editor'],
        type: 'meeting',
        status: 'confirmed',
        notes: 'Review latest renders and provide feedback',
        googleEventId: 'google_event_126',
        synced: true
      },
      {
        id: '5',
        title: 'Wrap Party',
        description: 'Production wrap celebration for cast and crew',
        startTime: '2024-03-01T19:00:00Z',
        endTime: '2024-03-01T23:00:00Z',
        location: 'Hotel Taj, Mumbai',
        attendees: ['All Cast', 'All Crew', 'Producers', 'Investors'],
        type: 'wrap',
        status: 'confirmed',
        notes: 'Celebration dinner and awards ceremony',
        googleEventId: 'google_event_127',
        synced: true
      }
    ];

    setEvents(demoEvents);
    // Simulate Google Calendar connection
    setTimeout(() => setIsConnected(true), 1000);
  }, []);

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'shoot': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'meeting': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'prep': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'wrap': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'travel': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: CalendarEvent['status']) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 dark:text-green-400';
      case 'tentative': return 'text-yellow-600 dark:text-yellow-400';
      case 'cancelled': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const handleGoogleConnect = async () => {
    setIsSyncing(true);
    // Simulate Google OAuth flow
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsConnected(true);
    setIsSyncing(false);
  };

  const handleSyncCalendar = async () => {
    setIsSyncing(true);
    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Update sync status for events
    setEvents(events.map(event => ({ ...event, synced: true })));
    setIsSyncing(false);
  };

  const handleCreateEvent = () => {
    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      startTime: `${selectedDate}T${newEvent.startTime}:00Z`,
      endTime: `${selectedDate}T${newEvent.endTime}:00Z`,
      location: newEvent.location,
      attendees: newEvent.attendees,
      type: newEvent.type,
      status: 'confirmed',
      sceneNumbers: newEvent.sceneNumbers,
      equipment: newEvent.equipment,
      synced: false
    };

    setEvents([...events, event]);
    onEventCreated?.(event);
    
    // Reset form
    setNewEvent({
      title: '',
      description: '',
      startTime: '09:00',
      endTime: '18:00',
      location: '',
      attendees: [],
      type: 'shoot',
      sceneNumbers: [],
      equipment: []
    });
    setShowCreateForm(false);
  };

  const generateAISchedule = async () => {
    setIsSyncing(true);
    
    // Simulate AI schedule generation
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    const aiGeneratedEvents: CalendarEvent[] = [
      {
        id: 'ai_1',
        title: 'Scene 5A: Magical Forest Setup',
        description: 'AI-generated: Setup day for magical forest scenes with creature animation prep',
        startTime: '2024-02-22T07:00:00Z',
        endTime: '2024-02-22T19:00:00Z',
        location: 'Aarey Colony Forest',
        attendees: ['Director', 'VFX Supervisor', 'Lighting Team', 'Creature Animators'],
        type: 'prep',
        status: 'tentative',
        sceneNumbers: ['5A'],
        equipment: ['Motion Capture Equipment', 'Lighting Rigs', 'Generators'],
        notes: 'AI suggests early setup due to complex creature animation requirements',
        synced: false
      },
      {
        id: 'ai_2',
        title: 'Scene 2C: Explosion Sequence',
        description: 'AI-generated: Building explosion with safety protocols and VFX integration',
        startTime: '2024-02-25T08:00:00Z',
        endTime: '2024-02-25T17:00:00Z',
        location: 'Green Screen Studio, Mehboob Studios',
        attendees: ['Director', 'VFX Supervisor', 'Safety Coordinator', 'Stunt Team'],
        type: 'shoot',
        status: 'tentative',
        sceneNumbers: ['2C'],
        equipment: ['Green Screen Setup', 'Safety Equipment', 'Explosion Rigs'],
        notes: 'AI optimized schedule considering VFX complexity and safety requirements',
        synced: false
      }
    ];
    
    setEvents([...events, ...aiGeneratedEvents]);
    setIsSyncing(false);
  };

  const upcomingEvents = events
    .filter(event => new Date(event.startTime) >= new Date())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 5);

  const syncedCount = events.filter(e => e.synced).length;
  const totalEvents = events.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <Calendar className="h-6 w-6 mr-2" />
            Google Calendar Integration
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered scheduling with automatic Google Calendar sync
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {!isConnected ? (
            <button
              onClick={handleGoogleConnect}
              disabled={isSyncing}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
            >
              {isSyncing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Connecting...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Connect Google
                </>
              )}
            </button>
          ) : (
            <>
              <button
                onClick={handleSyncCalendar}
                disabled={isSyncing}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-lg transition-colors"
              >
                {isSyncing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync Calendar
                  </>
                )}
              </button>
              
              <button
                onClick={generateAISchedule}
                disabled={isSyncing}
                className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium rounded-lg transition-colors"
              >
                {isSyncing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Settings className="h-4 w-4 mr-2" />
                    AI Schedule
                  </>
                )}
              </button>
              
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </button>
            </>
          )}
        </div>
      </div>

      {/* Connection Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Google Calendar {isConnected ? 'Connected' : 'Disconnected'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isConnected 
                  ? `${syncedCount}/${totalEvents} events synced`
                  : 'Connect to enable automatic calendar sync'
                }
              </p>
            </div>
          </div>
          
          {isConnected && (
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4 mr-1" />
                {syncedCount} Synced
              </div>
              <div className="flex items-center text-yellow-600 dark:text-yellow-400">
                <AlertCircle className="h-4 w-4 mr-1" />
                {totalEvents - syncedCount} Pending
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Event Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Create New Event</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Title
              </label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="e.g., Scene 1A: Coffee Shop Interior"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Type
              </label>
              <select
                value={newEvent.type}
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as CalendarEvent['type'] })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="shoot">Shoot</option>
                <option value="meeting">Meeting</option>
                <option value="prep">Preparation</option>
                <option value="wrap">Wrap</option>
                <option value="travel">Travel</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={newEvent.startTime}
                onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={newEvent.endTime}
                onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="e.g., Mumbai Film City Studio 7"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Event description and notes..."
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateEvent}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Create Event
            </button>
          </div>
        </motion.div>
      )}

      {/* Upcoming Events */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Upcoming Events</h3>
        
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">{event.title}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEventTypeColor(event.type)}`}>
                    {event.type}
                  </span>
                  <div className={`flex items-center text-sm ${getStatusColor(event.status)}`}>
                    {event.status === 'confirmed' && <CheckCircle className="h-4 w-4 mr-1" />}
                    {event.status === 'tentative' && <AlertCircle className="h-4 w-4 mr-1" />}
                    {event.status}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{event.description}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(event.startTime).toLocaleDateString()} {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {event.location}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {event.attendees.length} attendees
                  </div>
                  {event.sceneNumbers && event.sceneNumbers.length > 0 && (
                    <div className="flex items-center">
                      <span className="text-xs">Scenes: {event.sceneNumbers.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <div className={`w-2 h-2 rounded-full ${event.synced ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {event.synced ? 'Synced' : 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {upcomingEvents.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No upcoming events</h4>
            <p className="text-gray-500 dark:text-gray-400">Create your first event to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};
