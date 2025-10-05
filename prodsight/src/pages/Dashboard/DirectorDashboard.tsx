import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Video,
  CheckCircle,
  Clock,
  Users,
  Zap,
  Edit,
  Save,
  MessageCircle,
  Bot,
  Eye,
  Trash2,
  Plus,
  Search,
  Filter,
  Upload,
  Download,
  Play,
  Pause,
  BarChart3
} from 'lucide-react';
import { KPICard } from '../../components/dashboard/KPICard';
import { Task, Budget, Script, User, Scene } from '../../api/endpoints';

interface DirectorDashboardProps {
  user: User;
  tasks: Task[];
  budget: Budget | null;
  script: Script | null;
}

// Use the Scene interface from API endpoints

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export const DirectorDashboard: React.FC<DirectorDashboardProps> = ({
  user,
  tasks,
  script,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [scriptContent, setScriptContent] = useState('');
  const [isEditingScript, setIsEditingScript] = useState(false);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [editingScene, setEditingScene] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);

  const approvedScenes = script?.scenes.filter(scene => scene.scene_status === 'Approved').length || 0;
  const totalScenes = script?.totalScenes || 0;
  const vfxScenes = script?.vfxScenes || 0;
  const totalDuration = script?.totalEstimatedDuration || 0;

  const directorTasks = tasks.filter(task => task.category === 'Script' || task.assignee.includes('Director'));

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'scene-breakdown', label: 'Scene Breakdown', icon: FileText },
  ];

  // Load scenes and script content from backend
  React.useEffect(() => {
    if (script?.scenes) {
      setScenes(script.scenes);
    }
  }, [script]);

  // Load script text from backend
  React.useEffect(() => {
    const loadScriptText = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/script/text');
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setScriptContent(result.data.content || '# SAMPLE SCRIPT\n\nFADE IN:\n\nEXT. MUMBAI STREET - DAY\n\nA bustling street scene with vendors and pedestrians.\n\nINT. COFFEE SHOP - DAY\n\nRAHUL sits across from PRIYA, discussing their project.\n\nRAHUL\nThis AI system will revolutionize film production.\n\nPRIYA\n(excited)\nImagine the possibilities!\n\nFADE OUT.');
          }
        }
      } catch (error) {
        console.error('Failed to load script text:', error);
        setScriptContent('# SAMPLE SCRIPT\n\nFADE IN:\n\nEXT. MUMBAI STREET - DAY\n\nA bustling street scene with vendors and pedestrians.\n\nINT. COFFEE SHOP - DAY\n\nRAHUL sits across from PRIYA, discussing their project.\n\nRAHUL\nThis AI system will revolutionize film production.\n\nPRIYA\n(excited)\nImagine the possibilities!\n\nFADE OUT.');
      }
    };
    loadScriptText();
  }, []);

  const handleScriptBreakdown = () => {
    // Simulate AI processing
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: `I've analyzed your script and identified ${scenes.length} scenes. The breakdown includes location requirements, character appearances, and VFX needs. Would you like me to elaborate on any specific scene?`,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Based on your question about "${chatInput}", I can help you with scene analysis, character requirements, location needs, or VFX planning. What specific aspect would you like me to focus on?`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setChatInput('');
  };

  const saveScript = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/script/text', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: scriptContent }),
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setIsEditingScript(false);
          console.log('Script saved successfully');
        }
      }
    } catch (error) {
      console.error('Failed to save script:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateScene = async (sceneId: string, updates: Partial<Scene>) => {
    try {
      setLoading(true);
      // Update scene in backend
      const response = await fetch(`http://localhost:5000/api/script/scene/${sceneId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setScenes(prev => prev.map(scene => 
            scene.id === sceneId ? { ...scene, ...updates } : scene
          ));
          setEditingScene(null);
        }
      }
    } catch (error) {
      console.error('Failed to update scene:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredScenes = scenes.filter(scene => {
    const matchesSearch = (scene.title ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (scene.scene_description ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || scene.scene_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Director Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Welcome back, {user.name}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-1 sm:space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-3 sm:px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">
                  {tab.id === 'overview' ? 'Overview' : 'Breakdown'}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Script Progress"
          value={`${approvedScenes}/${totalScenes}`}
          subtitle="Scenes approved"
          icon={FileText}
          color="blue"
          trend={{ value: 15, isPositive: true }}
        />
        
        <KPICard
          title="Total Runtime"
          value={`${totalDuration}min`}
          subtitle="Estimated duration"
          icon={Clock}
          color="green"
        />
        
        <KPICard
          title="VFX Scenes"
          value={vfxScenes}
          subtitle={`${Math.round((vfxScenes / Math.max(totalScenes, 1)) * 100)}% of total`}
          icon={Zap}
          color="purple"
        />
        
        <KPICard
          title="Director Tasks"
          value={directorTasks.length}
          subtitle={`${directorTasks.filter(t => t.status === 'done').length} completed`}
          icon={CheckCircle}
          color="yellow"
        />
      </div>

      {/* Script Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Scene Status Breakdown
          </h3>
          {script && (
            <div className="space-y-4">
              {['Approved', 'In Review', 'Not Shot'].map((status, index) => {
                const count = script.scenes.filter(scene => scene.scene_status === status).length;
                const percentage = totalScenes > 0 ? (count / totalScenes) * 100 : 0;
                
                return (
                  <div key={status} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {status}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {count} scenes ({Math.round(percentage)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                        className={`h-2 rounded-full ${
                          status === 'Approved'
                            ? 'bg-green-500'
                            : status === 'In Review'
                            ? 'bg-yellow-500'
                            : 'bg-gray-400'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Recent Scenes */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Recent Scenes
          </h3>
          <div className="space-y-3">
            {script?.scenes.slice(0, 5).map((scene) => (
              <div key={scene.id} className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Scene {scene.scene_number}
                    </span>
                    {scene.vfx_required && (
                      <Zap className="h-3 w-3 text-purple-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    {scene.scene_description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {scene.location} • {scene.estimated_runtime_minutes}min
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    scene.scene_status === 'Approved'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : scene.scene_status === 'In Review'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      : scene.scene_status === 'Completed'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {scene.scene_status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Characters and Locations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Production Elements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Characters ({script?.characters.length || 0})
            </h4>
            <div className="flex flex-wrap gap-2">
              {script?.characters.slice(0, 8).map((character) => (
                <span
                  key={character}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full"
                >
                  {character}
                </span>
              ))}
              {(script?.characters.length || 0) > 8 && (
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-full">
                  +{(script?.characters.length || 0) - 8} more
                </span>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <Video className="h-4 w-4 mr-2" />
              Locations ({script?.locations.length || 0})
            </h4>
            <div className="flex flex-wrap gap-2">
              {script?.locations.slice(0, 6).map((location) => (
                <span
                  key={location}
                  className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full"
                >
                  {location}
                </span>
              ))}
              {(script?.locations.length || 0) > 6 && (
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-full">
                  +{(script?.locations.length || 0) - 6} more
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
        </div>
      )}


      {/* Scene Breakdown Tab */}
      {activeTab === 'scene-breakdown' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 gap-4">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search scenes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="Not Shot">Not Shot</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="In Review">In Review</option>
                  <option value="Approved">Approved</option>
                </select>
              </div>
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                AI Assistant
              </button>
            </div>
          </div>

          {/* Scenes Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Scene</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Title</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Location</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Duration</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredScenes.map((scene) => (
                    <tr key={scene.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {scene.scene_number}
                          </span>
                          {scene.vfx_required && <Zap className="h-4 w-4 text-purple-500" />}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {editingScene === scene.id ? (
                          <input
                            type="text"
                            value={scene.title}
                            onChange={(e) => updateScene(scene.id, { title: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        ) : (
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{scene.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{scene.scene_description}</p>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {editingScene === scene.id ? (
                          <input
                            type="text"
                            value={scene.location}
                            onChange={(e) => updateScene(scene.id, { location: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        ) : (
                          <span>{scene.location}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {editingScene === scene.id ? (
                          <input
                            type="number"
                            value={scene.estimated_runtime_minutes}
                            onChange={(e) => updateScene(scene.id, { estimated_runtime_minutes: parseInt(e.target.value) })}
                            className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        ) : (
                          <span>{scene.estimated_runtime_minutes}min</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editingScene === scene.id ? (
                          <select
                            value={scene.scene_status}
                            onChange={(e) => updateScene(scene.id, { scene_status: e.target.value as Scene['scene_status'] })}
                            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="Not Shot">Not Shot</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="In Review">In Review</option>
                            <option value="Approved">Approved</option>
                          </select>
                        ) : (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            scene.scene_status === 'Approved'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : scene.scene_status === 'In Review'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                              : scene.scene_status === 'Completed'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {scene.scene_status}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end space-x-1">
                          {editingScene === scene.id ? (
                            <>
                              <button
                                onClick={() => setEditingScene(null)}
                                className="p-1 text-green-600 hover:text-green-800 transition-colors"
                              >
                                <Save className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setEditingScene(null)}
                                className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                              >
                                <Pause className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setEditingScene(scene.id)}
                                className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-gray-600 hover:text-gray-800 transition-colors">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-red-600 hover:text-red-800 transition-colors">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* AI Chatbot */}
      {isChatOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-4 right-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium text-gray-900 dark:text-gray-100">AI Script Assistant</h3>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <Pause className="h-4 w-4" />
            </button>
          </div>
          
          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
                Ask me about your script breakdown, scenes, or production planning!
              </div>
            ) : (
              chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))
            )}
          </div>
          
          <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about your scenes..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Play className="h-4 w-4" />
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};
