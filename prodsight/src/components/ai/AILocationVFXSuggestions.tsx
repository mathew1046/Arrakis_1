import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Palette, Brain, Star, DollarSign, Clock, Users, Camera,
  CheckCircle, AlertCircle, Eye, ThumbsUp, ThumbsDown, Sparkles,
  Edit, Save, X, Plus, Search, Filter, Navigation, Phone, Mail
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface LocationSuggestion {
  id: string;
  name: string;
  type: 'studio' | 'outdoor' | 'indoor' | 'green_screen';
  description: string;
  address: string;
  estimatedCost: number;
  availability: 'available' | 'limited' | 'unavailable';
  suitableScenes: string[];
  pros: string[];
  cons: string[];
  aiConfidence: number;
  rating: number;
  images: string[];
  permits: string[];
  facilities: string[];
  contact?: {
    name: string;
    phone: string;
    email: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
  isCustom?: boolean;
}

interface VFXSuggestion {
  id: string;
  sceneId: string;
  sceneName: string;
  vfxType: string;
  description: string;
  complexity: 'low' | 'medium' | 'high' | 'extreme';
  estimatedCost: number;
  estimatedTime: number;
  requiredSoftware: string[];
  recommendedArtists: string[];
  aiReasoning: string;
  confidence: number;
  alternatives: {
    type: string;
    cost: number;
    description: string;
  }[];
}

export const AILocationVFXSuggestions: React.FC = () => {
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [vfxSuggestions, setVFXSuggestions] = useState<VFXSuggestion[]>([]);
  const [activeTab, setActiveTab] = useState('locations');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null);
  const [selectedVFX, setSelectedVFX] = useState<VFXSuggestion | null>(null);
  const [editingLocation, setEditingLocation] = useState<string | null>(null);
  const [showLocationHunting, setShowLocationHunting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');

  // Initialize with AI-generated suggestions
  useEffect(() => {
    const demoLocationSuggestions: LocationSuggestion[] = [
      {
        id: '1',
        name: 'Mumbai Film City Studio 7',
        type: 'studio',
        description: 'Large soundstage with controllable lighting and weather conditions, perfect for coffee shop interior',
        address: 'Film City Complex, Goregaon East, Mumbai',
        estimatedCost: 45000,
        availability: 'available',
        suitableScenes: ['1A - Coffee Shop Interior', '1B - Coffee Shop Conversation'],
        pros: ['Controlled environment', 'Professional lighting', 'Sound isolation', 'Flexible set design'],
        cons: ['Higher cost than practical location', 'Requires set construction'],
        aiConfidence: 92,
        rating: 4.7,
        images: ['studio_interior.jpg', 'lighting_setup.jpg'],
        permits: ['Studio booking confirmation'],
        facilities: ['Green rooms', 'Catering area', 'Equipment storage', 'Parking']
      },
      {
        id: '2',
        name: 'Bandra-Worli Sea Link',
        type: 'outdoor',
        description: 'Iconic Mumbai landmark perfect for dramatic chase sequences with city skyline backdrop',
        address: 'Bandra-Worli Sea Link, Mumbai',
        estimatedCost: 85000,
        availability: 'limited',
        suitableScenes: ['3B - Helicopter Chase', '3C - Car Chase Finale'],
        pros: ['Iconic location', 'Dramatic visuals', 'Multiple angles', 'Natural lighting'],
        cons: ['Traffic restrictions', 'Weather dependent', 'Permit complexity', 'Safety concerns'],
        aiConfidence: 88,
        rating: 4.5,
        images: ['sealink_day.jpg', 'sealink_aerial.jpg'],
        permits: ['Mumbai Police NOC', 'Traffic Police Permission', 'Helicopter clearance'],
        facilities: ['Limited parking', 'No facilities on bridge']
      },
      {
        id: '3',
        name: 'Aarey Colony Forest',
        type: 'outdoor',
        description: 'Dense forest area ideal for magical forest scenes with natural mystical atmosphere',
        address: 'Aarey Colony, Goregaon East, Mumbai',
        estimatedCost: 25000,
        availability: 'available',
        suitableScenes: ['5A - Magical Forest Discovery', '5B - Creature Encounter'],
        pros: ['Natural forest setting', 'Cost-effective', 'Mystical atmosphere', 'Wildlife sounds'],
        cons: ['Weather dependent', 'Limited power access', 'Insect/wildlife issues', 'Monsoon restrictions'],
        aiConfidence: 90,
        rating: 4.3,
        images: ['forest_path.jpg', 'dense_trees.jpg'],
        permits: ['Forest Department Permission', 'Local Authority NOC'],
        facilities: ['Basic restrooms', 'Limited vehicle access']
      },
      {
        id: '4',
        name: 'Antilia Building Replica Set',
        type: 'green_screen',
        description: 'Green screen studio for building explosion sequence with safety and control',
        address: 'Mehboob Studios, Bandra West, Mumbai',
        estimatedCost: 120000,
        availability: 'available',
        suitableScenes: ['2C - Building Explosion'],
        pros: ['Complete safety', 'Unlimited takes', 'Weather independent', 'VFX-friendly'],
        cons: ['Requires extensive post-production', 'Higher VFX costs', 'Less realistic'],
        aiConfidence: 85,
        rating: 4.2,
        images: ['green_screen_setup.jpg', 'explosion_reference.jpg'],
        permits: ['Studio booking only'],
        facilities: ['Full production facilities', 'VFX preview setup', 'Green rooms']
      }
    ];

    const demoVFXSuggestions: VFXSuggestion[] = [
      {
        id: '1',
        sceneId: '2C',
        sceneName: 'Building Explosion',
        vfxType: 'Explosion Simulation',
        description: 'Large-scale building explosion with realistic debris, fire, and smoke effects',
        complexity: 'extreme',
        estimatedCost: 200000,
        estimatedTime: 120,
        requiredSoftware: ['Houdini', 'Maya', 'Nuke', 'After Effects'],
        recommendedArtists: ['Senior VFX Supervisor', 'Simulation Specialist', 'Compositing Artist'],
        aiReasoning: 'Script indicates massive explosion destroying 3-story building. Requires particle simulation for debris, fluid simulation for fire/smoke, and complex compositing.',
        confidence: 95,
        alternatives: [
          {
            type: 'Practical Effects + VFX Enhancement',
            cost: 150000,
            description: 'Use practical explosions with VFX enhancement for scale'
          },
          {
            type: 'Stock Footage Composite',
            cost: 80000,
            description: 'Use existing explosion footage with custom compositing'
          }
        ]
      },
      {
        id: '2',
        sceneId: '3B',
        sceneName: 'Helicopter Chase',
        vfxType: 'Vehicle CG + Environment',
        description: 'CG helicopter with rooftop environment extension and wire removal',
        complexity: 'high',
        estimatedCost: 150000,
        estimatedTime: 80,
        requiredSoftware: ['Maya', '3ds Max', 'Nuke', 'Substance Painter'],
        recommendedArtists: ['3D Modeler', 'Animator', 'Lighting Artist', 'Compositor'],
        aiReasoning: 'Real helicopter too dangerous for close shots. CG helicopter allows creative camera angles and safety. Environment extension needed for cityscape.',
        confidence: 92,
        alternatives: [
          {
            type: 'Drone + VFX Enhancement',
            cost: 100000,
            description: 'Use drone footage with VFX helicopter replacement'
          },
          {
            type: 'Miniature + Compositing',
            cost: 120000,
            description: 'Physical miniature helicopter with digital compositing'
          }
        ]
      },
      {
        id: '3',
        sceneId: '5A',
        sceneName: 'Magical Forest',
        vfxType: 'Creature Animation + Particle Effects',
        description: 'Glowing fairy creatures with magical particle effects and environment enhancement',
        complexity: 'high',
        estimatedCost: 180000,
        estimatedTime: 100,
        requiredSoftware: ['Maya', 'Houdini', 'Nuke', 'ZBrush'],
        recommendedArtists: ['Creature Animator', 'Particle Artist', 'Lighting Artist', 'Compositor'],
        aiReasoning: 'Script describes glowing fairy creatures and magical atmosphere. Requires character animation, particle systems for magic effects, and environment enhancement.',
        confidence: 88,
        alternatives: [
          {
            type: 'Practical Puppets + VFX',
            cost: 120000,
            description: 'Physical puppets with digital enhancement and glow effects'
          },
          {
            type: 'Motion Capture + CG',
            cost: 160000,
            description: 'Motion capture performance with full CG creatures'
          }
        ]
      },
      {
        id: '4',
        sceneId: '1A',
        sceneName: 'Coffee Shop Interior',
        vfxType: 'Window Replacement + Screen Inserts',
        description: 'Replace window view and add laptop screen content in post-production',
        complexity: 'low',
        estimatedCost: 25000,
        estimatedTime: 15,
        requiredSoftware: ['After Effects', 'Nuke', 'Photoshop'],
        recommendedArtists: ['Compositor', 'Motion Graphics Artist'],
        aiReasoning: 'Script mentions rainy weather outside but shooting on sunny day. Laptop screens need custom content for story continuity.',
        confidence: 98,
        alternatives: [
          {
            type: 'Practical Rain + Real Screens',
            cost: 15000,
            description: 'Use rain machines and prepare actual screen content'
          },
          {
            type: 'Green Screen Windows',
            cost: 20000,
            description: 'Green screen windows for complete control over exterior'
          }
        ]
      }
    ];

    setLocationSuggestions(demoLocationSuggestions);
    setVFXSuggestions(demoVFXSuggestions);
  }, []);

  const getAvailabilityColor = (availability: LocationSuggestion['availability']) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'limited': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'unavailable': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getComplexityColor = (complexity: VFXSuggestion['complexity']) => {
    switch (complexity) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'extreme': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: LocationSuggestion['type']) => {
    switch (type) {
      case 'studio': return <Camera className="h-4 w-4" />;
      case 'outdoor': return <MapPin className="h-4 w-4" />;
      case 'indoor': return <Users className="h-4 w-4" />;
      case 'green_screen': return <Palette className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const tabs = [
    { id: 'locations', label: 'Location Suggestions', icon: MapPin },
    { id: 'vfx', label: 'VFX Recommendations', icon: Palette }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <Brain className="h-6 w-6 mr-2" />
            AI Location & VFX Suggestions
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Intelligent recommendations based on script analysis and production requirements
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'locations' && (
        <motion.div
          key="locations"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Location Suggestions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {locationSuggestions.map((location) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedLocation(location)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-blue-600 dark:text-blue-400">
                      {getTypeIcon(location.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {location.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {location.type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAvailabilityColor(location.availability)}`}>
                      {location.availability}
                    </span>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {location.aiConfidence}% match
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-4">{location.description}</p>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Suitable for Scenes:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {location.suitableScenes.map((scene, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded"
                        >
                          {scene}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pros:</p>
                      <ul className="text-xs text-green-600 dark:text-green-400 space-y-1">
                        {location.pros.slice(0, 2).map((pro, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cons:</p>
                      <ul className="text-xs text-red-600 dark:text-red-400 space-y-1">
                        {location.cons.slice(0, 2).map((con, index) => (
                          <li key={index} className="flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          {location.rating}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {formatCurrency(location.estimatedCost)}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                          <ThumbsUp className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                          <ThumbsDown className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'vfx' && (
        <motion.div
          key="vfx"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* VFX Suggestions */}
          <div className="space-y-6">
            {vfxSuggestions.map((vfx) => (
              <motion.div
                key={vfx.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Palette className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {vfx.vfxType}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getComplexityColor(vfx.complexity)}`}>
                        {vfx.complexity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Scene: {vfx.sceneName}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{vfx.description}</p>
                  </div>
                  
                  <div className="text-right ml-6">
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(vfx.estimatedCost)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {vfx.estimatedTime} hours
                    </p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <Brain className="h-3 w-3 mr-1" />
                      {vfx.confidence}% confidence
                    </div>
                  </div>
                </div>

                {/* AI Reasoning */}
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2 flex items-center">
                    <Brain className="h-4 w-4 mr-2" />
                    AI Analysis
                  </h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300">{vfx.aiReasoning}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Required Software</h4>
                    <div className="flex flex-wrap gap-2">
                      {vfx.requiredSoftware.map((software, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                        >
                          {software}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Recommended Team</h4>
                    <div className="flex flex-wrap gap-2">
                      {vfx.recommendedArtists.map((artist, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded"
                        >
                          {artist}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Alternatives */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Alternative Approaches</h4>
                  <div className="space-y-3">
                    {vfx.alternatives.map((alt, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 dark:text-gray-100">{alt.type}</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{alt.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-bold text-gray-900 dark:text-gray-100">
                            {formatCurrency(alt.cost)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Save {formatCurrency(vfx.estimatedCost - alt.cost)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                    More Details
                  </button>
                  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                    Approve Suggestion
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
