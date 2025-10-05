import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Plus, Edit3, Calendar, Clock, Star, CheckCircle,
  AlertCircle, User, Palette, Zap, Target, BarChart3
} from 'lucide-react';

interface VFXArtist {
  id: string;
  name: string;
  email: string;
  specialties: string[];
  skillLevel: 'junior' | 'mid' | 'senior' | 'lead';
  availability: 'available' | 'busy' | 'unavailable';
  currentWorkload: number; // percentage
  maxHoursPerWeek: number;
  currentAssignments: string[];
  completedProjects: number;
  rating: number;
  hourlyRate: number;
}

interface Assignment {
  id: string;
  sceneId: string;
  sceneTitle: string;
  artistId: string;
  artistName: string;
  vfxType: string;
  estimatedHours: number;
  actualHours: number;
  status: 'assigned' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  deadline: string;
  startDate: string;
  progress: number;
  notes: string;
}

export const VFXArtistAssignment: React.FC = () => {
  const [artists, setArtists] = useState<VFXArtist[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<VFXArtist | null>(null);
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState('all');

  // Demo data initialization
  useEffect(() => {
    const demoArtists: VFXArtist[] = [
      {
        id: '1',
        name: 'Sarah Chen',
        email: 'sarah.chen@prodsight.com',
        specialties: ['Compositing', 'Matte Painting', 'Color Grading'],
        skillLevel: 'senior',
        availability: 'available',
        currentWorkload: 60,
        maxHoursPerWeek: 40,
        currentAssignments: ['Scene 1A', 'Scene 2C'],
        completedProjects: 45,
        rating: 4.8,
        hourlyRate: 75
      },
      {
        id: '2',
        name: 'Mike Rodriguez',
        email: 'mike.rodriguez@prodsight.com',
        specialties: ['3D Animation', 'Rigging', 'Lighting'],
        skillLevel: 'lead',
        availability: 'busy',
        currentWorkload: 90,
        maxHoursPerWeek: 45,
        currentAssignments: ['Scene 2C', 'Scene 3B', 'Scene 5A'],
        completedProjects: 78,
        rating: 4.9,
        hourlyRate: 95
      },
      {
        id: '3',
        name: 'Emma Watson',
        email: 'emma.watson@prodsight.com',
        specialties: ['Particle Effects', 'Simulation', 'Dynamics'],
        skillLevel: 'senior',
        availability: 'available',
        currentWorkload: 45,
        maxHoursPerWeek: 40,
        currentAssignments: ['Scene 5A'],
        completedProjects: 32,
        rating: 4.6,
        hourlyRate: 70
      },
      {
        id: '4',
        name: 'David Kim',
        email: 'david.kim@prodsight.com',
        specialties: ['Modeling', 'Texturing', 'Sculpting'],
        skillLevel: 'mid',
        availability: 'available',
        currentWorkload: 30,
        maxHoursPerWeek: 40,
        currentAssignments: ['Scene 5A'],
        completedProjects: 18,
        rating: 4.3,
        hourlyRate: 55
      },
      {
        id: '5',
        name: 'Lisa Park',
        email: 'lisa.park@prodsight.com',
        specialties: ['Motion Graphics', 'UI/UX', 'Typography'],
        skillLevel: 'mid',
        availability: 'unavailable',
        currentWorkload: 100,
        maxHoursPerWeek: 40,
        currentAssignments: ['Scene 1A', 'Scene 4D'],
        completedProjects: 25,
        rating: 4.4,
        hourlyRate: 60
      },
      {
        id: '6',
        name: 'Alex Johnson',
        email: 'alex.johnson@prodsight.com',
        specialties: ['Creature Animation', 'Character Rigging', 'Facial Animation'],
        skillLevel: 'junior',
        availability: 'available',
        currentWorkload: 20,
        maxHoursPerWeek: 35,
        currentAssignments: ['Scene 2C'],
        completedProjects: 8,
        rating: 4.1,
        hourlyRate: 45
      }
    ];

    const demoAssignments: Assignment[] = [
      {
        id: '1',
        sceneId: '1',
        sceneTitle: 'Coffee Shop Interior',
        artistId: '1',
        artistName: 'Sarah Chen',
        vfxType: 'Window Replacement',
        estimatedHours: 8,
        actualHours: 6,
        status: 'completed',
        priority: 'medium',
        deadline: '2024-02-15',
        startDate: '2024-02-10',
        progress: 100,
        notes: 'Completed ahead of schedule with excellent quality'
      },
      {
        id: '2',
        sceneId: '2',
        sceneTitle: 'Chase Scene - Rooftop',
        artistId: '2',
        artistName: 'Mike Rodriguez',
        vfxType: 'Helicopter CG',
        estimatedHours: 40,
        actualHours: 35,
        status: 'in_progress',
        priority: 'high',
        deadline: '2024-03-01',
        startDate: '2024-02-15',
        progress: 75,
        notes: 'Good progress, on track for deadline'
      },
      {
        id: '3',
        sceneId: '3',
        sceneTitle: 'Magical Forest',
        artistId: '3',
        artistName: 'Emma Watson',
        vfxType: 'Particle Effects',
        estimatedHours: 25,
        actualHours: 18,
        status: 'in_progress',
        priority: 'high',
        deadline: '2024-02-28',
        startDate: '2024-02-12',
        progress: 60,
        notes: 'Creating magical sparkle effects'
      },
      {
        id: '4',
        sceneId: '4',
        sceneTitle: 'Office Building Explosion',
        artistId: '2',
        artistName: 'Mike Rodriguez',
        vfxType: 'Explosion Simulation',
        estimatedHours: 60,
        actualHours: 45,
        status: 'review',
        priority: 'urgent',
        deadline: '2024-02-20',
        startDate: '2024-02-05',
        progress: 95,
        notes: 'Ready for client review'
      }
    ];

    setArtists(demoArtists);
    setAssignments(demoAssignments);
  }, []);

  const getAvailabilityColor = (availability: VFXArtist['availability']) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'busy': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'unavailable': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getSkillLevelColor = (level: VFXArtist['skillLevel']) => {
    switch (level) {
      case 'junior': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'mid': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'senior': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'lead': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'assigned': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const filteredArtists = artists.filter(artist => {
    const matchesSpecialty = filterSpecialty === 'all' || artist.specialties.some(s => 
      s.toLowerCase().includes(filterSpecialty.toLowerCase())
    );
    const matchesAvailability = filterAvailability === 'all' || artist.availability === filterAvailability;
    return matchesSpecialty && matchesAvailability;
  });

  const allSpecialties = Array.from(new Set(artists.flatMap(a => a.specialties)));

  // Statistics
  const stats = {
    totalArtists: artists.length,
    available: artists.filter(a => a.availability === 'available').length,
    activeAssignments: assignments.filter(a => a.status === 'in_progress').length,
    avgWorkload: artists.reduce((sum, a) => sum + a.currentWorkload, 0) / artists.length,
    totalHours: assignments.reduce((sum, a) => sum + a.estimatedHours, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Artists</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalArtists}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.available}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.activeAssignments}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-orange-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Workload</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.avgWorkload.toFixed(0)}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Hours</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalHours}h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <select
              value={filterSpecialty}
              onChange={(e) => setFilterSpecialty(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Specialties</option>
              {allSpecialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
            
            <select
              value={filterAvailability}
              onChange={(e) => setFilterAvailability(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Availability</option>
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
          
          <button
            onClick={() => setShowAssignmentForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Assignment
          </button>
        </div>
      </div>

      {/* Artists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredArtists.map((artist) => (
          <motion.div
            key={artist.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {artist.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {artist.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{artist.email}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAvailabilityColor(artist.availability)}`}>
                  {artist.availability}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSkillLevelColor(artist.skillLevel)}`}>
                  {artist.skillLevel}
                </span>
              </div>
            </div>

            {/* Specialties */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Specialties</p>
              <div className="flex flex-wrap gap-2">
                {artist.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Workload */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Current Workload</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{artist.currentWorkload}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    artist.currentWorkload >= 90 ? 'bg-red-500' :
                    artist.currentWorkload >= 70 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${artist.currentWorkload}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="flex items-center justify-center mb-1">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">{artist.rating}</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400">Rating</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{artist.completedProjects}</p>
                <p className="text-gray-500 dark:text-gray-400">Projects</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">₹{artist.hourlyRate}/h</p>
                <p className="text-gray-500 dark:text-gray-400">Rate</p>
              </div>
            </div>

            {/* Current Assignments */}
            {artist.currentAssignments.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Assignments</p>
                <div className="space-y-1">
                  {artist.currentAssignments.slice(0, 2).map((assignment, index) => (
                    <p key={index} className="text-xs text-gray-500 dark:text-gray-400">
                      • {assignment}
                    </p>
                  ))}
                  {artist.currentAssignments.length > 2 && (
                    <p className="text-xs text-gray-400">
                      +{artist.currentAssignments.length - 2} more
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <button
                onClick={() => setSelectedArtist(artist)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                View Details
              </button>
              <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium">
                <Edit3 className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Assignments */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Recent Assignments</h3>
        
        <div className="space-y-4">
          {assignments.slice(0, 5).map((assignment) => (
            <div key={assignment.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">{assignment.sceneTitle}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(assignment.status)}`}>
                    {assignment.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {assignment.artistName}
                  </div>
                  <div className="flex items-center">
                    <Palette className="h-4 w-4 mr-1" />
                    {assignment.vfxType}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {assignment.actualHours}h / {assignment.estimatedHours}h
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Due {assignment.deadline}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{assignment.progress}%</p>
                  <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${assignment.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredArtists.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No artists found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your filters to see more artists.
          </p>
        </div>
      )}
    </div>
  );
};
