import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Eye, Zap, AlertCircle, CheckCircle, Clock, Star, Brain,
  MapPin, Users, Camera, Palette, Layers, Sparkles
} from 'lucide-react';

interface VFXScene {
  id: string;
  sceneNumber: string;
  title: string;
  description: string;
  location: string;
  duration: number;
  complexity: 'low' | 'medium' | 'high' | 'extreme';
  vfxRequired: boolean;
  aiConfidence: number;
  suggestedVFXTypes: string[];
  estimatedHours: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'analysis' | 'approved' | 'in_progress' | 'completed';
  assignedArtists: string[];
  deadline: string;
  aiSuggestions: {
    type: string;
    reason: string;
    confidence: number;
  }[];
}

export const VFXSceneAnalysis: React.FC = () => {
  const [scenes, setScenes] = useState<VFXScene[]>([]);
  const [selectedScene, setSelectedScene] = useState<VFXScene | null>(null);
  const [filterComplexity, setFilterComplexity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAISuggestions, setShowAISuggestions] = useState(true);

  // Demo data initialization
  useEffect(() => {
    const demoScenes: VFXScene[] = [
      {
        id: '1',
        sceneNumber: '1A',
        title: 'Coffee Shop Interior',
        description: 'Protagonist meets mysterious stranger in busy coffee shop',
        location: 'Coffee Shop - Interior',
        duration: 180,
        complexity: 'low',
        vfxRequired: true,
        aiConfidence: 85,
        suggestedVFXTypes: ['Window Replacement', 'Screen Replacement', 'Crowd Enhancement'],
        estimatedHours: 12,
        priority: 'medium',
        status: 'approved',
        assignedArtists: ['Sarah Chen', 'Mike Rodriguez'],
        deadline: '2024-02-15',
        aiSuggestions: [
          {
            type: 'Window Replacement',
            reason: 'Script mentions "rain outside" but shooting on sunny day',
            confidence: 90
          },
          {
            type: 'Screen Replacement',
            reason: 'Laptop screen content needs to be added in post',
            confidence: 95
          }
        ]
      },
      {
        id: '2',
        sceneNumber: '3B',
        title: 'Chase Scene - Rooftop',
        description: 'High-speed chase across city rooftops with helicopter pursuit',
        location: 'Rooftop - Exterior',
        duration: 240,
        complexity: 'extreme',
        vfxRequired: true,
        aiConfidence: 98,
        suggestedVFXTypes: ['Digital Environment', 'Helicopter CG', 'Wire Removal', 'Matte Painting'],
        estimatedHours: 120,
        priority: 'high',
        status: 'analysis',
        assignedArtists: [],
        deadline: '2024-03-01',
        aiSuggestions: [
          {
            type: 'Digital Environment',
            reason: 'Cityscape background needs to be extended and enhanced',
            confidence: 95
          },
          {
            type: 'Helicopter CG',
            reason: 'Real helicopter too dangerous for close shots',
            confidence: 98
          },
          {
            type: 'Wire Removal',
            reason: 'Safety wires visible in stunt sequences',
            confidence: 92
          }
        ]
      },
      {
        id: '3',
        sceneNumber: '5A',
        title: 'Magical Forest',
        description: 'Hero discovers enchanted forest with glowing creatures',
        location: 'Forest - Exterior',
        duration: 300,
        complexity: 'high',
        vfxRequired: true,
        aiConfidence: 96,
        suggestedVFXTypes: ['Creature Animation', 'Particle Effects', 'Color Grading', 'Digital Foliage'],
        estimatedHours: 80,
        priority: 'high',
        status: 'in_progress',
        assignedArtists: ['Emma Watson', 'David Kim', 'Lisa Park'],
        deadline: '2024-02-28',
        aiSuggestions: [
          {
            type: 'Creature Animation',
            reason: 'Glowing fairy creatures mentioned in script',
            confidence: 98
          },
          {
            type: 'Particle Effects',
            reason: 'Magical sparkles and glowing effects needed',
            confidence: 94
          }
        ]
      },
      {
        id: '4',
        sceneNumber: '2C',
        title: 'Office Building Explosion',
        description: 'Dramatic explosion sequence with debris and fire',
        location: 'Office Building - Exterior',
        duration: 45,
        complexity: 'extreme',
        vfxRequired: true,
        aiConfidence: 99,
        suggestedVFXTypes: ['Explosion Simulation', 'Debris Simulation', 'Fire Effects', 'Building Destruction'],
        estimatedHours: 150,
        priority: 'urgent',
        status: 'approved',
        assignedArtists: ['Tom Wilson', 'Sarah Chen', 'Mike Rodriguez', 'Alex Johnson'],
        deadline: '2024-02-20',
        aiSuggestions: [
          {
            type: 'Explosion Simulation',
            reason: 'Large-scale explosion too dangerous to film practically',
            confidence: 99
          },
          {
            type: 'Building Destruction',
            reason: 'Cannot destroy real building for shot',
            confidence: 98
          }
        ]
      }
    ];
    setScenes(demoScenes);
  }, []);

  const filteredScenes = scenes.filter(scene => {
    const matchesComplexity = filterComplexity === 'all' || scene.complexity === filterComplexity;
    const matchesStatus = filterStatus === 'all' || scene.status === filterStatus;
    return matchesComplexity && matchesStatus;
  });

  const getComplexityColor = (complexity: VFXScene['complexity']) => {
    switch (complexity) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'extreme': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: VFXScene['status']) => {
    switch (status) {
      case 'analysis': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'in_progress': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: VFXScene['priority']) => {
    switch (priority) {
      case 'low': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'urgent': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Statistics
  const stats = {
    total: scenes.length,
    requiresVFX: scenes.filter(s => s.vfxRequired).length,
    highComplexity: scenes.filter(s => s.complexity === 'high' || s.complexity === 'extreme').length,
    totalHours: scenes.reduce((sum, s) => sum + s.estimatedHours, 0),
    avgConfidence: scenes.reduce((sum, s) => sum + s.aiConfidence, 0) / scenes.length
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Scenes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Sparkles className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Requires VFX</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.requiresVFX}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">High Complexity</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.highComplexity}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Hours</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalHours}h</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-indigo-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">AI Confidence</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.avgConfidence.toFixed(0)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <select
              value={filterComplexity}
              onChange={(e) => setFilterComplexity(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Complexity</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="extreme">Extreme</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Status</option>
              <option value="analysis">Analysis</option>
              <option value="approved">Approved</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showAISuggestions}
                onChange={(e) => setShowAISuggestions(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Show AI Suggestions</span>
            </label>
          </div>
        </div>
      </div>

      {/* Scenes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredScenes.map((scene) => (
          <motion.div
            key={scene.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedScene(scene)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Scene {scene.sceneNumber}: {scene.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getComplexityColor(scene.complexity)}`}>
                    {scene.complexity}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{scene.description}</p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {scene.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {scene.duration}s
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(scene.status)}`}>
                  {scene.status.replace('_', ' ')}
                </span>
                <div className={`flex items-center text-sm font-medium ${getPriorityColor(scene.priority)}`}>
                  <Star className="h-4 w-4 mr-1" />
                  {scene.priority}
                </div>
              </div>
            </div>

            {/* VFX Requirements */}
            {scene.vfxRequired && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">VFX Requirements</span>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Brain className="h-4 w-4 mr-1" />
                    {scene.aiConfidence}% confidence
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {scene.suggestedVFXTypes.map((type, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 rounded-full"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* AI Suggestions */}
            {showAISuggestions && scene.aiSuggestions.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">AI Suggestions</span>
                </div>
                <div className="space-y-2">
                  {scene.aiSuggestions.slice(0, 2).map((suggestion, index) => (
                    <div key={index} className="text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-blue-700 dark:text-blue-300">{suggestion.type}</span>
                        <span className="text-blue-600 dark:text-blue-400">{suggestion.confidence}%</span>
                      </div>
                      <p className="text-blue-600 dark:text-blue-400 mt-1">{suggestion.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Assignment Info */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <Users className="h-4 w-4 mr-1" />
                {scene.assignedArtists.length > 0 ? (
                  <span>{scene.assignedArtists.length} artists assigned</span>
                ) : (
                  <span>No artists assigned</span>
                )}
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <Clock className="h-4 w-4 mr-1" />
                <span>{scene.estimatedHours}h estimated</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredScenes.length === 0 && (
        <div className="text-center py-12">
          <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No scenes found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your filters to see more scenes.
          </p>
        </div>
      )}

      {/* Scene Detail Modal */}
      {selectedScene && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Scene {selectedScene.sceneNumber}: {selectedScene.title}
              </h3>
              <button
                onClick={() => setSelectedScene(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Description</h4>
                <p className="text-gray-600 dark:text-gray-400">{selectedScene.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Location:</span>
                      <span className="text-gray-900 dark:text-gray-100">{selectedScene.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                      <span className="text-gray-900 dark:text-gray-100">{selectedScene.duration}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Complexity:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getComplexityColor(selectedScene.complexity)}`}>
                        {selectedScene.complexity}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Assignment</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedScene.status)}`}>
                        {selectedScene.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Priority:</span>
                      <span className={`font-medium ${getPriorityColor(selectedScene.priority)}`}>
                        {selectedScene.priority}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Deadline:</span>
                      <span className="text-gray-900 dark:text-gray-100">{selectedScene.deadline}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedScene.aiSuggestions.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">AI Analysis & Suggestions</h4>
                  <div className="space-y-3">
                    {selectedScene.aiSuggestions.map((suggestion, index) => (
                      <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-blue-800 dark:text-blue-200">{suggestion.type}</span>
                          <span className="text-sm text-blue-600 dark:text-blue-400">{suggestion.confidence}% confidence</span>
                        </div>
                        <p className="text-sm text-blue-700 dark:text-blue-300">{suggestion.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedScene.assignedArtists.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Assigned Artists</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedScene.assignedArtists.map((artist, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        {artist}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
