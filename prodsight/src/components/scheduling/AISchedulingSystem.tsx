import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Camera,
  Plus,
  Edit3,
  Download,
  Zap,
  Sun,
  Cloud,
  CloudRain,
  AlertTriangle,
  CheckCircle,
  X,
  Save,
  Search,
  Filter,
  Eye,
  FileText,
  Star,
  Activity
} from 'lucide-react';

interface Scene {
  id: string;
  number: string;
  title: string;
  location: string;
  timeOfDay: 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night';
  duration: number; // in hours
  cast: string[];
  crew: string[];
  equipment: string[];
  props: string[];
  complexity: 'low' | 'medium' | 'high';
  weatherDependent: boolean;
}

interface CallSheet {
  id: string;
  date: string;
  shootDay: number;
  scenes: Scene[];
  cast: {
    name: string;
    callTime: string;
    wrapTime: string;
    role: string;
  }[];
  crew: {
    name: string;
    callTime: string;
    department: string;
  }[];
  locations: {
    name: string;
    address: string;
    arrivalTime: string;
  }[];
  equipment: string[];
  weather: {
    forecast: string;
    backup: string;
  };
  notes: string;
  status: 'draft' | 'approved' | 'distributed';
  aiRecommendations: string[];
}

interface AISchedulingSystemProps {
  script?: any;
}

export const AISchedulingSystem: React.FC<AISchedulingSystemProps> = ({ script }) => {
  const [callSheets, setCallSheets] = useState<CallSheet[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Initialize demo data
  useEffect(() => {
    setScenes([
      {
        id: '1',
        number: '1A',
        title: 'Opening - Coffee Shop Interior',
        location: 'Downtown Café',
        timeOfDay: 'morning',
        duration: 2,
        cast: ['John Doe', 'Jane Smith'],
        crew: ['Director', 'DP', 'Sound', 'Script Supervisor'],
        equipment: ['RED Epic', 'Steadicam', 'Lighting Kit'],
        props: ['Coffee cups', 'Newspapers', 'Laptop'],
        complexity: 'medium',
        weatherDependent: false
      },
      {
        id: '2',
        number: '2B',
        title: 'Chase Scene - City Streets',
        location: 'Main Street',
        timeOfDay: 'afternoon',
        duration: 4,
        cast: ['John Doe', 'Mike Johnson'],
        crew: ['Director', 'DP', 'Stunt Coordinator', 'Safety Officer'],
        equipment: ['Multiple Cameras', 'Drone', 'Car Rigs'],
        props: ['Stunt Car', 'Police Props'],
        complexity: 'high',
        weatherDependent: true
      },
      {
        id: '3',
        number: '3C',
        title: 'Dialogue - Park Bench',
        location: 'Central Park',
        timeOfDay: 'evening',
        duration: 1.5,
        cast: ['Jane Smith', 'Sarah Wilson'],
        crew: ['Director', 'DP', 'Sound'],
        equipment: ['Camera', 'Boom Mic', 'Reflectors'],
        props: ['Park Bench', 'Flowers'],
        complexity: 'low',
        weatherDependent: true
      }
    ]);

    setCallSheets([
      {
        id: '1',
        date: '2024-01-22',
        shootDay: 1,
        scenes: [],
        cast: [
          { name: 'John Doe', callTime: '07:00', wrapTime: '18:00', role: 'Lead Actor' },
          { name: 'Jane Smith', callTime: '08:00', wrapTime: '16:00', role: 'Supporting' }
        ],
        crew: [
          { name: 'Director', callTime: '06:30', department: 'Direction' },
          { name: 'DP', callTime: '06:30', department: 'Camera' }
        ],
        locations: [
          { name: 'Downtown Café', address: '123 Main St', arrivalTime: '07:00' }
        ],
        equipment: ['RED Epic', 'Steadicam', 'Lighting Kit'],
        weather: { forecast: 'Sunny, 72°F', backup: 'Interior scenes if rain' },
        notes: 'Early morning golden hour shoot',
        status: 'approved',
        aiRecommendations: [
          'Consider starting 30 minutes earlier for better lighting',
          'Have backup interior scenes ready due to weather dependency'
        ]
      }
    ]);
  }, []);

  // AI-powered scheduling logic
  const generateAISchedule = (selectedScenes: Scene[], date: string) => {
    const recommendations = [];
    
    // Check weather dependency
    const weatherDependent = selectedScenes.filter(s => s.weatherDependent);
    if (weatherDependent.length > 0) {
      recommendations.push('Weather-dependent scenes detected. Have indoor backup ready.');
    }

    // Check complexity
    const highComplexity = selectedScenes.filter(s => s.complexity === 'high');
    if (highComplexity.length > 1) {
      recommendations.push('Multiple high-complexity scenes. Consider spreading across days.');
    }

    // Check time of day optimization
    const timeGroups = selectedScenes.reduce((acc, scene) => {
      acc[scene.timeOfDay] = (acc[scene.timeOfDay] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    if (Object.keys(timeGroups).length > 3) {
      recommendations.push('Multiple time-of-day requirements. Plan for lighting changes.');
    }

    // Location optimization
    const locations = Array.from(new Set(selectedScenes.map(s => s.location)));
    if (locations.length > 2) {
      recommendations.push('Multiple locations. Factor in travel time between setups.');
    }

    return recommendations;
  };

  const createCallSheet = (date: string, selectedScenes: Scene[]) => {
    const aiRecommendations = generateAISchedule(selectedScenes, date);
    
    const newCallSheet: CallSheet = {
      id: Date.now().toString(),
      date,
      shootDay: callSheets.length + 1,
      scenes: selectedScenes,
      cast: Array.from(new Set(selectedScenes.flatMap(s => s.cast))).map(name => ({
        name,
        callTime: '07:00',
        wrapTime: '18:00',
        role: 'Actor'
      })),
      crew: Array.from(new Set(selectedScenes.flatMap(s => s.crew))).map(name => ({
        name,
        callTime: '06:30',
        department: name
      })),
      locations: Array.from(new Set(selectedScenes.map(s => s.location))).map(name => ({
        name,
        address: 'TBD',
        arrivalTime: '07:00'
      })),
      equipment: Array.from(new Set(selectedScenes.flatMap(s => s.equipment))),
      weather: { forecast: 'Check weather.com', backup: 'Interior backup scenes' },
      notes: 'AI-generated call sheet - review and adjust as needed',
      status: 'draft',
      aiRecommendations
    };

    setCallSheets([...callSheets, newCallSheet]);
    setShowCreateForm(false);
  };

  const filteredCallSheets = callSheets.filter(sheet => {
    const matchesSearch = sheet.scenes.some(scene => 
      scene.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scene.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = filterStatus === 'all' || sheet.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: CallSheet['status']) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'distributed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getComplexityColor = (complexity: Scene['complexity']) => {
    switch (complexity) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTimeOfDayIcon = (timeOfDay: Scene['timeOfDay']) => {
    switch (timeOfDay) {
      case 'dawn': return <Sun className="h-4 w-4 text-orange-500" />;
      case 'morning': return <Sun className="h-4 w-4 text-yellow-500" />;
      case 'afternoon': return <Sun className="h-4 w-4 text-orange-400" />;
      case 'evening': return <Cloud className="h-4 w-4 text-purple-500" />;
      case 'night': return <Star className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Call Sheets</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{callSheets.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Scenes Scheduled</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {callSheets.reduce((sum, sheet) => sum + sheet.scenes.length, 0)}
              </p>
            </div>
            <Camera className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Approved Sheets</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {callSheets.filter(s => s.status === 'approved').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">AI Recommendations</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {callSheets.reduce((sum, sheet) => sum + sheet.aiRecommendations.length, 0)}
              </p>
            </div>
            <Zap className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search call sheets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="approved">Approved</option>
            <option value="distributed">Distributed</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'calendar' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <Calendar className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <FileText className="h-4 w-4" />
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Call Sheet
        </button>
      </div>

      {/* Available Scenes for Scheduling */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-blue-500" />
          Available Scenes for Scheduling
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenes.map((scene) => (
            <div key={scene.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    Scene {scene.number}: {scene.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {scene.location}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getComplexityColor(scene.complexity)}`}>
                  {scene.complexity}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span className="flex items-center">
                  {getTimeOfDayIcon(scene.timeOfDay)}
                  <span className="ml-1">{scene.timeOfDay}</span>
                </span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {scene.duration}h
                </span>
                {scene.weatherDependent && (
                  <span className="flex items-center text-yellow-600">
                    <CloudRain className="h-3 w-3 mr-1" />
                    Weather
                  </span>
                )}
              </div>

              <div className="text-xs text-gray-600 dark:text-gray-400">
                <p><strong>Cast:</strong> {scene.cast.join(', ')}</p>
                <p><strong>Equipment:</strong> {scene.equipment.slice(0, 2).join(', ')}{scene.equipment.length > 2 && '...'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call Sheets List */}
      <div className="space-y-4">
        {filteredCallSheets.map((sheet) => (
          <motion.div
            key={sheet.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Call Sheet - Day {sheet.shootDay}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(sheet.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(sheet.status)}`}>
                  {sheet.status}
                </span>
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <Download className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* AI Recommendations */}
            {sheet.aiRecommendations.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                  <Zap className="h-4 w-4 mr-1" />
                  AI Recommendations
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  {sheet.aiRecommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Cast & Crew */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Cast & Crew ({sheet.cast.length + sheet.crew.length})
                </h4>
                <div className="space-y-1 text-sm">
                  {sheet.cast.slice(0, 3).map((member, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-900 dark:text-gray-100">{member.name}</span>
                      <span className="text-gray-500 dark:text-gray-400">{member.callTime}</span>
                    </div>
                  ))}
                  {sheet.cast.length > 3 && (
                    <p className="text-gray-500 dark:text-gray-400">+{sheet.cast.length - 3} more</p>
                  )}
                </div>
              </div>

              {/* Locations */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Locations ({sheet.locations.length})
                </h4>
                <div className="space-y-1 text-sm">
                  {sheet.locations.map((location, index) => (
                    <div key={index}>
                      <p className="text-gray-900 dark:text-gray-100">{location.name}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">Arrival: {location.arrivalTime}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weather & Notes */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <Sun className="h-4 w-4 mr-1" />
                  Weather & Notes
                </h4>
                <div className="text-sm space-y-1">
                  <p className="text-gray-900 dark:text-gray-100">{sheet.weather.forecast}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Backup: {sheet.weather.backup}</p>
                  {sheet.notes && (
                    <p className="text-gray-600 dark:text-gray-400 text-xs mt-2">{sheet.notes}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCallSheets.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No call sheets found. Create your first one!</p>
        </div>
      )}
    </div>
  );
};
