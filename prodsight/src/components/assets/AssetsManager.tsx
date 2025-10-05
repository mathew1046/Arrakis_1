import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderOpen,
  Upload,
  Download,
  Search,
  Filter,
  Grid,
  List,
  Eye,
  Edit,
  Trash2,
  Plus,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Star,
  Clock,
  User,
  Tag
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'archive';
  size: number;
  uploadDate: string;
  uploadedBy: string;
  category: string;
  tags: string[];
  status: 'approved' | 'pending' | 'rejected';
  thumbnail?: string;
  description?: string;
  version: number;
  isFavorite: boolean;
}

interface AssetsManagerProps {
  currentUser: string;
}

export const AssetsManager: React.FC<AssetsManagerProps> = ({ currentUser }) => {
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: '1',
      name: 'Hero_Shot_Final_v3.mp4',
      type: 'video',
      size: 2500000000, // 2.5GB
      uploadDate: '2024-10-01T10:30:00Z',
      uploadedBy: 'Director',
      category: 'Footage',
      tags: ['hero', 'final', 'approved'],
      status: 'approved',
      description: 'Final hero shot with VFX compositing',
      version: 3,
      isFavorite: true
    },
    {
      id: '2',
      name: 'Location_Stills_Mumbai.zip',
      type: 'archive',
      size: 150000000, // 150MB
      uploadDate: '2024-09-28T14:20:00Z',
      uploadedBy: 'Location Scout',
      category: 'Reference',
      tags: ['location', 'mumbai', 'stills'],
      status: 'approved',
      description: 'High-res location reference photos',
      version: 1,
      isFavorite: false
    },
    {
      id: '3',
      name: 'Script_Draft_v5.pdf',
      type: 'document',
      size: 5000000, // 5MB
      uploadDate: '2024-10-02T09:15:00Z',
      uploadedBy: 'Writer',
      category: 'Script',
      tags: ['script', 'draft', 'review'],
      status: 'pending',
      description: 'Latest script revision for review',
      version: 5,
      isFavorite: false
    },
    {
      id: '4',
      name: 'Background_Score_Theme.wav',
      type: 'audio',
      size: 80000000, // 80MB
      uploadDate: '2024-09-30T16:45:00Z',
      uploadedBy: 'Music Director',
      category: 'Audio',
      tags: ['music', 'theme', 'background'],
      status: 'approved',
      description: 'Main theme background score',
      version: 2,
      isFavorite: true
    },
    {
      id: '5',
      name: 'VFX_Concept_Art.jpg',
      type: 'image',
      size: 15000000, // 15MB
      uploadDate: '2024-09-29T11:30:00Z',
      uploadedBy: 'VFX Artist',
      category: 'Concept',
      tags: ['vfx', 'concept', 'art'],
      status: 'approved',
      description: 'Concept art for explosion sequence',
      version: 1,
      isFavorite: false
    }
  ]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const getFileIcon = (type: Asset['type']) => {
    switch (type) {
      case 'image': return <Image className="h-8 w-8 text-blue-500" />;
      case 'video': return <Video className="h-8 w-8 text-purple-500" />;
      case 'audio': return <Music className="h-8 w-8 text-green-500" />;
      case 'document': return <FileText className="h-8 w-8 text-red-500" />;
      case 'archive': return <Archive className="h-8 w-8 text-orange-500" />;
      default: return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: Asset['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || asset.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(assets.map(asset => asset.category)));
  const totalSize = assets.reduce((sum, asset) => sum + asset.size, 0);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FolderOpen className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Assets</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{assets.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Archive className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Size</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatFileSize(totalSize)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Favorites</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {assets.filter(asset => asset.isFavorite).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {assets.filter(asset => asset.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 gap-4">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex space-x-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Upload Button */}
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Asset
            </button>
          </div>
        </div>
      </div>

      {/* Assets Display */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 sm:p-6">
            {filteredAssets.map((asset) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  {getFileIcon(asset.type)}
                  <div className="flex items-center space-x-1">
                    {asset.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(asset.status)}`}>
                      {asset.status}
                    </span>
                  </div>
                </div>
                
                <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-2 truncate">
                  {asset.name}
                </h3>
                
                <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                  <p>Size: {formatFileSize(asset.size)}</p>
                  <p>Version: {asset.version}</p>
                  <p>By: {asset.uploadedBy}</p>
                  <p>{formatDate(asset.uploadDate)}</p>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {asset.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                  {asset.tags.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 text-xs rounded">
                      +{asset.tags.length - 2}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex space-x-1">
                    <button className="p-1 text-gray-400 hover:text-blue-500 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-green-500 transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-orange-500 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Size</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Uploaded By</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Date</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(asset.type)}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{asset.name}</p>
                          {asset.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">{asset.description}</p>
                          )}
                        </div>
                        {asset.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400 capitalize">{asset.type}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{formatFileSize(asset.size)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(asset.status)}`}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{asset.uploadedBy}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{formatDate(asset.uploadDate)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end space-x-1">
                        <button className="p-1 text-gray-400 hover:text-blue-500 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-green-500 transition-colors">
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-orange-500 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredAssets.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No assets found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};
