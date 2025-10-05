import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Upload,
  Eye,
  Download,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  Filter,
  Search,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { RoleGuard } from '../../components/auth/RoleGuard';
import { formatDate, getStatusColor, getPriorityColor } from '../../utils/formatters';

interface VFXShot {
  id: string;
  shotName: string;
  sceneId: string;
  description: string;
  status: 'todo' | 'in_progress' | 'in_review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
  versions: VFXVersion[];
  estimatedHours: number;
  complexity: 'low' | 'medium' | 'high';
}

interface VFXVersion {
  version: string;
  date: string;
  status: string;
  notes: string;
  fileSize: string;
}

export const VFX: React.FC = () => {
  const [shots, setShots] = useState<VFXShot[]>(vfxData as VFXShot[]);
  const [selectedShot, setSelectedShot] = useState<VFXShot | null>(null);
  const [showShotModal, setShowShotModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredShots = shots.filter(shot => {
    const matchesSearch = shot.shotName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shot.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || shot.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || shot.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const handleStatusUpdate = (shotId: string, newStatus: VFXShot['status']) => {
    setShots(prev => prev.map(shot => 
      shot.id === shotId ? { ...shot, status: newStatus } : shot
    ));
  };

  const handleUploadVersion = (shotId: string) => {
    setSelectedShot(shots.find(shot => shot.id === shotId) || null);
    setShowVersionModal(true);
  };

  const shotStats = {
    total: shots.length,
    todo: shots.filter(s => s.status === 'todo').length,
    inProgress: shots.filter(s => s.status === 'in_progress').length,
    inReview: shots.filter(s => s.status === 'in_review').length,
    done: shots.filter(s => s.status === 'done').length,
  };

  return (
    <RoleGuard permissions={['view_vfx_tasks', 'upload_versions', 'request_review']}>
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
              VFX Pipeline
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage VFX shots and versions
            </p>
          </div>
          <Button onClick={() => setShowShotModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New VFX Shot
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="card p-4 text-center">
            <Zap className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{shotStats.total}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Shots</p>
          </div>
          
          <div className="card p-4 text-center">
            <Clock className="h-6 w-6 text-gray-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{shotStats.todo}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">To Do</p>
          </div>
          
          <div className="card p-4 text-center">
            <AlertTriangle className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{shotStats.inProgress}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
          </div>
          
          <div className="card p-4 text-center">
            <Eye className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{shotStats.inReview}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">In Review</p>
          </div>
          
          <div className="card p-4 text-center">
            <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{shotStats.done}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search VFX shots..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field w-auto"
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="in_review">In Review</option>
              <option value="done">Done</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input-field w-auto"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* VFX Shots Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Shot Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Description</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Priority</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Complexity</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Due Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Versions</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredShots.map((shot) => {
                  const isOverdue = new Date(shot.dueDate) < new Date() && shot.status !== 'done';
                  
                  return (
                    <tr key={shot.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                        {shot.shotName}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400 max-w-xs">
                        <div className="truncate" title={shot.description}>
                          {shot.description}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(shot.status)}`}>
                          {shot.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(shot.priority)}`}>
                          {shot.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getComplexityColor(shot.complexity)}`}>
                          {shot.complexity}
                        </span>
                      </td>
                      <td className={`py-3 px-4 text-sm ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                        {formatDate(shot.dueDate)}
                        {isOverdue && <span className="block text-xs">Overdue</span>}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        v{shot.versions.length}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUploadVersion(shot.id)}
                            title="Upload Version"
                          >
                            <Upload className="h-3 w-3" />
                          </Button>
                          
                          {shot.versions.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Download Latest"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          )}
                          
                          {shot.status === 'in_progress' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusUpdate(shot.id, 'in_review')}
                              title="Request Review"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          )}
                          
                          {shot.status === 'in_review' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusUpdate(shot.id, 'done')}
                              title="Approve"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Empty State */}
        {filteredShots.length === 0 && (
          <div className="text-center py-12">
            <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No VFX shots found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first VFX shot to get started'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && (
              <Button onClick={() => setShowShotModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New VFX Shot
              </Button>
            )}
          </div>
        )}

        {/* New Shot Modal */}
        <Modal
          isOpen={showShotModal}
          onClose={() => setShowShotModal(false)}
          title="Create New VFX Shot"
          size="lg"
        >
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              VFX shot creation form would go here...
            </p>
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="secondary" onClick={() => setShowShotModal(false)}>
                Cancel
              </Button>
              <Button>
                Create Shot
              </Button>
            </div>
          </div>
        </Modal>

        {/* Upload Version Modal */}
        <Modal
          isOpen={showVersionModal}
          onClose={() => setShowVersionModal(false)}
          title={`Upload Version - ${selectedShot?.shotName}`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Upload VFX Version
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Drop your VFX file here or click to select
              </p>
              <Button variant="secondary">
                Select File
              </Button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Version Notes
              </label>
              <textarea
                rows={3}
                className="input-field resize-none"
                placeholder="Describe the changes in this version..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="secondary" onClick={() => setShowVersionModal(false)}>
                Cancel
              </Button>
              <Button>
                Upload Version
              </Button>
            </div>
          </div>
        </Modal>
      </motion.div>
    </RoleGuard>
  );
};
