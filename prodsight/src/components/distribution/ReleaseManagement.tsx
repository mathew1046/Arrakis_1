import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Plus, Edit3, Check, X, Clock, Upload
} from 'lucide-react';

// Define interfaces for release data
interface ReleaseWindow {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  platform: string;
  territory: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  exclusivity: boolean;
  marketingDeadlines: MarketingDeadline[];
  deliverables: Deliverable[];
  notes: string;
}

interface MarketingDeadline {
  id: string;
  name: string;
  date: string;
  completed: boolean;
  responsible: string;
}

interface Deliverable {
  id: string;
  name: string;
  dueDate: string;
  submitted: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'not_submitted';
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'release' | 'marketing' | 'deliverable';
  relatedId: string;
}

// Component for release scheduling
export const ReleaseManagement: React.FC = () => {
  const [releases, setReleases] = useState<ReleaseWindow[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [currentView, setCurrentView] = useState<'list' | 'calendar'>('list');
  const [selectedRelease, setSelectedRelease] = useState<ReleaseWindow | null>(null);
  const [showReleaseForm, setShowReleaseForm] = useState(false);

  // Load mock data
  useEffect(() => {
    // Mock release windows
    const mockReleases: ReleaseWindow[] = [
      {
        id: '1',
        name: 'Theatrical Release - Domestic',
        startDate: '2025-11-15',
        endDate: '2026-01-15',
        platform: 'Theatrical',
        territory: 'United States, Canada',
        status: 'scheduled',
        exclusivity: true,
        marketingDeadlines: [
          { id: 'm1', name: 'Trailer Release', date: '2025-08-15', completed: true, responsible: 'Marketing Team' },
          { id: 'm2', name: 'Press Junket', date: '2025-11-01', completed: false, responsible: 'PR Team' },
          { id: 'm3', name: 'Premiere Event', date: '2025-11-12', completed: false, responsible: 'Events Team' }
        ],
        deliverables: [
          { id: 'd1', name: 'Final Cut DCP', dueDate: '2025-10-01', submitted: true, approvalStatus: 'approved' },
          { id: 'd2', name: 'Marketing Assets', dueDate: '2025-09-15', submitted: true, approvalStatus: 'approved' },
          { id: 'd3', name: 'Subtitle Files', dueDate: '2025-09-30', submitted: true, approvalStatus: 'approved' }
        ],
        notes: 'Coordinating with theater chains for premium format rollout. IMAX availability confirmed.'
      },
      {
        id: '2',
        name: 'Theatrical Release - International',
        startDate: '2025-11-22',
        endDate: '2026-01-30',
        platform: 'Theatrical',
        territory: 'Europe, Asia, Australia',
        status: 'scheduled',
        exclusivity: true,
        marketingDeadlines: [
          { id: 'm4', name: 'International Trailer', date: '2025-08-22', completed: true, responsible: 'Int. Marketing' },
          { id: 'm5', name: 'London Premiere', date: '2025-11-18', completed: false, responsible: 'UK Team' },
          { id: 'm6', name: 'Tokyo Press Event', date: '2025-11-25', completed: false, responsible: 'Asia Team' }
        ],
        deliverables: [
          { id: 'd4', name: 'International DCPs', dueDate: '2025-10-15', submitted: true, approvalStatus: 'approved' },
          { id: 'd5', name: 'Localized Marketing', dueDate: '2025-09-30', submitted: true, approvalStatus: 'approved' },
          { id: 'd6', name: 'Dub Tracks', dueDate: '2025-10-10', submitted: false, approvalStatus: 'pending' }
        ],
        notes: 'Release dates may vary by country. Special consideration for Japanese market.'
      },
      {
        id: '3',
        name: 'SVOD Release - Netflix',
        startDate: '2026-02-15',
        endDate: '2028-02-15',
        platform: 'Netflix',
        territory: 'Worldwide',
        status: 'active',
        exclusivity: false,
        marketingDeadlines: [
          { id: 'm7', name: 'Digital Trailer', date: '2026-01-15', completed: false, responsible: 'Digital Marketing' },
          { id: 'm8', name: 'Social Media Campaign', date: '2026-02-01', completed: false, responsible: 'Social Team' }
        ],
        deliverables: [
          { id: 'd7', name: 'Netflix Master', dueDate: '2026-01-10', submitted: false, approvalStatus: 'not_submitted' },
          { id: 'd8', name: 'Metadata Package', dueDate: '2025-12-20', submitted: false, approvalStatus: 'not_submitted' },
          { id: 'd9', name: 'All Subtitles', dueDate: '2025-12-15', submitted: false, approvalStatus: 'not_submitted' }
        ],
        notes: 'Non-exclusive streaming rights. Joint marketing campaign planned with platform.'
      },
      {
        id: '4',
        name: 'TVOD/EST Release',
        startDate: '2026-02-01',
        endDate: '2029-02-01',
        platform: 'Amazon Prime',
        territory: 'Worldwide',
        status: 'active',
        exclusivity: false,
        marketingDeadlines: [
          { id: 'm9', name: 'Pre-order Campaign', date: '2026-01-10', completed: false, responsible: 'Digital Sales' },
          { id: 'm10', name: 'Digital Ads Launch', date: '2026-01-25', completed: false, responsible: 'Advertising' }
        ],
        deliverables: [
          { id: 'd10', name: 'Digital Masters', dueDate: '2025-12-20', submitted: false, approvalStatus: 'not_submitted' },
          { id: 'd11', name: 'Bonus Content', dueDate: '2025-11-30', submitted: true, approvalStatus: 'approved' },
          { id: 'd12', name: 'Platform-specific Art', dueDate: '2025-12-10', submitted: false, approvalStatus: 'pending' }
        ],
        notes: 'Special bonus features to be included for digital purchase version.'
      },
      {
        id: '6',
        name: 'SVOD Release - Disney+',
        startDate: '2026-05-01',
        endDate: '2028-05-01',
        platform: 'Disney+',
        territory: 'Worldwide',
        status: 'scheduled',
        exclusivity: false,
        marketingDeadlines: [
          { id: 'm12', name: 'Disney+ Promo', date: '2026-04-01', completed: false, responsible: 'Digital Marketing' },
          { id: 'm13', name: 'Social Media Push', date: '2026-04-20', completed: false, responsible: 'Social Team' }
        ],
        deliverables: [
          { id: 'd15', name: 'Disney+ Master', dueDate: '2026-03-15', submitted: false, approvalStatus: 'not_submitted' },
          { id: 'd16', name: 'Promo Assets', dueDate: '2026-03-01', submitted: false, approvalStatus: 'not_submitted' }
        ],
        notes: 'Part of multi-platform digital distribution strategy. Special promotional content planned.'
      },
      {
        id: '5',
        name: 'Pay TV Window',
        startDate: '2026-08-15',
        endDate: '2027-08-15',
        platform: 'HBO Max',
        territory: 'United States',
        status: 'active',
        exclusivity: true,
        marketingDeadlines: [
          { id: 'm11', name: 'Cable Promo', date: '2026-07-15', completed: false, responsible: 'TV Marketing' }
        ],
        deliverables: [
          { id: 'd13', name: 'Broadcast Master', dueDate: '2026-07-01', submitted: false, approvalStatus: 'not_submitted' },
          { id: 'd14', name: 'EPG Metadata', dueDate: '2026-06-15', submitted: false, approvalStatus: 'not_submitted' }
        ],
        notes: 'Exclusive Pay TV window for US territory.'
      },
      {
        id: '7',
        name: 'SVOD Release - Hulu',
        startDate: '2025-12-10',
        endDate: '2027-12-10',
        platform: 'Hulu',
        territory: 'United States',
        status: 'active',
        exclusivity: false,
        marketingDeadlines: [
          { id: 'm14', name: 'Hulu Launch Campaign', date: '2025-11-25', completed: true, responsible: 'Digital Marketing' }
        ],
        deliverables: [
          { id: 'd17', name: 'Hulu Master', dueDate: '2025-11-20', submitted: true, approvalStatus: 'approved' }
        ],
        notes: 'Content is live and performing well with steady viewer numbers.'
      },
      {
        id: '8',
        name: 'SVOD Release - Peacock',
        startDate: '2025-12-01',
        endDate: '2027-12-01',
        platform: 'Peacock',
        territory: 'United States',
        status: 'active',
        exclusivity: false,
        marketingDeadlines: [
          { id: 'm15', name: 'Peacock Promotion', date: '2025-11-15', completed: true, responsible: 'NBC Universal Team' }
        ],
        deliverables: [
          { id: 'd18', name: 'Peacock Master', dueDate: '2025-11-10', submitted: true, approvalStatus: 'approved' }
        ],
        notes: 'Featured on Peacock home page for first two weeks after launch.'
      },
      {
        id: '9',
        name: 'SVOD Release - Apple TV+',
        startDate: '2026-01-15',
        endDate: '2028-01-15',
        platform: 'Apple TV+',
        territory: 'Worldwide',
        status: 'scheduled',
        exclusivity: false,
        marketingDeadlines: [
          { id: 'm16', name: 'Apple TV+ Campaign', date: '2026-01-05', completed: false, responsible: 'Apple Marketing' }
        ],
        deliverables: [
          { id: 'd19', name: 'Apple TV+ Master', dueDate: '2025-12-15', submitted: true, approvalStatus: 'pending' }
        ],
        notes: 'Content under final review by Apple. Expected to go live soon.'
      },
      {
        id: '10',
        name: 'SVOD Release - Paramount+',
        startDate: '2026-03-01',
        endDate: '2028-03-01',
        platform: 'Paramount+',
        territory: 'Worldwide',
        status: 'scheduled',
        exclusivity: false,
        marketingDeadlines: [
          { id: 'm17', name: 'Paramount+ Campaign', date: '2026-02-15', completed: false, responsible: 'Paramount Team' }
        ],
        deliverables: [
          { id: 'd20', name: 'Paramount+ Master', dueDate: '2026-01-20', submitted: false, approvalStatus: 'not_submitted' }
        ],
        notes: 'Final contract details being negotiated. Delivery timeline to be confirmed.'
      }
    ];

    setReleases(mockReleases);

    // Generate calendar events from releases
    const events: CalendarEvent[] = [];
    
    mockReleases.forEach(release => {
      // Add release start and end events
      events.push({
        id: `release-start-${release.id}`,
        title: `${release.name} Start`,
        date: release.startDate,
        type: 'release',
        relatedId: release.id
      });
      
      events.push({
        id: `release-end-${release.id}`,
        title: `${release.name} End`,
        date: release.endDate,
        type: 'release',
        relatedId: release.id
      });
      
      // Add marketing deadlines
      release.marketingDeadlines.forEach(deadline => {
        events.push({
          id: `marketing-${deadline.id}`,
          title: deadline.name,
          date: deadline.date,
          type: 'marketing',
          relatedId: deadline.id
        });
      });
      
      // Add deliverable deadlines
      release.deliverables.forEach(deliverable => {
        events.push({
          id: `deliverable-${deliverable.id}`,
          title: `Due: ${deliverable.name}`,
          date: deliverable.dueDate,
          type: 'deliverable',
          relatedId: deliverable.id
        });
      });
    });
    
    setCalendarEvents(events);
  }, []);

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled': 
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'active': 
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'completed': 
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'cancelled': 
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: 
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Handle release detail click
  const handleReleaseClick = (release: ReleaseWindow) => {
    setSelectedRelease(release);
  };

  // Close release detail panel
  const closeReleaseDetail = () => {
    setSelectedRelease(null);
  };

  return (
    <div className="space-y-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      {/* Header with view toggle */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Release Management
        </h2>
        <div className="flex space-x-4">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setCurrentView('list')}
              className={`px-4 py-1.5 text-sm rounded-md ${
                currentView === 'list' 
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setCurrentView('calendar')}
              className={`px-4 py-1.5 text-sm rounded-md ${
                currentView === 'calendar' 
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Calendar
            </button>
          </div>
          <button
            onClick={() => setShowReleaseForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-medium flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Release
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Release list */}
        <div className={`${selectedRelease ? 'hidden lg:block lg:col-span-1' : 'lg:col-span-3'}`}>
          {currentView === 'list' ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/3">
                        Release Window
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">
                        Platform
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        End Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {releases.map(release => (
                      <tr 
                        key={release.id} 
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer border-b border-gray-100 dark:border-gray-700"
                        onClick={() => handleReleaseClick(release)}
                      >
                        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                          {release.name}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {release.platform}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(release.startDate)}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(release.endDate)}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-center">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(release.status)}`}>
                            {release.status.charAt(0).toUpperCase() + release.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 w-full">
              <div className="text-center text-xl font-medium text-gray-900 dark:text-gray-100 mb-6">
                October 2025
              </div>
              <div className="grid grid-cols-7 gap-1">
                {/* Calendar header */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
                    {day}
                  </div>
                ))}
                
                {/* Calendar mock grid - would be dynamically generated in a real implementation */}
                {Array.from({ length: 35 }, (_, i) => {
                  // Calculate the actual day number (1-31)
                  // October 2025 starts on Wednesday (3)
                  const dayNum = i - 2;
                  const isCurrentMonth = dayNum > 0 && dayNum <= 31;
                  const isToday = dayNum === 5; // Assuming today is Oct 5
                  
                  // Find events for this day
                  const dayEvents = calendarEvents.filter(event => {
                    const eventDate = new Date(event.date);
                    return eventDate.getDate() === dayNum && 
                           eventDate.getMonth() === 9 && // October is month 9
                           eventDate.getFullYear() === 2025;
                  });
                  
                  return (
                    <div 
                      key={i}
                      className={`p-2 min-h-[80px] border border-gray-100 dark:border-gray-700 ${
                        !isCurrentMonth ? 'bg-gray-50 dark:bg-gray-700/30 text-gray-400 dark:text-gray-600' : 
                        isToday ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' : ''
                      }`}
                    >
                      <div className={`text-xs ${
                        isToday ? 'font-bold text-blue-600 dark:text-blue-400' : 
                        isCurrentMonth ? 'text-gray-700 dark:text-gray-300' : 
                        'text-gray-400 dark:text-gray-600'
                      }`}>
                        {isCurrentMonth ? dayNum : ''}
                      </div>
                      
                      {/* Event indicators - simplified for mock */}
                      {isCurrentMonth && dayEvents.map((event) => (
                        <div 
                          key={event.id}
                          className={`text-xs mt-1 px-1 py-0.5 truncate rounded ${
                            event.type === 'release' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                            event.type === 'marketing' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                            'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
                          }`}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Release details panel */}
        {selectedRelease && (
          <div className="lg:col-span-2 w-full">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 w-full"
            >
              {/* Header with close button */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Release Details
                </h3>
                <button 
                  onClick={closeReleaseDetail}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Release details */}
              <div className="space-y-6">
                {/* Basic info */}
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {selectedRelease.name}
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(selectedRelease.status)}`}>
                      {selectedRelease.status.charAt(0).toUpperCase() + selectedRelease.status.slice(1)}
                    </span>
                    {selectedRelease.exclusivity && (
                      <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 px-2 py-1 text-xs rounded-full">
                        Exclusive
                      </span>
                    )}
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Platform</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{selectedRelease.platform}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Territory</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{selectedRelease.territory}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Start Date</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{formatDate(selectedRelease.startDate)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">End Date</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{formatDate(selectedRelease.endDate)}</p>
                  </div>
                </div>

                {/* Marketing deadlines */}
                <div>
                  <h5 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Marketing Deadlines
                  </h5>
                  <div className="space-y-3">
                    {selectedRelease.marketingDeadlines.map(deadline => (
                      <div key={deadline.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{deadline.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(deadline.date)} · {deadline.responsible}
                          </p>
                        </div>
                        <div className={deadline.completed ? 'text-green-500' : 'text-gray-400'}>
                          {deadline.completed ? <Check className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deliverables */}
                <div>
                  <h5 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                    <Upload className="h-4 w-4 mr-2" />
                    Deliverables
                  </h5>
                  <div className="space-y-3">
                    {selectedRelease.deliverables.map(deliverable => (
                      <div key={deliverable.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{deliverable.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Due: {formatDate(deliverable.dueDate)}
                          </p>
                        </div>
                        <div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            deliverable.approvalStatus === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                            deliverable.approvalStatus === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                            deliverable.approvalStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {deliverable.approvalStatus.charAt(0).toUpperCase() + deliverable.approvalStatus.slice(1).replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {selectedRelease.notes && (
                  <div>
                    <h5 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-2">Notes</h5>
                    <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                      {selectedRelease.notes}
                    </p>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex-1 flex items-center justify-center">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Release
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Deliverable
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Confirmation for create form - would be a real form in implementation */}
      {showReleaseForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-lg w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Create New Release Window</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The form for creating a new release window would appear here with fields for platform, dates, territories, etc.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowReleaseForm(false)}
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md text-sm font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowReleaseForm(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Create Release
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};