import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Target, Plus, Edit3, Trash2, Eye, DollarSign, Users, TrendingUp,
  Share2, MessageCircle, Heart, Play, Pause, BarChart3, Calendar
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface Campaign {
  id: string;
  name: string;
  type: 'social_media' | 'influencer' | 'traditional' | 'digital' | 'pr' | 'events';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  reach: number;
  impressions: number;
  engagement: number;
  clicks: number;
  conversions: number;
  ctr: number; // Click-through rate
  cpm: number; // Cost per mille
  platforms: string[];
  targetAudience: {
    ageRange: string;
    gender: string;
    interests: string[];
    locations: string[];
  };
  creatives: {
    images: number;
    videos: number;
    copy: number;
  };
  kpis: {
    awareness: number;
    consideration: number;
    intent: number;
  };
}

export const MarketingCampaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Demo data initialization
  useEffect(() => {
    const demoCampaigns: Campaign[] = [
      {
        id: '1',
        name: 'Social Media Blitz',
        type: 'social_media', // Matches "Social Media Blitz" in dashboard
        status: 'active',
        budget: 50000,
        spent: 42000,
        startDate: '2024-01-15',
        endDate: '2024-03-15',
        reach: 2500000,
        impressions: 8500000,
        engagement: 4.2,
        clicks: 125000,
        conversions: 3200,
        ctr: 1.47,
        cpm: 4.94,
        platforms: ['Facebook', 'Instagram', 'Twitter', 'TikTok'],
        targetAudience: {
          ageRange: '18-45',
          gender: 'All',
          interests: ['Movies', 'Entertainment', 'Drama'],
          locations: ['US', 'CA', 'UK', 'AU']
        },
        creatives: {
          images: 25,
          videos: 8,
          copy: 15
        },
        kpis: {
          awareness: 78,
          consideration: 65,
          intent: 42
        }
      },
      {
        id: '2',
        name: 'Influencer Partnerships',
        type: 'influencer', // Matches "Influencer Partnerships" in dashboard
        status: 'active',
        budget: 75000,
        spent: 68000,
        startDate: '2024-01-20',
        endDate: '2024-04-20',
        reach: 1800000,
        impressions: 5200000,
        engagement: 6.1,
        clicks: 89000,
        conversions: 2800,
        ctr: 1.71,
        cpm: 13.08,
        platforms: ['Instagram', 'YouTube', 'TikTok'],
        targetAudience: {
          ageRange: '16-35',
          gender: 'All',
          interests: ['Film Reviews', 'Pop Culture', 'Entertainment'],
          locations: ['US', 'UK', 'CA']
        },
        creatives: {
          images: 45,
          videos: 22,
          copy: 30
        },
        kpis: {
          awareness: 82,
          consideration: 71,
          intent: 58
        }
      },
      {
        id: '3',
        name: 'Traditional Media',
        type: 'traditional', // Matches "Traditional Media" in dashboard
        status: 'completed',
        budget: 40000,
        spent: 35000,
        startDate: '2024-01-10',
        endDate: '2024-02-10',
        reach: 800000,
        impressions: 2400000,
        engagement: 2.8,
        clicks: 45000,
        conversions: 1200,
        ctr: 1.88,
        cpm: 14.58,
        platforms: ['TV', 'Radio', 'Print'],
        targetAudience: {
          ageRange: '25-65',
          gender: 'All',
          interests: ['Drama', 'Quality Entertainment'],
          locations: ['US', 'CA']
        },
        creatives: {
          images: 12,
          videos: 5,
          copy: 8
        },
        kpis: {
          awareness: 68,
          consideration: 52,
          intent: 35
        }
      },
      {
        id: '4',
        name: 'Digital Advertising',
        type: 'digital', // Matches "Digital Advertising" in dashboard
        status: 'active',
        budget: 60000,
        spent: 55000,
        startDate: '2024-02-01',
        endDate: '2024-05-01',
        reach: 3200000,
        impressions: 12000000,
        engagement: 3.5,
        clicks: 180000,
        conversions: 4500,
        ctr: 1.5,
        cpm: 4.58,
        platforms: ['Google Ads', 'YouTube', 'Display Network'],
        targetAudience: {
          ageRange: '18-55',
          gender: 'All',
          interests: ['Movies', 'Streaming', 'Entertainment'],
          locations: ['US', 'CA', 'UK', 'AU', 'DE']
        },
        creatives: {
          images: 35,
          videos: 15,
          copy: 25
        },
        kpis: {
          awareness: 75,
          consideration: 68,
          intent: 48
        }
      },
      {
        id: '5',
        name: 'PR & Events',
        type: 'pr',
        status: 'draft',
        budget: 30000,
        spent: 0,
        startDate: '2024-03-01',
        endDate: '2024-04-15',
        reach: 0,
        impressions: 0,
        engagement: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        cpm: 0,
        platforms: ['Press', 'Events', 'Interviews'],
        targetAudience: {
          ageRange: '25-65',
          gender: 'All',
          interests: ['Film Industry', 'Entertainment News'],
          locations: ['US', 'UK']
        },
        creatives: {
          images: 0,
          videos: 0,
          copy: 0
        },
        kpis: {
          awareness: 0,
          consideration: 0,
          intent: 0
        }
      }
    ];
    setCampaigns(demoCampaigns);
  }, []);

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesType = typeFilter === 'all' || campaign.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: Campaign['type']) => {
    switch (type) {
      case 'social_media': return <Share2 className="h-4 w-4" />;
      case 'influencer': return <Users className="h-4 w-4" />;
      case 'traditional': return <Target className="h-4 w-4" />;
      case 'digital': return <BarChart3 className="h-4 w-4" />;
      case 'pr': return <MessageCircle className="h-4 w-4" />;
      case 'events': return <Calendar className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  // Calculate totals
  const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
  const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  const totalReach = campaigns.reduce((sum, campaign) => sum + campaign.reach, 0);
  const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);
  const averageEngagement = campaigns.length > 0 
    ? campaigns.reduce((sum, campaign) => sum + campaign.engagement, 0) / campaigns.length 
    : 0;

  const toggleCampaignStatus = (campaignId: string) => {
    setCampaigns(campaigns.map(campaign => {
      if (campaign.id === campaignId) {
        const newStatus = campaign.status === 'active' ? 'paused' : 'active';
        return { ...campaign, status: newStatus };
      }
      return campaign;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(totalBudget)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(totalSpent)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reach</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {(totalReach / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Conversions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {totalConversions.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-pink-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Engagement</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {averageEngagement.toFixed(1)}%
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
              placeholder="Search campaigns..."
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
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Types</option>
              <option value="social_media">Social Media</option>
              <option value="influencer">Influencer</option>
              <option value="traditional">Traditional</option>
              <option value="digital">Digital</option>
              <option value="pr">PR & Events</option>
            </select>
          </div>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </button>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-6">
        {filteredCampaigns.map((campaign) => {
          const budgetUtilization = (campaign.spent / campaign.budget) * 100;
          const roi = campaign.spent > 0 ? ((campaign.conversions * 50 - campaign.spent) / campaign.spent * 100) : 0; // Assuming $50 per conversion value
          
          return (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(campaign.type)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {campaign.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {campaign.type.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                  
                  {campaign.status === 'active' && (
                    <button
                      onClick={() => toggleCampaignStatus(campaign.id)}
                      className="p-2 text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                    >
                      <Pause className="h-4 w-4" />
                    </button>
                  )}
                  
                  {campaign.status === 'paused' && (
                    <button
                      onClick={() => toggleCampaignStatus(campaign.id)}
                      className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => setEditingCampaign(campaign)}
                    className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Campaign Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Budget</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(campaign.budget)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Spent</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(campaign.spent)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Reach</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {(campaign.reach / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Engagement</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {campaign.engagement.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">CTR</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {campaign.ctr.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Conversions</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {campaign.conversions.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Budget Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Budget Utilization</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {budgetUtilization.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      budgetUtilization >= 90 ? 'bg-red-500' :
                      budgetUtilization >= 75 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                  />
                </div>
              </div>

              {/* Campaign Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">Platforms</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {campaign.platforms.join(', ')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">Target Audience</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {campaign.targetAudience.ageRange}, {campaign.targetAudience.gender}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">Campaign Period</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {campaign.startDate} - {campaign.endDate}
                  </p>
                </div>
              </div>

              {/* KPI Progress */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Campaign KPIs</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Awareness</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{campaign.kpis.awareness}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full"
                        style={{ width: `${campaign.kpis.awareness}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Consideration</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{campaign.kpis.consideration}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: `${campaign.kpis.consideration}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Intent</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{campaign.kpis.intent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-purple-500 h-1.5 rounded-full"
                        style={{ width: `${campaign.kpis.intent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No campaigns found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search or filters, or create a new campaign.
          </p>
        </div>
      )}
    </div>
  );
};
