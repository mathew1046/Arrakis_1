import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Monitor, Plus, Edit3, Eye, DollarSign, Users, TrendingUp,
  Globe, Star, X
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface Platform {
  id: string;
  name: string;
  type: 'streaming' | 'theatrical' | 'digital' | 'broadcast';
  status: 'active' | 'pending' | 'negotiating' | 'inactive';
  contractStart: string;
  contractEnd: string;
  revenue: number;
  views: number;
  rating: number;
  territories: string[];
  revenueShare: number;
  minimumGuarantee: number;
  deliveryDeadline: string;
  technicalSpecs: {
    resolution: string;
    format: string;
    audioChannels: string;
    subtitles: string[];
  };
  contact: {
    name: string;
    email: string;
    phone: string;
  };
}

export const PlatformManagement: React.FC = () => {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Demo data initialization
  useEffect(() => {
    const demoPlatforms: Platform[] = [
      {
        id: '1',
        name: 'Netflix',
        type: 'streaming',
        status: 'active',
        contractStart: '2024-01-01',
        contractEnd: '2026-12-31',
        revenue: 850000,
        views: 450000,
        rating: 4.3,
        territories: ['US', 'CA', 'UK', 'AU'],
        revenueShare: 70,
        minimumGuarantee: 500000,
        deliveryDeadline: '2024-02-15',
        technicalSpecs: {
          resolution: '4K UHD',
          format: 'H.264/H.265',
          audioChannels: '5.1 Surround',
          subtitles: ['EN', 'ES', 'FR', 'DE']
        },
        contact: {
          name: 'Sarah Johnson',
          email: 'sarah.johnson@netflix.com',
          phone: '+1-555-0123'
        }
      },
      {
        id: '2',
        name: 'Amazon Prime',
        type: 'streaming',
        status: 'active',
        contractStart: '2024-01-15',
        contractEnd: '2025-01-15',
        revenue: 620000,
        views: 320000,
        rating: 4.1,
        territories: ['US', 'UK', 'DE', 'JP'],
        revenueShare: 65,
        minimumGuarantee: 300000,
        deliveryDeadline: '2024-03-01',
        technicalSpecs: {
          resolution: '4K UHD',
          format: 'H.264',
          audioChannels: '5.1 Surround',
          subtitles: ['EN', 'ES', 'DE', 'JA']
        },
        contact: {
          name: 'Michael Chen',
          email: 'michael.chen@amazon.com',
          phone: '+1-555-0456'
        }
      },
      {
        id: '3',
        name: 'Disney+',
        type: 'streaming',
        status: 'pending',
        contractStart: '',
        contractEnd: '',
        revenue: 0,
        views: 0,
        rating: 0,
        territories: ['US', 'CA', 'UK', 'AU', 'NZ'],
        revenueShare: 75,
        minimumGuarantee: 800000,
        deliveryDeadline: '2024-04-01',
        technicalSpecs: {
          resolution: '4K UHD',
          format: 'H.265',
          audioChannels: '7.1 Surround',
          subtitles: ['EN', 'ES', 'FR']
        },
        contact: {
          name: 'Emma Rodriguez',
          email: 'emma.rodriguez@disney.com',
          phone: '+1-555-0789'
        }
      },
      {
        id: '4',
        name: 'HBO Max',
        type: 'streaming',
        status: 'active',
        contractStart: '2024-02-01',
        contractEnd: '2025-02-01',
        revenue: 480000,
        views: 280000,
        rating: 4.4,
        territories: ['US', 'UK'],
        revenueShare: 68,
        minimumGuarantee: 250000,
        deliveryDeadline: '2024-03-15',
        technicalSpecs: {
          resolution: '4K UHD',
          format: 'H.264',
          audioChannels: '5.1 Surround',
          subtitles: ['EN', 'ES']
        },
        contact: {
          name: 'David Kim',
          email: 'david.kim@hbomax.com',
          phone: '+1-555-0321'
        }
      },
      {
        id: '5',
        name: 'Apple TV+',
        type: 'streaming',
        status: 'pending', // Status in UI will appear as "In Review", custom mapping in the dashboard
        contractStart: '',
        contractEnd: '',
        revenue: 0,
        views: 0,
        rating: 0,
        territories: ['US', 'CA', 'UK', 'EU'],
        revenueShare: 70,
        minimumGuarantee: 450000,
        deliveryDeadline: '2024-04-15',
        technicalSpecs: {
          resolution: '4K UHD',
          format: 'H.265',
          audioChannels: '5.1 Surround',
          subtitles: ['EN', 'ES', 'FR', 'IT']
        },
        contact: {
          name: 'Lisa Thompson',
          email: 'lisa.thompson@apple.com',
          phone: '+1-555-4567'
        }
      },
      {
        id: '6',
        name: 'Paramount+',
        type: 'streaming',
        status: 'negotiating',
        contractStart: '',
        contractEnd: '',
        revenue: 0,
        views: 0,
        rating: 0,
        territories: ['US', 'CA'],
        revenueShare: 65,
        minimumGuarantee: 350000,
        deliveryDeadline: '2024-05-01',
        technicalSpecs: {
          resolution: '4K UHD',
          format: 'H.264',
          audioChannels: '5.1 Surround',
          subtitles: ['EN', 'ES', 'FR']
        },
        contact: {
          name: 'Robert Wilson',
          email: 'robert.wilson@paramount.com',
          phone: '+1-555-7890'
        }
      },
      {
        id: '7',
        name: 'Peacock',
        type: 'streaming',
        status: 'active',
        contractStart: '2024-02-15',
        contractEnd: '2025-02-15',
        revenue: 180000,
        views: 50000,
        rating: 4.0,
        territories: ['US'],
        revenueShare: 60,
        minimumGuarantee: 150000,
        deliveryDeadline: '2024-02-01',
        technicalSpecs: {
          resolution: '4K UHD',
          format: 'H.264',
          audioChannels: '5.1 Surround',
          subtitles: ['EN', 'ES']
        },
        contact: {
          name: 'Jennifer Adams',
          email: 'jennifer.adams@peacock.com',
          phone: '+1-555-2345'
        }
      }
    ];
    setPlatforms(demoPlatforms);
  }, []);

  const filteredPlatforms = platforms.filter(platform => {
    const matchesSearch = platform.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         platform.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || platform.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Maps internal status values to display values matching the dashboard
  const getDisplayStatus = (status: Platform['status'], platformName: string) => {
    switch (status) {
      case 'active': return 'Live';
      case 'pending': return platformName === 'Apple TV+' ? 'In Review' : 'Pending';
      case 'negotiating': return 'Negotiating';
      case 'inactive': return 'Inactive';
      default: return status;
    }
  };
  
  const getStatusColor = (status: Platform['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'negotiating': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: Platform['type']) => {
    switch (type) {
      case 'streaming': return <Monitor className="h-4 w-4" />;
      case 'theatrical': return <Globe className="h-4 w-4" />;
      case 'digital': return <Users className="h-4 w-4" />;
      case 'broadcast': return <TrendingUp className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const totalRevenue = platforms.reduce((sum, platform) => sum + platform.revenue, 0);
  const activePlatforms = platforms.filter(p => p.status === 'active').length;
  const totalViews = platforms.reduce((sum, platform) => sum + platform.views, 0);
  const averageRating = platforms.length > 0 
    ? platforms.reduce((sum, platform) => sum + platform.rating, 0) / platforms.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Monitor className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Platforms</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{activePlatforms}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {(totalViews / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {averageRating.toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              placeholder="Search platforms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Status</option>
              <option value="active">Live</option>
              <option value="pending">Pending</option>
              <option value="negotiating">Negotiating</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Platform
          </button>
        </div>
      </div>

      {/* Platforms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPlatforms.map((platform) => (
          <motion.div
            key={platform.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getTypeIcon(platform.type)}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {platform.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {platform.type}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(platform.status)}`}>
                  {getDisplayStatus(platform.status, platform.name)}
                </span>
                <button
                  onClick={() => setEditingPlatform(platform)}
                  className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {platform.status === 'active' && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(platform.revenue)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Views</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {(platform.views / 1000).toFixed(0)}K
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    ⭐ {platform.rating.toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Revenue Share</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {platform.revenueShare}%
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Territories</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {platform.territories.join(', ')}
                </span>
              </div>
              
              {platform.contractStart && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Contract Period</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {platform.contractStart} - {platform.contractEnd}
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Contact</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {platform.contact.name}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Min. Guarantee: {formatCurrency(platform.minimumGuarantee)}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Delivery: {platform.deliveryDeadline}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPlatforms.length === 0 && (
        <div className="text-center py-12">
          <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No platforms found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search or filters, or add a new platform.
          </p>
        </div>
      )}

      {/* Create/Edit Form Modal would go here */}
      {(showCreateForm || editingPlatform) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {editingPlatform ? 'Edit Platform' : 'Add New Platform'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingPlatform(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Platform form implementation coming soon...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
