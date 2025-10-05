import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, TrendingUp, DollarSign, Users, Calendar, BarChart3,
  Target, PlayCircle, Share2, Monitor, Smartphone, Tv,
  Film, Award, Star, Eye, Download, MessageCircle
} from 'lucide-react';
import { KPICard } from '../../components/dashboard/KPICard';
import { formatCurrency } from '../../utils/formatters';
import { Task, Budget, Script, User } from '../../api/endpoints';
import { PlatformManagement } from '../../components/distribution/PlatformManagement';
import { MarketingCampaigns } from '../../components/distribution/MarketingCampaigns';
import { RevenueAnalytics } from '../../components/distribution/RevenueAnalytics';

interface DistributionManagerDashboardProps {
  user: User;
  tasks: Task[];
  budget: Budget | null;
  script: Script | null;
}

export const DistributionManagerDashboard: React.FC<DistributionManagerDashboardProps> = ({
  user,
  tasks,
  budget,
  script,
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Demo data for distribution metrics
  const distributionMetrics = {
    totalRevenue: 2450000,
    platformsActive: 8,
    totalViews: 1250000,
    averageRating: 4.2,
    marketingSpend: 180000,
    conversionRate: 3.2,
    releaseDate: '2024-03-15',
    territories: 25
  };

  const platforms = [
    { name: 'Netflix', status: 'Live', revenue: 850000, views: 450000, rating: 4.3 },
    { name: 'Amazon Prime', status: 'Live', revenue: 620000, views: 320000, rating: 4.1 },
    { name: 'Disney+', status: 'Pending', revenue: 0, views: 0, rating: 0 },
    { name: 'HBO Max', status: 'Live', revenue: 480000, views: 280000, rating: 4.4 },
    { name: 'Apple TV+', status: 'In Review', revenue: 0, views: 0, rating: 0 },
    { name: 'Hulu', status: 'Live', revenue: 320000, views: 150000, rating: 3.9 },
    { name: 'Paramount+', status: 'Negotiating', revenue: 0, views: 0, rating: 0 },
    { name: 'Peacock', status: 'Live', revenue: 180000, views: 50000, rating: 4.0 }
  ];

  const marketingCampaigns = [
    { name: 'Social Media Blitz', budget: 50000, spent: 42000, reach: 2500000, engagement: 4.2 },
    { name: 'Influencer Partnerships', budget: 75000, spent: 68000, reach: 1800000, engagement: 6.1 },
    { name: 'Traditional Media', budget: 40000, spent: 35000, reach: 800000, engagement: 2.8 },
    { name: 'Digital Advertising', budget: 60000, spent: 55000, reach: 3200000, engagement: 3.5 }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'platforms', label: 'Platforms', icon: Monitor },
    { id: 'marketing', label: 'Marketing', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'releases', label: 'Releases', icon: Calendar },
    { id: 'revenue', label: 'Revenue', icon: DollarSign }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'In Review': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Negotiating': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Distribution Manager Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back, {user.name}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Release Date: {distributionMetrics.releaseDate}
          </div>
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
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="Total Revenue"
                value={formatCurrency(distributionMetrics.totalRevenue)}
                subtitle="Across all platforms"
                icon={DollarSign}
                color="green"
                trend={{ value: 15.2, isPositive: true }}
              />
              
              <KPICard
                title="Active Platforms"
                value={distributionMetrics.platformsActive}
                subtitle={`${platforms.filter(p => p.status === 'Live').length} live`}
                icon={Monitor}
                color="blue"
              />
              
              <KPICard
                title="Total Views"
                value={`${(distributionMetrics.totalViews / 1000000).toFixed(1)}M`}
                subtitle="Across all platforms"
                icon={Eye}
                color="purple"
                trend={{ value: 8.7, isPositive: true }}
              />
              
              <KPICard
                title="Average Rating"
                value={distributionMetrics.averageRating.toFixed(1)}
                subtitle="⭐ User rating"
                icon={Star}
                color="yellow"
              />
            </div>

            {/* Platform Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <Monitor className="h-5 w-5 mr-2" />
                  Top Performing Platforms
                </h3>
                <div className="space-y-4">
                  {platforms
                    .filter(p => p.status === 'Live')
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 4)
                    .map((platform, index) => (
                      <div key={platform.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                            index === 0 ? 'bg-yellow-500' :
                            index === 1 ? 'bg-gray-400' :
                            index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{platform.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {(platform.views / 1000).toFixed(0)}K views
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {formatCurrency(platform.revenue)}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ⭐ {platform.rating.toFixed(1)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Marketing Campaign Performance
                </h3>
                <div className="space-y-4">
                  {marketingCampaigns.map((campaign) => {
                    const utilization = (campaign.spent / campaign.budget) * 100;
                    return (
                      <div key={campaign.name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {campaign.name}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              utilization >= 90 ? 'bg-red-500' :
                              utilization >= 75 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${utilization}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>{(campaign.reach / 1000000).toFixed(1)}M reach</span>
                          <span>{campaign.engagement.toFixed(1)}% engagement</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <button className="flex items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                  <PlayCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-blue-600 dark:text-blue-400 font-medium">Launch Campaign</span>
                </button>
                
                <button className="flex items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors">
                  <Globe className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                  <span className="text-green-600 dark:text-green-400 font-medium">Add Platform</span>
                </button>
                
                <button className="flex items-center justify-center p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors">
                  <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                  <span className="text-purple-600 dark:text-purple-400 font-medium">View Analytics</span>
                </button>
                
                <button className="flex items-center justify-center p-4 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-colors">
                  <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-2" />
                  <span className="text-orange-600 dark:text-orange-400 font-medium">Schedule Release</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'platforms' && (
          <motion.div
            key="platforms"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <PlatformManagement />
          </motion.div>
        )}

        {activeTab === 'marketing' && (
          <motion.div
            key="marketing"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <MarketingCampaigns />
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Distribution Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Advanced analytics dashboard coming soon...
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === 'releases' && (
          <motion.div
            key="releases"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Release Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Release scheduling and management features coming soon...
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === 'revenue' && (
          <motion.div
            key="revenue"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <RevenueAnalytics />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
