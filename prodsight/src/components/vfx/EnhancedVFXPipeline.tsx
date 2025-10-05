import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Palette, Eye, Users, BarChart3, Zap, Brain, Target, Clock
} from 'lucide-react';
import { VFXSceneAnalysis } from './VFXSceneAnalysis';
import { VFXArtistAssignment } from './VFXArtistAssignment';

export const EnhancedVFXPipeline: React.FC = () => {
  const [activeTab, setActiveTab] = useState('analysis');

  const tabs = [
    { id: 'analysis', label: 'Scene Analysis', icon: Eye },
    { id: 'artists', label: 'Artist Assignment', icon: Users },
    { id: 'pipeline', label: 'Pipeline Status', icon: BarChart3 },
    { id: 'ai-insights', label: 'AI Insights', icon: Brain }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <Palette className="h-6 w-6 mr-2" />
            Enhanced VFX Pipeline
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered VFX management with intelligent scene analysis and artist assignment
          </p>
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
      <div>
        {activeTab === 'analysis' && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <VFXSceneAnalysis />
          </motion.div>
        )}

        {activeTab === 'artists' && (
          <motion.div
            key="artists"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <VFXArtistAssignment />
          </motion.div>
        )}

        {activeTab === 'pipeline' && (
          <motion.div
            key="pipeline"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                VFX Pipeline Status
              </h3>
              
              {/* Pipeline Stages */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Eye className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Pre-Production</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Scene Analysis & Planning</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }} />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">85% Complete</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Palette className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Production</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Asset Creation & Animation</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '60%' }} />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">60% Complete</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Post-Production</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Compositing & Finishing</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '30%' }} />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">30% Complete</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Delivery</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Final Review & Export</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '10%' }} />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">10% Complete</p>
                  </div>
                </div>
              </div>

              {/* Current Bottlenecks */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Current Bottlenecks</h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• Scene 3B helicopter animation needs additional resources</li>
                  <li>• Explosion simulation for Scene 2C requires render farm optimization</li>
                  <li>• Magical forest creatures need final approval from director</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'ai-insights' && (
          <motion.div
            key="ai-insights"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                AI-Powered VFX Insights
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Resource Optimization */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-3 flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    Resource Optimization
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-blue-700 dark:text-blue-300 font-medium">Workload Balancing</p>
                        <p className="text-blue-600 dark:text-blue-400">Mike Rodriguez is at 90% capacity. Consider redistributing helicopter animation tasks.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-blue-700 dark:text-blue-300 font-medium">Skill Matching</p>
                        <p className="text-blue-600 dark:text-blue-400">Emma Watson's particle effects expertise is perfect for the magical forest scene.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-blue-700 dark:text-blue-300 font-medium">Cost Efficiency</p>
                        <p className="text-blue-600 dark:text-blue-400">Assigning junior artists to simpler tasks could save ₹15,000 in labor costs.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quality Predictions */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-3 flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    Quality Predictions
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-green-700 dark:text-green-300 font-medium">High Success Rate</p>
                        <p className="text-green-600 dark:text-green-400">Scene 1A window replacement has 95% predicted success rate based on similar projects.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-yellow-700 dark:text-yellow-300 font-medium">Complexity Warning</p>
                        <p className="text-yellow-600 dark:text-yellow-400">Explosion simulation may require 20% more time than estimated due to complexity.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-green-700 dark:text-green-300 font-medium">Artist Performance</p>
                        <p className="text-green-600 dark:text-green-400">Sarah Chen consistently delivers 15% faster than estimates with high quality.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Optimization */}
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-3 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Timeline Optimization
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-purple-700 dark:text-purple-300 font-medium">Critical Path</p>
                        <p className="text-purple-600 dark:text-purple-400">Helicopter CG is on the critical path. Delay here affects final delivery by 3 days.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-purple-700 dark:text-purple-300 font-medium">Parallel Processing</p>
                        <p className="text-purple-600 dark:text-purple-400">Particle effects and creature animation can run in parallel to save 5 days.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-purple-700 dark:text-purple-300 font-medium">Buffer Time</p>
                        <p className="text-purple-600 dark:text-purple-400">Add 2-day buffer for explosion simulation due to technical complexity.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Budget Impact */}
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                  <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-3 flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Budget Impact Analysis
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-orange-700 dark:text-orange-300 font-medium">Cost Overrun Risk</p>
                        <p className="text-orange-600 dark:text-orange-400">Current trajectory suggests 12% budget overrun without optimization.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-green-700 dark:text-green-300 font-medium">Savings Opportunity</p>
                        <p className="text-green-600 dark:text-green-400">Using in-house talent for simpler tasks could save ₹25,000.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-orange-700 dark:text-orange-300 font-medium">Resource Allocation</p>
                        <p className="text-orange-600 dark:text-orange-400">Render farm costs are 30% higher than budgeted for explosion scenes.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
