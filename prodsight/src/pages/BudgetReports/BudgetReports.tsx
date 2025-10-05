import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileSpreadsheet,
  Download,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Calendar,
  PieChart,
  BarChart3,
  DollarSign,
  Target,
  Package,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface BudgetReport {
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  variance: number;
  variancePercentage: number;
  status: 'under' | 'over' | 'on_track';
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  purchasePrice: number;
  purchaseDate: Date;
  condition: string;
  currentValue: number;
}

export const BudgetReports: React.FC = () => {
  const [reportPeriod, setReportPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'final'>('monthly');
  const [budgetReports, setBudgetReports] = useState<BudgetReport[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    // Initialize demo budget reports
    const demoReports: BudgetReport[] = [
      {
        category: 'Actor Remuneration',
        allocated: 500000,
        spent: 450000,
        remaining: 50000,
        variance: -50000,
        variancePercentage: -10,
        status: 'under'
      },
      {
        category: 'Crew Wages',
        allocated: 300000,
        spent: 320000,
        remaining: -20000,
        variance: 20000,
        variancePercentage: 6.7,
        status: 'over'
      },
      {
        category: 'Location & Travel',
        allocated: 200000,
        spent: 195000,
        remaining: 5000,
        variance: -5000,
        variancePercentage: -2.5,
        status: 'on_track'
      },
      {
        category: 'Production Expenses',
        allocated: 150000,
        spent: 165000,
        remaining: -15000,
        variance: 15000,
        variancePercentage: 10,
        status: 'over'
      },
      {
        category: 'Post-Production',
        allocated: 250000,
        spent: 75000,
        remaining: 175000,
        variance: -175000,
        variancePercentage: -70,
        status: 'under'
      },
      {
        category: 'Equipment Rental',
        allocated: 100000,
        spent: 98000,
        remaining: 2000,
        variance: -2000,
        variancePercentage: -2,
        status: 'on_track'
      }
    ];

    const demoInventory: InventoryItem[] = [
      {
        id: '1',
        name: 'Vintage Camera Set',
        category: 'Camera Equipment',
        purchasePrice: 45000,
        purchaseDate: new Date(2024, 8, 15),
        condition: 'Excellent',
        currentValue: 42000
      },
      {
        id: '2',
        name: 'Royal Throne Chair',
        category: 'Furniture',
        purchasePrice: 25000,
        purchaseDate: new Date(2024, 8, 20),
        condition: 'Good',
        currentValue: 22000
      },
      {
        id: '3',
        name: 'Period Costume Set',
        category: 'Costumes',
        purchasePrice: 12000,
        purchaseDate: new Date(2024, 8, 25),
        condition: 'Excellent',
        currentValue: 11500
      },
      {
        id: '4',
        name: 'Professional Lighting Kit',
        category: 'Lighting',
        purchasePrice: 35000,
        purchaseDate: new Date(2024, 9, 5),
        condition: 'Good',
        currentValue: 32000
      },
      {
        id: '5',
        name: 'Sound Recording Equipment',
        category: 'Audio',
        purchasePrice: 28000,
        purchaseDate: new Date(2024, 9, 10),
        condition: 'Excellent',
        currentValue: 27000
      }
    ];

    setBudgetReports(demoReports);
    setInventoryItems(demoInventory);
  }, []);

  const getTotalAllocated = () => budgetReports.reduce((sum, report) => sum + report.allocated, 0);
  const getTotalSpent = () => budgetReports.reduce((sum, report) => sum + report.spent, 0);
  const getTotalVariance = () => budgetReports.reduce((sum, report) => sum + report.variance, 0);
  const getTotalInventoryValue = () => inventoryItems.reduce((sum, item) => sum + item.currentValue, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'under':
        return 'text-green-600 dark:text-green-400';
      case 'over':
        return 'text-red-600 dark:text-red-400';
      case 'on_track':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'under':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      case 'over':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'on_track':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-red-600 dark:text-red-400';
    if (variance < 0) return 'text-green-600 dark:text-green-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Budget Reports & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive budget analysis and variance reports
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {(['daily', 'weekly', 'monthly', 'final'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setReportPeriod(period)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  reportPeriod === period
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ₹{getTotalAllocated().toLocaleString()}
              </p>
            </div>
            <Target className="h-8 w-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ₹{getTotalSpent().toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {((getTotalSpent() / getTotalAllocated()) * 100).toFixed(1)}% of budget
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Variance</p>
              <p className={`text-2xl font-bold ${getVarianceColor(getTotalVariance())}`}>
                {getTotalVariance() > 0 ? '+' : ''}₹{Math.abs(getTotalVariance()).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {getTotalVariance() > 0 ? 'Over budget' : 'Under budget'}
              </p>
            </div>
            {getTotalVariance() > 0 ? 
              <TrendingUp className="h-8 w-8 text-red-500" /> : 
              <TrendingDown className="h-8 w-8 text-green-500" />
            }
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Inventory Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ₹{getTotalInventoryValue().toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {inventoryItems.length} items
              </p>
            </div>
            <Package className="h-8 w-8 text-purple-500" />
          </div>
        </motion.div>
      </div>

      {/* Budget Variance Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Budget Variance Analysis
            </h2>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {reportPeriod.charAt(0).toUpperCase() + reportPeriod.slice(1)} Report
              </span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Category</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Allocated</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Spent</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Remaining</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Variance</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {budgetReports.map((report, index) => (
                  <motion.tr
                    key={report.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {report.category}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right text-gray-600 dark:text-gray-400">
                      ₹{report.allocated.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right text-gray-900 dark:text-gray-100 font-medium">
                      ₹{report.spent.toLocaleString()}
                    </td>
                    <td className={`py-4 px-4 text-right font-medium ${
                      report.remaining < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                    }`}>
                      ₹{Math.abs(report.remaining).toLocaleString()}
                      {report.remaining < 0 && ' (deficit)'}
                    </td>
                    <td className={`py-4 px-4 text-right font-medium ${getVarianceColor(report.variance)}`}>
                      {report.variance > 0 ? '+' : ''}₹{Math.abs(report.variance).toLocaleString()}
                      <div className="text-xs">
                        ({report.variancePercentage > 0 ? '+' : ''}{report.variancePercentage.toFixed(1)}%)
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        {getStatusIcon(report.status)}
                        <span className={`text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Inventory Assets */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Purchased Assets Inventory
            </h2>
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Total Value: ₹{getTotalInventoryValue().toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventoryItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.category}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.condition === 'Excellent' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                  }`}>
                    {item.condition}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Purchase Price:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      ₹{item.purchasePrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Current Value:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      ₹{item.currentValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Purchase Date:</span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {item.purchaseDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Depreciation:</span>
                    <span className={`font-medium ${
                      item.currentValue < item.purchasePrice 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                      {item.currentValue < item.purchasePrice ? '-' : '+'}₹{Math.abs(item.currentValue - item.purchasePrice).toLocaleString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Budget Performance Insights
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Post-Production Under Budget
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  70% under allocated budget - opportunity for quality enhancement
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Production Expenses Over Budget
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  10% overspend - monitor daily expenses closely
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <TrendingUp className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Crew Wages Exceeded
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  6.7% over budget due to overtime requirements
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Recommendations
          </h3>
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                Reallocate Post-Production Budget
              </p>
              <p className="text-xs text-blue-800 dark:text-blue-200">
                Consider moving unused post-production funds to cover production overruns
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                Inventory Asset Utilization
              </p>
              <p className="text-xs text-green-800 dark:text-green-200">
                Current inventory worth ₹{getTotalInventoryValue().toLocaleString()} can be leveraged for future projects
              </p>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                Daily Expense Monitoring
              </p>
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                Implement stricter daily expense approval process to prevent further overruns
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
