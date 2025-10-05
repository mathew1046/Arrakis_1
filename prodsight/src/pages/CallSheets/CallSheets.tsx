import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardList,
  Download,
  Calendar,
  MapPin,
  Clock,
  Users,
  Camera,
  Zap,
  Plus,
  Edit,
  Eye,
  Send,
  Printer,
  Share2,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

interface CallSheet {
  id: string;
  date: Date;
  location: string;
  scenes: CallSheetScene[];
  cast: CallSheetCast[];
  crew: CallSheetCrew[];
  callTime: string;
  wrapTime: string;
  weather: string;
  notes: string;
  status: 'draft' | 'sent' | 'confirmed';
}

interface CallSheetScene {
  sceneNumber: number;
  description: string;
  location: string;
  timeOfDay: string;
  estimatedDuration: number;
  vfx: boolean;
  props: string[];
  costumes: string[];
}

interface CallSheetCast {
  name: string;
  character: string;
  callTime: string;
  pickupLocation?: string;
  costume: string;
  makeup: string;
}

interface CallSheetCrew {
  name: string;
  role: string;
  callTime: string;
  department: string;
}

export const CallSheets: React.FC = () => {
  const [callSheets, setCallSheets] = useState<CallSheet[]>([]);
  const [selectedCallSheet, setSelectedCallSheet] = useState<CallSheet | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    // Initialize demo call sheets
    const demoCallSheets: CallSheet[] = [
      {
        id: '1',
        date: new Date(2024, 9, 15), // October 15, 2024
        location: 'Mumbai Street Location',
        scenes: [
          {
            sceneNumber: 1,
            description: 'Opening street scene with vendors and pedestrians',
            location: 'Mumbai Street',
            timeOfDay: 'DAY',
            estimatedDuration: 5,
            vfx: false,
            props: ['Street stalls', 'Vendor carts', 'Newspapers'],
            costumes: ['Casual street wear', 'Vendor uniforms']
          },
          {
            sceneNumber: 5,
            description: 'Office meeting scene',
            location: 'Office Building - Mumbai',
            timeOfDay: 'DAY',
            estimatedDuration: 4,
            vfx: false,
            props: ['Conference table', 'Projector', 'Laptops'],
            costumes: ['Business attire', 'Formal shirts']
          }
        ],
        cast: [
          {
            name: 'Rahul Sharma',
            character: 'Rahul',
            callTime: '07:00',
            pickupLocation: 'Hotel Taj - Colaba',
            costume: 'Casual shirt and jeans',
            makeup: 'Natural look'
          },
          {
            name: 'Supporting Actor 1',
            character: 'Office Colleague',
            callTime: '08:30',
            costume: 'Business suit',
            makeup: 'Professional look'
          }
        ],
        crew: [
          {
            name: 'Director Name',
            role: 'Director',
            callTime: '06:30',
            department: 'Direction'
          },
          {
            name: 'DOP Name',
            role: 'Director of Photography',
            callTime: '06:30',
            department: 'Camera'
          },
          {
            name: 'Sound Engineer',
            role: 'Sound Recordist',
            callTime: '07:00',
            department: 'Sound'
          }
        ],
        callTime: '07:00',
        wrapTime: '18:00',
        weather: 'Sunny, 28°C',
        notes: 'Street shooting requires crowd control. Local permits arranged.',
        status: 'sent'
      },
      {
        id: '2',
        date: new Date(2024, 9, 16), // October 16, 2024
        location: 'Coffee Shop - Kochi',
        scenes: [
          {
            sceneNumber: 2,
            description: 'Rahul and Priya discuss AI project over coffee',
            location: 'Coffee Shop Interior',
            timeOfDay: 'DAY',
            estimatedDuration: 8,
            vfx: false,
            props: ['Coffee cups', 'Laptop', 'Documents', 'Menu cards'],
            costumes: ['Casual wear', 'Smart casual']
          },
          {
            sceneNumber: 4,
            description: 'Beach conversation at sunset',
            location: 'Beach - Kochi',
            timeOfDay: 'SUNSET',
            estimatedDuration: 6,
            vfx: false,
            props: ['Beach chairs', 'Sunset lighting setup'],
            costumes: ['Light summer clothes', 'Beach wear']
          }
        ],
        cast: [
          {
            name: 'Rahul Sharma',
            character: 'Rahul',
            callTime: '08:00',
            pickupLocation: 'Hotel Grand - Kochi',
            costume: 'Casual shirt and chinos',
            makeup: 'Natural day look'
          },
          {
            name: 'Priya Nair',
            character: 'Priya',
            callTime: '08:30',
            pickupLocation: 'Residence - Kochi',
            costume: 'Summer dress',
            makeup: 'Natural with light evening touch-up'
          }
        ],
        crew: [
          {
            name: 'Director Name',
            role: 'Director',
            callTime: '07:30',
            department: 'Direction'
          },
          {
            name: 'DOP Name',
            role: 'Director of Photography',
            callTime: '07:30',
            department: 'Camera'
          },
          {
            name: 'Gaffer',
            role: 'Chief Lighting',
            callTime: '07:00',
            department: 'Lighting'
          }
        ],
        callTime: '08:00',
        wrapTime: '19:00',
        weather: 'Partly cloudy, 26°C, Good for sunset',
        notes: 'Beach location requires tide timing consideration. Backup indoor location ready.',
        status: 'draft'
      }
    ];

    setCallSheets(demoCallSheets);
  }, []);

  const handlePreviewCallSheet = (callSheet: CallSheet) => {
    setSelectedCallSheet(callSheet);
    setShowPreviewModal(true);
  };

  const handleSendCallSheet = (callSheetId: string) => {
    setCallSheets(prev => prev.map(cs => 
      cs.id === callSheetId ? { ...cs, status: 'sent' } : cs
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'sent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Call Sheets
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate and manage daily shooting call sheets
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Call Sheet
          </Button>
        </div>
      </div>

      {/* Call Sheets List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {callSheets.map((callSheet, index) => (
          <motion.div
            key={callSheet.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {callSheet.date.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Call Time: {callSheet.callTime} | Wrap: {callSheet.wrapTime}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(callSheet.status)}`}>
                  {callSheet.status.charAt(0).toUpperCase() + callSheet.status.slice(1)}
                </span>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {callSheet.location}
                </div>
                <div className="flex items-center">
                  <Camera className="h-4 w-4 mr-1" />
                  {callSheet.scenes.length} scene{callSheet.scenes.length !== 1 ? 's' : ''}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {callSheet.cast.length} cast
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Scenes */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Scenes</h4>
                <div className="space-y-2">
                  {callSheet.scenes.map((scene, sceneIndex) => (
                    <div key={sceneIndex} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            Scene {scene.sceneNumber}
                          </span>
                          {scene.vfx && <Zap className="h-4 w-4 text-purple-500" />}
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {scene.timeOfDay}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {scene.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {scene.estimatedDuration}h
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cast */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Cast</h4>
                <div className="space-y-2">
                  {callSheet.cast.slice(0, 2).map((actor, actorIndex) => (
                    <div key={actorIndex} className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {actor.name}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                          as {actor.character}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {actor.callTime}
                      </span>
                    </div>
                  ))}
                  {callSheet.cast.length > 2 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      +{callSheet.cast.length - 2} more cast members
                    </p>
                  )}
                </div>
              </div>

              {/* Weather */}
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Weather</span>
                <span className="text-sm text-blue-800 dark:text-blue-200">{callSheet.weather}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePreviewCallSheet(callSheet)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
                <div className="flex space-x-2">
                  {callSheet.status === 'draft' && (
                    <Button
                      size="sm"
                      onClick={() => handleSendCallSheet(callSheet.id)}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Send
                    </Button>
                  )}
                  <Button variant="secondary" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Call Sheet Preview"
        size="xl"
      >
        {selectedCallSheet && (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                CALL SHEET
              </h2>
              <div className="text-lg text-gray-700 dark:text-gray-300">
                {selectedCallSheet.date.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Location: {selectedCallSheet.location} | Weather: {selectedCallSheet.weather}
              </div>
            </div>

            {/* Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">SCHEDULE</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Call Time:</span>
                    <span className="font-medium">{selectedCallSheet.callTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wrap Time:</span>
                    <span className="font-medium">{selectedCallSheet.wrapTime}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">WEATHER</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedCallSheet.weather}
                </p>
              </div>
            </div>

            {/* Scenes */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">SCENES</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="text-left py-2 px-3">Scene</th>
                      <th className="text-left py-2 px-3">Description</th>
                      <th className="text-left py-2 px-3">Location</th>
                      <th className="text-left py-2 px-3">Time</th>
                      <th className="text-left py-2 px-3">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCallSheet.scenes.map((scene, index) => (
                      <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="py-2 px-3 font-medium">{scene.sceneNumber}</td>
                        <td className="py-2 px-3">{scene.description}</td>
                        <td className="py-2 px-3">{scene.location}</td>
                        <td className="py-2 px-3">{scene.timeOfDay}</td>
                        <td className="py-2 px-3">{scene.estimatedDuration}h</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cast */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">CAST</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="text-left py-2 px-3">Actor</th>
                      <th className="text-left py-2 px-3">Character</th>
                      <th className="text-left py-2 px-3">Call Time</th>
                      <th className="text-left py-2 px-3">Pickup</th>
                      <th className="text-left py-2 px-3">Costume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCallSheet.cast.map((actor, index) => (
                      <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="py-2 px-3 font-medium">{actor.name}</td>
                        <td className="py-2 px-3">{actor.character}</td>
                        <td className="py-2 px-3">{actor.callTime}</td>
                        <td className="py-2 px-3">{actor.pickupLocation || 'Direct'}</td>
                        <td className="py-2 px-3">{actor.costume}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Crew */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">CREW</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCallSheet.crew.map((member, index) => (
                  <div key={index} className="flex justify-between items-center py-1">
                    <div>
                      <span className="font-medium">{member.name}</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2">({member.role})</span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {member.callTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {selectedCallSheet.notes && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">NOTES</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  {selectedCallSheet.notes}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="secondary">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="secondary">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
