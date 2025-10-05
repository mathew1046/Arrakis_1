import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, TrendingUp, TrendingDown, BarChart3, PieChart, Calendar,
  Globe, Monitor, Users, Target, Download, Filter, Eye, Star
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface RevenueData {
  platform: string;
  revenue: number;
  previousRevenue: number;
  growth: number;
  views: number;
  rating: number;
  territory: string;
  revenueShare: number;
  monthlyData: {
    month: string;
    revenue: number;
    views: number;
  }[];
}

interface Forecast {
  month: string;
  projected: number;
  conservative: number;
  optimistic: number;
}

export const RevenueAnalytics: React.FC = () => {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [selectedTerritory, setSelectedTerritory] = useState('all');

  // Demo data initialization
  useEffect(() => {
    const demoRevenueData: RevenueData[] = [
      {
        platform: 'Netflix',
        revenue: 850000,
        previousRevenue: 720000,
        growth: 18.1,
        views: 450000,
        rating: 4.3,
        territory: 'Global',
        revenueShare: 70,
        monthlyData: [
          { month: 'Jan', revenue: 120000, views: 65000 },
          { month: 'Feb', revenue: 135000, views: 72000 },
          { month: 'Mar', revenue: 145000, views: 78000 },
          { month: 'Apr', revenue: 150000, views: 82000 },
          { month: 'May', revenue: 155000, views: 85000 },
          { month: 'Jun', revenue: 145000, views: 68000 }
        ]
      },
      {
        platform: 'Amazon Prime',
        revenue: 620000,
        previousRevenue: 580000,
        growth: 6.9,
        views: 320000,
        rating: 4.1,
        territory: 'US/UK',
        revenueShare: 65,
        monthlyData: [
          { month: 'Jan', revenue: 95000, views: 48000 },
          { month: 'Feb', revenue: 102000, views: 52000 },
          { month: 'Mar', revenue: 108000, views: 55000 },
          { month: 'Apr', revenue: 110000, views: 58000 },
          { month: 'May', revenue: 115000, views: 60000 },
          { month: 'Jun', revenue: 90000, views: 47000 }
        ]
      },
      {
        platform: 'HBO Max',
        revenue: 480000,
        previousRevenue: 420000,
        growth: 14.3,
        views: 280000,
        rating: 4.4,
        territory: 'US',
        revenueShare: 68,
        monthlyData: [
          { month: 'Jan', revenue: 75000, views: 42000 },
          { month: 'Feb', revenue: 78000, views: 45000 },
          { month: 'Mar', revenue: 82000, views: 48000 },
          { month: 'Apr', revenue: 85000, views: 50000 },
          { month: 'May', revenue: 88000, views: 52000 },
          { month: 'Jun', revenue: 72000, views: 43000 }
        ]
      },
      {
        platform: 'Hulu',
        revenue: 320000,
        previousRevenue: 350000,
        growth: -8.6,
        views: 150000,
        rating: 3.9,
        territory: 'US',
        revenueShare: 60,
        monthlyData: [
          { month: 'Jan', revenue: 58000, views: 28000 },
          { month: 'Feb', revenue: 55000, views: 26000 },
          { month: 'Mar', revenue: 52000, views: 24000 },
          { month: 'Apr', revenue: 50000, views: 23000 },
          { month: 'May', revenue: 53000, views: 25000 },
          { month: 'Jun', revenue: 52000, views: 24000 }
        ]
      },
      {
        platform: 'Peacock',
        revenue: 180000,
        previousRevenue: 160000,
        growth: 12.5,
        views: 50000,
        rating: 4.0,
        territory: 'US',
        revenueShare: 55,
        monthlyData: [
          { month: 'Jan', revenue: 28000, views: 8000 },
          { month: 'Feb', revenue: 30000, views: 8500 },
          { month: 'Mar', revenue: 32000, views: 9000 },
          { month: 'Apr', revenue: 30000, views: 8200 },
          { month: 'May', revenue: 32000, views: 8800 },
          { month: 'Jun', revenue: 28000, views: 7500 }
        ]
      }
    ];

    const demoForecasts: Forecast[] = [
      { month: 'Jul', projected: 2580000, conservative: 2320000, optimistic: 2840000 },
      { month: 'Aug', projected: 2720000, conservative: 2450000, optimistic: 2990000 },
      { month: 'Sep', projected: 2650000, conservative: 2380000, optimistic: 2920000 },
      { month: 'Oct', projected: 2800000, conservative: 2520000, optimistic: 3080000 },
      { month: 'Nov', projected: 2950000, conservative: 2655000, optimistic: 3245000 },
      { month: 'Dec', projected: 3100000, conservative: 2790000, optimistic: 3410000 }
    ];

    setRevenueData(demoRevenueData);
    setForecasts(demoForecasts);
  }, []);

  // Calculate totals and metrics
  const totalRevenue = revenueData.reduce((sum, data) => sum + data.revenue, 0);
  const totalPreviousRevenue = revenueData.reduce((sum, data) => sum + data.previousRevenue, 0);
  const overallGrowth = totalPreviousRevenue > 0 ? ((totalRevenue - totalPreviousRevenue) / totalPreviousRevenue) * 100 : 0;
  const totalViews = revenueData.reduce((sum, data) => sum + data.views, 0);
  const averageRating = revenueData.length > 0 
    ? revenueData.reduce((sum, data) => sum + data.rating, 0) / revenueData.length 
    : 0;

  // Revenue per view calculation
  const revenuePerView = totalViews > 0 ? totalRevenue / totalViews : 0;

  // Top performing platform
  const topPlatform = revenueData.reduce((top, current) => 
    current.revenue > top.revenue ? current : top, revenueData[0] || { platform: 'N/A', revenue: 0 }
  );

  // Territory breakdown
  const territoryRevenue = revenueData.reduce((acc, data) => {
    acc[data.territory] = (acc[data.territory] || 0) + data.revenue;
    return acc;
  }, {} as Record<string, number>);

  const territories = Object.keys(territoryRevenue);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Revenue Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive revenue tracking and forecasting</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
          </select>
          
          <select
            value={selectedTerritory}
            onChange={(e) => setSelectedTerritory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Territories</option>
            {territories.map(territory => (
              <option key={territory} value={territory}>{territory}</option>
            ))}
          </select>
          
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(totalRevenue)}
              </p>
              <div className="flex items-center mt-1">
                {overallGrowth >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  overallGrowth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {overallGrowth >= 0 ? '+' : ''}{overallGrowth.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-blue-500 mr-3" />
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
            <Target className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue/View</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ${revenuePerView.toFixed(2)}
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
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Monitor className="h-8 w-8 text-indigo-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Top Platform</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {topPlatform.platform}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatCurrency(topPlatform.revenue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown by Platform */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Platform Performance
          </h3>
          
          <div className="space-y-4">
            {revenueData
              .sort((a, b) => b.revenue - a.revenue)
              .map((platform, index) => (
                <div key={platform.platform} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-purple-500' :
                        index === 3 ? 'bg-yellow-500' : 'bg-gray-500'
                      }`} />
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {platform.platform}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(platform.revenue)}
                      </p>
                      <div className="flex items-center">
                        {platform.growth >= 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                        )}
                        <span className={`text-xs ${
                          platform.growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {platform.growth >= 0 ? '+' : ''}{platform.growth.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-purple-500' :
                        index === 3 ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}
                      style={{ width: `${(platform.revenue / totalRevenue) * 100}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{(platform.views / 1000).toFixed(0)}K views</span>
                    <span>⭐ {platform.rating.toFixed(1)}</span>
                    <span>{platform.revenueShare}% share</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Territory Breakdown
          </h3>
          
          <div className="space-y-4">
            {Object.entries(territoryRevenue)
              .sort(([,a], [,b]) => b - a)
              .map(([territory, revenue], index) => {
                const percentage = (revenue / totalRevenue) * 100;
                return (
                  <div key={territory} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {territory}
                      </span>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(revenue)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {percentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-green-500' :
                          index === 2 ? 'bg-purple-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Revenue Forecast */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Revenue Forecast (Next 6 Months)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Conservative</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {formatCurrency(forecasts.reduce((sum, f) => sum + f.conservative, 0))}
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400 mb-1">Projected</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">
              {formatCurrency(forecasts.reduce((sum, f) => sum + f.projected, 0))}
            </p>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Optimistic</p>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {formatCurrency(forecasts.reduce((sum, f) => sum + f.optimistic, 0))}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {forecasts.map((forecast) => (
            <div key={forecast.month} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="font-medium text-gray-900 dark:text-gray-100">{forecast.month}</span>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-blue-600 dark:text-blue-400">
                  {formatCurrency(forecast.conservative)}
                </span>
                <span className="text-green-600 dark:text-green-400 font-medium">
                  {formatCurrency(forecast.projected)}
                </span>
                <span className="text-purple-600 dark:text-purple-400">
                  {formatCurrency(forecast.optimistic)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Monthly Performance Trends
        </h3>
        
        <div className="text-center py-8">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Interactive charts and detailed trend analysis coming soon...
          </p>
        </div>
      </div>
    </div>
  );
};
