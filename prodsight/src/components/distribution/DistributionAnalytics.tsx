import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, BarChart3, PieChart, Globe, Users, 
  Calendar, Filter, Download, Eye, Star, Clock, Target,
  DollarSign, Monitor
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

// Define interfaces for analytics data
interface ViewerDemographic {
  ageGroup: string;
  percentage: number;
  count: number;
}

interface RegionPerformance {
  region: string;
  viewers: number;
  revenue: number;
  engagementRate: number;
  growth: number;
}

interface PlatformPerformance {
  name: string;
  viewership: number;
  percentageShare: number;
  avgWatchTime: number;
  completionRate: number;
}

interface EngagementMetric {
  name: string;
  value: number;
  previousValue: number;
  change: number;
}

interface TimeSeriesData {
  date: string;
  viewers: number;
  revenue: number;
}

// Component for analytics section
export const DistributionAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const [viewerDemographics, setViewerDemographics] = useState<ViewerDemographic[]>([]);
  const [regionPerformance, setRegionPerformance] = useState<RegionPerformance[]>([]);
  const [platformPerformance, setPlatformPerformance] = useState<PlatformPerformance[]>([]);
  const [engagementMetrics, setEngagementMetrics] = useState<EngagementMetric[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);

  // Load mock data
  useEffect(() => {
    // Mock viewer demographics
    const mockDemographics: ViewerDemographic[] = [
      { ageGroup: '18-24', percentage: 22, count: 275000 },
      { ageGroup: '25-34', percentage: 35, count: 437500 },
      { ageGroup: '35-44', percentage: 25, count: 312500 },
      { ageGroup: '45-54', percentage: 12, count: 150000 },
      { ageGroup: '55+', percentage: 6, count: 75000 }
    ];

    // Mock region performance
    const mockRegionPerformance: RegionPerformance[] = [
      { region: 'North America', viewers: 580000, revenue: 1230000, engagementRate: 4.8, growth: 12.5 },
      { region: 'Europe', viewers: 320000, revenue: 720000, engagementRate: 4.2, growth: 15.3 },
      { region: 'Asia Pacific', viewers: 210000, revenue: 370000, engagementRate: 3.9, growth: 22.7 },
      { region: 'Latin America', viewers: 90000, revenue: 85000, engagementRate: 4.5, growth: 18.2 },
      { region: 'Middle East & Africa', viewers: 50000, revenue: 45000, engagementRate: 3.7, growth: 28.4 }
    ];

    // Mock platform performance
    const mockPlatformPerformance: PlatformPerformance[] = [
      { name: 'Netflix', viewership: 450000, percentageShare: 36, avgWatchTime: 105, completionRate: 78 },
      { name: 'Amazon Prime', viewership: 320000, percentageShare: 25.6, avgWatchTime: 95, completionRate: 72 },
      { name: 'HBO Max', viewership: 280000, percentageShare: 22.4, avgWatchTime: 115, completionRate: 82 },
      { name: 'Hulu', viewership: 150000, percentageShare: 12, avgWatchTime: 90, completionRate: 68 },
      { name: 'Peacock', viewership: 50000, percentageShare: 4, avgWatchTime: 80, completionRate: 65 }
    ];

    // Mock engagement metrics
    const mockEngagementMetrics: EngagementMetric[] = [
      { name: 'Avg Watch Time (mins)', value: 98, previousValue: 85, change: 15.3 },
      { name: 'Completion Rate (%)', value: 75, previousValue: 68, change: 10.3 },
      { name: 'Rewatch Rate (%)', value: 22, previousValue: 18, change: 22.2 },
      { name: 'Social Shares', value: 45000, previousValue: 32000, change: 40.6 },
      { name: 'User Reviews', value: 12500, previousValue: 9800, change: 27.6 }
    ];

    // Mock time series data
    const generateTimeSeriesData = () => {
      const data: TimeSeriesData[] = [];
      let viewers = 38000;
      let revenue = 82000;
      
      // Generate daily data for 30 days
      for (let i = 30; i >= 1; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Add some randomness to the data
        const viewerFluctuation = Math.random() * 5000 - 2000;
        const revenueFluctuation = Math.random() * 12000 - 5000;
        
        // Add general upward trend
        viewers += viewerFluctuation + 350;
        revenue += revenueFluctuation + 800;
        
        data.push({
          date: date.toISOString().split('T')[0],
          viewers: Math.round(viewers),
          revenue: Math.round(revenue)
        });
      }
      
      return data;
    };

    // Set mock data to state
    setViewerDemographics(mockDemographics);
    setRegionPerformance(mockRegionPerformance);
    setPlatformPerformance(mockPlatformPerformance);
    setEngagementMetrics(mockEngagementMetrics);
    setTimeSeriesData(generateTimeSeriesData());
  }, []);

  // Helper to get trend color class
  const getTrendClass = (value: number) => {
    if (value > 0) return 'text-green-600 dark:text-green-400';
    if (value < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-500 dark:text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Time range selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Distribution Analytics
        </h2>
        <div className="flex space-x-2">
          <select 
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1 text-sm"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">Last Year</option>
          </select>
          <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1 text-sm flex items-center">
            <Download className="h-4 w-4 mr-1" />
            Export
          </button>
        </div>
      </div>

      {/* Main analytics grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Viewer Growth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Viewer Growth Trend
          </h3>
          <div className="h-64 flex items-center justify-center">
            {/* This would be a chart in a real implementation */}
            <div className="w-full h-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="font-semibold text-gray-700 dark:text-gray-300">
                  Viewership Trend (30 days)
                </div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  +17.8%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {timeSeriesData.length > 0 && (
                    <>From {timeSeriesData[0]?.viewers.toLocaleString()} to {timeSeriesData[timeSeriesData.length - 1]?.viewers.toLocaleString()} viewers</>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Revenue Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Revenue Analysis
          </h3>
          <div className="h-64 flex items-center justify-center">
            {/* This would be a chart in a real implementation */}
            <div className="w-full h-full bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="font-semibold text-gray-700 dark:text-gray-300">
                  Revenue Trend (30 days)
                </div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  +21.5%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {timeSeriesData.length > 0 && (
                    <>From {formatCurrency(timeSeriesData[0]?.revenue)} to {formatCurrency(timeSeriesData[timeSeriesData.length - 1]?.revenue)}</>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Viewer Demographics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Viewer Demographics
          </h3>
          <div className="space-y-4">
            {viewerDemographics.map(demographic => (
              <div key={demographic.ageGroup} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {demographic.ageGroup}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {demographic.percentage}% ({demographic.count.toLocaleString()} viewers)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${demographic.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Regional Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Regional Performance
          </h3>
          <div className="space-y-4">
            {regionPerformance.map(region => (
              <div key={region.region} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">{region.region}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {region.viewers.toLocaleString()} viewers
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {formatCurrency(region.revenue)}
                  </p>
                  <p className={`text-sm flex items-center ${getTrendClass(region.growth)}`}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {region.growth}% growth
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Platform Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 lg:col-span-2"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Monitor className="h-5 w-5 mr-2" />
            Platform Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Platform</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Viewership</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Share</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Avg Watch Time</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {platformPerformance.map(platform => (
                  <tr key={platform.name}>
                    <td className="py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{platform.name}</td>
                    <td className="py-4 text-sm text-gray-500 dark:text-gray-400">{platform.viewership.toLocaleString()}</td>
                    <td className="py-4 text-sm text-gray-500 dark:text-gray-400">{platform.percentageShare}%</td>
                    <td className="py-4 text-sm text-gray-500 dark:text-gray-400">{platform.avgWatchTime} mins</td>
                    <td className="py-4 text-sm text-gray-500 dark:text-gray-400">{platform.completionRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Engagement Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 lg:col-span-2"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Engagement Metrics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {engagementMetrics.map(metric => (
              <div 
                key={metric.name}
                className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">{metric.name}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {metric.value.toLocaleString()}
                </p>
                <p className={`text-xs mt-1 flex items-center justify-center ${getTrendClass(metric.change)}`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {metric.change}% vs previous
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};