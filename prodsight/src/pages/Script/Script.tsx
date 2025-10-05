import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Upload,
  Zap,
  Eye,
  Edit,
  Save,
  Bot,
  Play,
  Pause,
  Search,
  Trash2,
  MessageCircle,
  Clock,
  Users,
  MapPin,
  CheckCircle,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { RoleGuard } from '../../components/auth/RoleGuard';
import { useScript } from '../../hooks/useScript';
import { useAI } from '../../hooks/useAI';
import { getStatusColor } from '../../utils/formatters';
import { scriptApi, analysisApi } from '../../api/endpoints';
import { useNotification } from '../../providers/NotificationProvider';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export const Script: React.FC = () => {
  const { script, loading, updateScene, updateScript } = useScript();
  const { breakdownScript, loading: aiLoading } = useAI();
  const { showSuccess, showError } = useNotification();
  const [activeTab, setActiveTab] = useState('overview');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [scriptText, setScriptText] = useState('');
  const [breakdown, setBreakdown] = useState<any>(null);
  const [isEditingScript, setIsEditingScript] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [editingScene, setEditingScene] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchScriptText = async () => {
      try {
        const response = await scriptApi.getScriptText();
        if (response.success) {
          setScriptText(response.data.content);
        } else {
          showError('Failed to load script text.');
        }
      } catch (error) {
        showError('An error occurred while fetching script text.');
      }
    };
    fetchScriptText();
  }, []);

  const handlePdfUpload = async (file: File) => {
    if (file) {
      try {
        showSuccess('Uploading and analyzing script...');
        const response = await analysisApi.analyzeScript(file);
        if (response.success) {
          await updateScript(response.data);
          showSuccess('Script analysis complete and saved.');
          setShowUploadModal(false);
          setSelectedFile(null);
        } else {
          showError(response.message || 'Failed to analyze script.');
        }
      } catch (error) {
        showError('An error occurred during script analysis.');
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setUploadedFileName(file.name);
    }
    else {
        showError('Please upload a PDF file.');
    }
  };

  const saveScript = async () => {
    setIsEditingScript(false);
    
    try {
      await scriptApi.updateScriptText(scriptText);
      showSuccess('Script text saved successfully.');

      const breakdownResult = await breakdownScript(scriptText);

      if (breakdownResult) {
        await updateScript(breakdownResult);
        showSuccess('Script breakdown complete and saved.');
      }
    } catch (error) {
      showError('Failed to save script.');
    }
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

    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Based on your question about "${chatInput}", I can help you with script analysis, scene breakdown, character development, or production planning. What specific aspect would you like me to focus on?`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setChatInput('');
  };

  const handleScriptBreakdown = () => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: `I've analyzed your script and identified key scenes, characters, and locations. The breakdown includes production requirements and VFX needs. Would you like me to elaborate on any specific aspect?`,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const handleSceneStatusUpdate = async (sceneId: string, status: string) => {
    await updateScene(sceneId, { status });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'editor', label: 'Script Editor', icon: Edit },
    { id: 'breakdown', label: 'Scene Breakdown', icon: Zap },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <RoleGuard permissions={['manage_script', 'ai_breakdown']}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4 sm:space-y-6"
      >
        {/* ... (Header) */}

        {/* ... (Tabs) */}

        {/* ... (Tab Content) */}

        {/* Upload Script Modal */}
        <Modal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          title="Upload Script"
          size="lg"
        >
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {uploadedFileName || 'Or drag and drop a script file'}
              </p>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="modal-script-upload"
              />
              <label htmlFor="modal-script-upload" className="cursor-pointer">
                <Button as="span" variant="secondary" size="sm">
                  Choose File
                </Button>
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                  setUploadedFileName(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => selectedFile && handlePdfUpload(selectedFile)}
                loading={aiLoading}
                disabled={!selectedFile}
              >
                <Zap className="h-4 w-4 mr-2" />
                Analyze with AI
              </Button>
            </div>
          </div>
        </Modal>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              Script Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Upload, edit and analyze scripts with AI-powered breakdown
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowUploadModal(true)}
              className="text-sm"
            >
              <Upload className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Upload Script</span>
              <span className="sm:hidden">Upload</span>
            </Button>
            <Button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="text-sm"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">AI Assistant</span>
              <span className="sm:hidden">AI</span>
            </Button>
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
                    {tab.id === 'overview' ? 'Overview' : 
                     tab.id === 'editor' ? 'Editor' : 'Breakdown'}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">

        {/* Script Overview */}
        {script && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card p-6 text-center">
              <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {script.totalScenes}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Scenes</p>
            </div>
            
            <div className="card p-6 text-center">
              <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {script.totalEstimatedDuration}m
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Runtime</p>
            </div>
            
            <div className="card p-6 text-center">
              <Zap className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {script.vfxScenes}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">VFX Scenes</p>
            </div>
            
            <div className="card p-6 text-center">
              <MapPin className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {script.locations?.length || 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Locations</p>
            </div>
          </div>
        )}

        {/* Scenes Table */}
        {script && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Scene Breakdown
              </h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Scene</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Description</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Location</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Duration</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">VFX</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {script.scenes?.map((scene, index) => (
                    <tr key={scene.id || `scene-${index}`} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                        {scene.number}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400 max-w-xs">
                        <div className="truncate" title={scene.description}>
                          {scene.description}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {scene.location}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {scene.estimatedDuration}m
                      </td>
                      <td className="py-3 px-4">
                        {scene.vfx ? (
                          <Zap className="h-4 w-4 text-purple-500" />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(scene.status)}`}>
                          {scene.status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          {scene.status !== 'approved' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSceneStatusUpdate(scene.id, 'approved')}
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Characters and Locations */}
        {script && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Characters ({script.characters?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-2">
                {script.characters?.map((character) => (
                  <span
                    key={character}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full"
                  >
                    {character}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Locations ({script.locations?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-2">
                {script.locations?.map((location) => (
                  <span
                    key={location}
                    className="px-3 py-1 text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full"
                  >
                    {location}
                  </span>
                ))}
              </div>
              
            </motion.div>
          </div>
        )}
          </div>
        )}

        {/* Script Editor Tab */}
        {activeTab === 'editor' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Script Editor</h2>
                  {uploadedFileName && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Current file: {uploadedFileName}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {isEditingScript ? (
                    <>
                      <button
                        onClick={saveScript}
                        className="inline-flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Script
                      </button>
                      <button
                        onClick={() => setIsEditingScript(false)}
                        className="inline-flex items-center px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="script-upload"
                      />
                      <label
                        htmlFor="script-upload"
                        className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload File
                      </label>
                      <button
                        onClick={() => setIsEditingScript(true)}
                        className="inline-flex items-center px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Script
                      </button>
                      <button
                        onClick={handleScriptBreakdown}
                        className="inline-flex items-center px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <Bot className="h-4 w-4 mr-2" />
                        AI Breakdown
                      </button>
                    </>
                  )}
                </div>
              </div>

              {isEditingScript ? (
                <textarea
                  value={scriptText}
                  onChange={(e) => setScriptText(e.target.value)}
                  className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your script here..."
                />
              ) : (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 h-96 overflow-y-auto">
                  <pre className="text-sm text-gray-900 dark:text-gray-100 font-mono whitespace-pre-wrap">
                    {scriptText || 'No script loaded. Upload a file or click "Edit Script" to start writing.'}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Scene Breakdown Tab */}
        {activeTab === 'breakdown' && script && (
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
                    <option value="draft">Draft</option>
                    <option value="in_review">In Review</option>
                    <option value="approved">Approved</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Enhanced Scenes Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Scene</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Location</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Duration</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">VFX</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Status</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {script.scenes?.map((scene, index) => (
                      <tr key={scene.id || `scene-${index}`} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {scene.number}
                            </span>
                            {scene.vfx && <Zap className="h-4 w-4 text-purple-500" />}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {editingScene === scene.id ? (
                            <input
                              type="text"
                              defaultValue={scene.description}
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                          ) : (
                            <div className="max-w-xs">
                              <div className="truncate" title={scene.description}>
                                {scene.description}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {editingScene === scene.id ? (
                            <input
                              type="text"
                              defaultValue={scene.location}
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                          ) : (
                            scene.location
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {editingScene === scene.id ? (
                            <input
                              type="number"
                              defaultValue={scene.estimatedDuration}
                              className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                          ) : (
                            `${scene.estimatedDuration}m`
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {scene.vfx ? (
                            <Zap className="h-4 w-4 text-purple-500" />
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {editingScene === scene.id ? (
                            <select
                              defaultValue={scene.status}
                              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                              <option value="draft">Draft</option>
                              <option value="in_review">In Review</option>
                              <option value="approved">Approved</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(scene.status)}`}>
                              {scene.status?.replace('_', ' ')}
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

        {/* AI Breakdown Results Modal */}
        <Modal
          isOpen={showBreakdownModal}
          onClose={() => setShowBreakdownModal(false)}
          title="AI Script Breakdown Results"
          size="xl"
        >
          {breakdown && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {breakdown.summary.totalScenes}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">Scenes</p>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {breakdown.summary.totalDuration}m
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">Duration</p>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {breakdown.summary.vfxScenes}
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400">VFX Scenes</p>
                </div>
                <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-lg font-bold text-red-600 dark:text-red-400">
                    {breakdown.summary.locations.length}
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400">Locations</p>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Detected Scenes
                </h4>
                <div className="space-y-3">
                  {breakdown.scenes.map((scene: any, index: number) => (
                    <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            Scene {scene.number}
                          </span>
                          {scene.vfx && <Zap className="h-4 w-4 text-purple-500" />}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {scene.estimatedDuration}min
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {scene.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>{scene.location}</span>
                        <span>{scene.timeOfDay}</span>
                        <span>{scene.characters.length} characters</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button variant="secondary" onClick={() => setShowBreakdownModal(false)}>
                  Close
                </Button>
                <Button>
                  Save Breakdown
                </Button>
              </div>
            </div>
          )}
        </Modal>

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
                  Ask me about your script analysis, scene breakdown, or production planning!
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
                  placeholder="Ask about your script..."
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

      </motion.div>
    </RoleGuard>
  );
};
