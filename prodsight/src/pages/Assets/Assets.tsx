import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  File,
  Image,
  Video,
  Music,
  FileText,
  Download,
  Trash2,
  Search,
  Filter,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { RoleGuard } from '../../components/auth/RoleGuard';
import { formatFileSize, formatDate } from '../../utils/formatters';
import { assetsApi } from '../../api/endpoints';
import { useNotification } from '../../providers/NotificationProvider';

interface Asset {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  url: string;
  category?: string;
}

export const Assets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { showSuccess, showError } = useNotification();

  // Load assets on component mount
  React.useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      setLoading(true);
      const assetList = await assetsApi.getAssets();
      setAssets(assetList);
    } catch (error) {
      showError('Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      await handleFileUpload(files);
    }
  }, []);

  const handleFileUpload = async (files: File[]) => {
    setLoading(true);
    
    for (const file of files) {
      try {
        const result = await assetsApi.uploadAsset(file);
        if (result.success) {
          const newAsset: Asset = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            type: file.type,
            uploadDate: new Date().toISOString(),
            url: result.url,
            category: getFileCategory(file.type),
          };
          
          setAssets(prev => [newAsset, ...prev]);
          showSuccess(`${file.name} uploaded successfully`);
        }
      } catch (error) {
        showError(`Failed to upload ${file.name}`);
      }
    }
    
    setLoading(false);
    setUploadModalOpen(false);
  };

  const getFileCategory = (type: string): string => {
    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/')) return 'audio';
    if (type.includes('pdf') || type.includes('document')) return 'document';
    return 'other';
  };

  const getFileIcon = (type: string) => {
    const category = getFileCategory(type);
    switch (category) {
      case 'image':
        return <Image className="h-8 w-8 text-green-500" />;
      case 'video':
        return <Video className="h-8 w-8 text-blue-500" />;
      case 'audio':
        return <Music className="h-8 w-8 text-purple-500" />;
      case 'document':
        return <FileText className="h-8 w-8 text-red-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || getFileCategory(asset.type) === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (assetId: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== assetId));
    showSuccess('Asset deleted successfully');
  };

  return (
    <RoleGuard permissions={['upload_assets', 'view_all']}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Asset Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Upload and manage production assets
            </p>
          </div>
          <Button onClick={() => setUploadModalOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Assets
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field w-auto"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="audio">Audio</option>
              <option value="document">Documents</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Assets Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredAssets.map((asset, index) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                {getFileIcon(asset.type)}
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="p-1">
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-1 text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(asset.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1 truncate" title={asset.name}>
                {asset.name}
              </h3>
              
              <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                <p>{formatFileSize(asset.size)}</p>
                <p>{formatDate(asset.uploadDate)}</p>
                <p className="capitalize">{getFileCategory(asset.type)}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredAssets.length === 0 && !loading && (
          <div className="text-center py-12">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No assets found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Upload your first asset to get started'
              }
            </p>
            {!searchTerm && filterType === 'all' && (
              <Button onClick={() => setUploadModalOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Assets
              </Button>
            )}
          </div>
        )}

        {/* Upload Modal */}
        <Modal
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          title="Upload Assets"
          size="lg"
        >
          <div className="space-y-6">
            {/* Drag and Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Drop files here to upload
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Or click to select files from your computer
              </p>
              <input
                type="file"
                multiple
                className="hidden"
                id="file-upload"
                onChange={(e) => {
                  if (e.target.files) {
                    handleFileUpload(Array.from(e.target.files));
                  }
                }}
              />
              <label htmlFor="file-upload">
                <Button variant="secondary" className="cursor-pointer">
                  Select Files
                </Button>
              </label>
            </div>

            {/* Supported Formats */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p className="font-medium mb-2">Supported formats:</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p><strong>Images:</strong> JPG, PNG, GIF, SVG</p>
                  <p><strong>Videos:</strong> MP4, MOV, AVI</p>
                </div>
                <div>
                  <p><strong>Audio:</strong> MP3, WAV, AAC</p>
                  <p><strong>Documents:</strong> PDF, DOC, TXT</p>
                </div>
              </div>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">Uploading...</span>
              </div>
            )}
          </div>
        </Modal>
      </motion.div>
    </RoleGuard>
  );
};
