import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Clock, CheckCircle, XCircle, AlertCircle, User, 
  DollarSign, FileText, Upload, Eye, MessageSquare, Calendar
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface BudgetRequest {
  id: string;
  title: string;
  description: string;
  amount: number;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'pm_review' | 'approved' | 'rejected' | 'funded';
  requestedBy: string;
  requestedByRole: string;
  requestDate: string;
  reviewedBy?: string;
  reviewDate?: string;
  approvedBy?: string;
  approvalDate?: string;
  rejectionReason?: string;
  attachments: string[];
  comments: {
    id: string;
    author: string;
    message: string;
    timestamp: string;
  }[];
}

interface BudgetTicketingSystemProps {
  currentUser: string;
  currentUserRole: string;
}

export const BudgetTicketingSystem: React.FC<BudgetTicketingSystemProps> = ({
  currentUser,
  currentUserRole
}) => {
  const [requests, setRequests] = useState<BudgetRequest[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BudgetRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    amount: 0,
    category: '',
    priority: 'medium' as const
  });

  // Demo data initialization
  useEffect(() => {
    const demoRequests: BudgetRequest[] = [
      {
        id: '1',
        title: 'RED Epic Camera Rental',
        description: 'Need to rent RED Epic camera for Scene 3B helicopter chase sequence. Current equipment insufficient for high-speed shots.',
        amount: 45000,
        category: 'Equipment Rental',
        priority: 'high',
        status: 'approved',
        requestedBy: 'Sarah Wilson',
        requestedByRole: 'Cinematographer',
        requestDate: '2024-01-15T10:30:00Z',
        reviewedBy: 'Production Manager',
        reviewDate: '2024-01-16T14:20:00Z',
        approvedBy: 'Jane Producer',
        approvalDate: '2024-01-16T16:45:00Z',
        attachments: ['camera_specs.pdf', 'rental_quote.pdf'],
        comments: [
          {
            id: '1',
            author: 'Production Manager',
            message: 'Approved for review. Camera specs look good for the helicopter sequence.',
            timestamp: '2024-01-16T14:20:00Z'
          },
          {
            id: '2',
            author: 'Jane Producer',
            message: 'Approved. Essential for the quality we need.',
            timestamp: '2024-01-16T16:45:00Z'
          }
        ]
      },
      {
        id: '2',
        title: 'Additional VFX Artist',
        description: 'Need to hire freelance VFX artist for explosion simulation. Current team overloaded.',
        amount: 80000,
        category: 'Personnel',
        priority: 'urgent',
        status: 'pm_review',
        requestedBy: 'Tom Rodriguez',
        requestedByRole: 'VFX Supervisor',
        requestDate: '2024-01-18T09:15:00Z',
        attachments: ['artist_portfolio.pdf'],
        comments: [
          {
            id: '1',
            author: 'Tom Rodriguez',
            message: 'This artist has experience with similar explosion effects.',
            timestamp: '2024-01-18T09:15:00Z'
          }
        ]
      },
      {
        id: '3',
        title: 'Location Permit Extension',
        description: 'Need to extend shooting permit for coffee shop location due to weather delays.',
        amount: 15000,
        category: 'Location',
        priority: 'medium',
        status: 'rejected',
        requestedBy: 'Alex Chen',
        requestedByRole: 'Assistant Director',
        requestDate: '2024-01-17T11:00:00Z',
        reviewedBy: 'Production Manager',
        reviewDate: '2024-01-17T15:30:00Z',
        rejectionReason: 'Alternative indoor location already secured. Extension not necessary.',
        attachments: [],
        comments: [
          {
            id: '1',
            author: 'Production Manager',
            message: 'We have backup location ready. Rejecting to save costs.',
            timestamp: '2024-01-17T15:30:00Z'
          }
        ]
      },
      {
        id: '4',
        title: 'Costume Emergency Replacement',
        description: 'Lead actor costume damaged during stunt. Need immediate replacement.',
        amount: 25000,
        category: 'Costume',
        priority: 'urgent',
        status: 'funded',
        requestedBy: 'Lisa Park',
        requestedByRole: 'Costume Designer',
        requestDate: '2024-01-19T08:00:00Z',
        reviewedBy: 'Production Manager',
        reviewDate: '2024-01-19T08:30:00Z',
        approvedBy: 'Jane Producer',
        approvalDate: '2024-01-19T09:00:00Z',
        attachments: ['damage_photos.jpg', 'replacement_quote.pdf'],
        comments: [
          {
            id: '1',
            author: 'Production Manager',
            message: 'Emergency approved. Fast-track to producer.',
            timestamp: '2024-01-19T08:30:00Z'
          },
          {
            id: '2',
            author: 'Jane Producer',
            message: 'Approved and funded immediately.',
            timestamp: '2024-01-19T09:00:00Z'
          }
        ]
      }
    ];
    setRequests(demoRequests);
  }, []);

  const getStatusColor = (status: BudgetRequest['status']) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'pm_review': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'funded': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: BudgetRequest['priority']) => {
    switch (priority) {
      case 'low': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'urgent': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const filteredRequests = requests.filter(request => {
    if (filterStatus === 'all') return true;
    return request.status === filterStatus;
  });

  const canCreateRequest = currentUserRole !== 'Production Manager';
  const canReview = currentUserRole === 'Producer';
  const canApprove = currentUserRole === 'Production Manager';

  const handleCreateRequest = () => {
    if (newRequest.title && newRequest.amount > 0) {
      const request: BudgetRequest = {
        id: Date.now().toString(),
        ...newRequest,
        status: 'pending',
        requestedBy: currentUser,
        requestedByRole: currentUserRole,
        requestDate: new Date().toISOString(),
        attachments: [],
        comments: []
      };
      setRequests([request, ...requests]);
      setNewRequest({
        title: '',
        description: '',
        amount: 0,
        category: '',
        priority: 'medium'
      });
      setShowCreateForm(false);
    }
  };

  const handleStatusUpdate = (requestId: string, newStatus: BudgetRequest['status'], reason?: string) => {
    setRequests(requests.map(request => {
      if (request.id === requestId) {
        const updatedRequest = { ...request, status: newStatus };
        
        if (newStatus === 'pm_review' || newStatus === 'approved' || newStatus === 'rejected') {
          updatedRequest.reviewedBy = currentUser;
          updatedRequest.reviewDate = new Date().toISOString();
        }
        
        if (newStatus === 'approved' || newStatus === 'funded') {
          updatedRequest.approvedBy = currentUser;
          updatedRequest.approvalDate = new Date().toISOString();
        }
        
        if (newStatus === 'rejected' && reason) {
          updatedRequest.rejectionReason = reason;
        }
        
        return updatedRequest;
      }
      return request;
    }));
  };

  // Statistics
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    pmReview: requests.filter(r => r.status === 'pm_review').length,
    approved: requests.filter(r => r.status === 'approved').length,
    totalAmount: requests.reduce((sum, r) => sum + r.amount, 0),
    approvedAmount: requests.filter(r => r.status === 'approved' || r.status === 'funded').reduce((sum, r) => sum + r.amount, 0)
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.pending}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Review</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.pmReview}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.approved}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved Amount</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(stats.approvedAmount)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 gap-4">
          <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="pm_review">PM Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="funded">Funded</option>
            </select>
          </div>
          
          {canCreateRequest && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden xs:inline">New Budget Request</span>
              <span className="xs:hidden">New Request</span>
            </button>
          )}
        </div>
      </div>

      {/* Create Request Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Create Budget Request</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Request Title
              </label>
              <input
                type="text"
                value={newRequest.title}
                onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="e.g., Camera Equipment Rental"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount (₹)
              </label>
              <input
                type="number"
                value={newRequest.amount}
                onChange={(e) => setNewRequest({ ...newRequest, amount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={newRequest.category}
                onChange={(e) => setNewRequest({ ...newRequest, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Select category...</option>
                <option value="Equipment Rental">Equipment Rental</option>
                <option value="Personnel">Personnel</option>
                <option value="Location">Location</option>
                <option value="Costume">Costume</option>
                <option value="Props">Props</option>
                <option value="Transportation">Transportation</option>
                <option value="Catering">Catering</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={newRequest.priority}
                onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value as BudgetRequest['priority'] })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={newRequest.description}
                onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Detailed description of the budget request..."
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
              onClick={handleCreateRequest}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Submit Request
            </button>
          </div>
        </motion.div>
      )}

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {request.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                    {request.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`text-sm font-medium ${getPriorityColor(request.priority)}`}>
                    {request.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-3">{request.description}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {request.requestedBy} ({request.requestedByRole})
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {formatCurrency(request.amount)}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(request.requestDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {request.comments.length} comments
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => setSelectedRequest(request)}
                  className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </button>
                
                {canReview && request.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(request.id, 'pm_review')}
                      className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      Review
                    </button>
                  </>
                )}
                
                {canApprove && request.status === 'pm_review' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(request.id, 'approved')}
                      className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(request.id, 'rejected', 'Rejected by production manager')}
                      className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No budget requests found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {canCreateRequest ? 'Create your first budget request to get started.' : 'No requests match your current filter.'}
          </p>
        </div>
      )}
    </div>
  );
};
