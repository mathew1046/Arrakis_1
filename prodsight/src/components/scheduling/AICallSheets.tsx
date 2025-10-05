import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Download, Eye, Calendar, Clock, MapPin, Users, Camera,
  Zap, CheckCircle, AlertCircle, Plus, Edit3, Share, Printer
} from 'lucide-react';

interface CallSheet {
  id: string;
  date: string;
  title: string;
  location: string;
  weatherForecast: string;
  sunrise: string;
  sunset: string;
  scenes: {
    number: string;
    description: string;
    location: string;
    estimatedTime: string;
    pages: number;
  }[];
  cast: {
    name: string;
    character: string;
    callTime: string;
    pickupTime?: string;
    wardrobe: string;
    makeup: string;
  }[];
  crew: {
    department: string;
    members: string[];
    callTime: string;
    notes?: string;
  }[];
  equipment: {
    category: string;
    items: string[];
    responsible: string;
  }[];
  catering: {
    breakfast: string;
    lunch: string;
    dinner?: string;
    specialDietary: string[];
  };
  transportation: {
    pickupLocations: string[];
    shuttleSchedule: string[];
  };
  emergencyContacts: {
    name: string;
    role: string;
    phone: string;
  }[];
  notes: string[];
  status: 'draft' | 'approved' | 'distributed';
  generatedBy: 'ai' | 'manual';
}

export const AICallSheets: React.FC = () => {
  const [callSheets, setCallSheets] = useState<CallSheet[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<CallSheet | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const demoCallSheets: CallSheet[] = [
      {
        id: '1',
        date: '2024-02-15',
        title: 'Day 1 - Coffee Shop Interior',
        location: 'Mumbai Film City Studio 7',
        weatherForecast: 'Sunny, 28°C',
        sunrise: '06:45',
        sunset: '18:30',
        scenes: [
          {
            number: '1A',
            description: 'Protagonist meets mysterious stranger',
            location: 'Coffee shop interior',
            estimatedTime: '3 hours',
            pages: 2.5
          },
          {
            number: '1B',
            description: 'Conversation continues, tension builds',
            location: 'Coffee shop interior',
            estimatedTime: '2 hours',
            pages: 1.8
          }
        ],
        cast: [
          {
            name: 'Rajesh Kumar',
            character: 'Protagonist',
            callTime: '07:00',
            pickupTime: '06:30',
            wardrobe: 'Casual shirt, jeans',
            makeup: '08:00'
          },
          {
            name: 'Priya Sharma',
            character: 'Mysterious Stranger',
            callTime: '08:00',
            wardrobe: 'Business suit, briefcase',
            makeup: '08:30'
          }
        ],
        crew: [
          {
            department: 'Camera',
            members: ['Cinematographer', 'Camera Operator', 'Focus Puller'],
            callTime: '06:30',
            notes: 'Setup RED Epic with 50mm lens'
          },
          {
            department: 'Sound',
            members: ['Sound Recordist', 'Boom Operator'],
            callTime: '07:00'
          },
          {
            department: 'Lighting',
            members: ['Gaffer', 'Best Boy', '2x Electricians'],
            callTime: '06:00',
            notes: 'Natural lighting setup with fill'
          }
        ],
        equipment: [
          {
            category: 'Camera',
            items: ['RED Epic', '50mm lens', 'Tripod', 'Monitors'],
            responsible: 'Camera Dept'
          },
          {
            category: 'Sound',
            items: ['Boom mic', 'Wireless mics', 'Sound mixer'],
            responsible: 'Sound Dept'
          }
        ],
        catering: {
          breakfast: '07:30 - Continental breakfast',
          lunch: '13:00 - Indian vegetarian thali',
          specialDietary: ['Vegan options', 'Gluten-free bread']
        },
        transportation: {
          pickupLocations: ['Andheri Station - 06:00', 'Bandra West - 06:15'],
          shuttleSchedule: ['Every 30 minutes from base camp']
        },
        emergencyContacts: [
          { name: 'Producer', role: 'Production', phone: '+91-98765-43210' },
          { name: 'First Aid', role: 'Medical', phone: '+91-98765-43211' }
        ],
        notes: [
          'All cast and crew must carry ID cards',
          'No mobile phones during shooting',
          'Backup generator on standby'
        ],
        status: 'approved',
        generatedBy: 'ai'
      }
    ];
    setCallSheets(demoCallSheets);
  }, []);

  const generateAICallSheet = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newCallSheet: CallSheet = {
      id: Date.now().toString(),
      date: '2024-02-18',
      title: 'Day 4 - Helicopter Chase Sequence',
      location: 'Bandra-Worli Sea Link',
      weatherForecast: 'Clear skies, 26°C, Light winds',
      sunrise: '06:47',
      sunset: '18:28',
      scenes: [
        {
          number: '3B',
          description: 'High-speed helicopter chase over sea link',
          location: 'Bandra-Worli Sea Link',
          estimatedTime: '6 hours',
          pages: 3.2
        }
      ],
      cast: [
        {
          name: 'Rajesh Kumar',
          character: 'Protagonist',
          callTime: '05:30',
          pickupTime: '05:00',
          wardrobe: 'Action suit with harness',
          makeup: '06:00'
        }
      ],
      crew: [
        {
          department: 'Aerial Unit',
          members: ['Helicopter Pilot', 'Aerial DP', 'Safety Officer'],
          callTime: '05:00',
          notes: 'Weather clearance required'
        },
        {
          department: 'Ground Unit',
          members: ['Director', 'Script Supervisor', 'Continuity'],
          callTime: '05:30'
        }
      ],
      equipment: [
        {
          category: 'Aerial',
          items: ['Helicopter', 'Aerial camera rig', 'Safety equipment'],
          responsible: 'Aerial Unit'
        }
      ],
      catering: {
        breakfast: '05:45 - Light breakfast and coffee',
        lunch: '12:00 - Packed lunch boxes',
        specialDietary: ['Energy bars', 'Hydration drinks']
      },
      transportation: {
        pickupLocations: ['Hotel pickup - 04:30'],
        shuttleSchedule: ['Direct transport to location']
      },
      emergencyContacts: [
        { name: 'Stunt Coordinator', role: 'Safety', phone: '+91-98765-43212' },
        { name: 'Medical Team', role: 'Emergency', phone: '+91-98765-43213' }
      ],
      notes: [
        'All safety protocols must be followed',
        'Weather dependent - backup date Feb 19',
        'Helicopter clearance confirmed'
      ],
      status: 'draft',
      generatedBy: 'ai'
    };
    
    setCallSheets([newCallSheet, ...callSheets]);
    setIsGenerating(false);
  };

  const getStatusColor = (status: CallSheet['status']) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'distributed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <FileText className="h-6 w-6 mr-2" />
            AI-Powered Call Sheets
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Automatically generated call sheets with intelligent scheduling
          </p>
        </div>
        
        <button
          onClick={generateAICallSheet}
          disabled={isGenerating}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Generate AI Call Sheet
            </>
          )}
        </button>
      </div>

      {/* Call Sheets List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {callSheets.map((sheet) => (
          <motion.div
            key={sheet.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {sheet.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(sheet.date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(sheet.status)}`}>
                  {sheet.status}
                </span>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  {sheet.generatedBy === 'ai' ? (
                    <>
                      <Zap className="h-3 w-3 mr-1" />
                      AI Generated
                    </>
                  ) : (
                    <>
                      <Edit3 className="h-3 w-3 mr-1" />
                      Manual
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4 mr-2" />
                {sheet.location}
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Clock className="h-4 w-4 mr-2" />
                Sunrise: {sheet.sunrise} | Sunset: {sheet.sunset}
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Users className="h-4 w-4 mr-2" />
                {sheet.cast.length} cast, {sheet.crew.reduce((sum, dept) => sum + dept.members.length, 0)} crew
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Scenes</p>
                <div className="space-y-1">
                  {sheet.scenes.slice(0, 2).map((scene, index) => (
                    <p key={index} className="text-xs text-gray-500 dark:text-gray-400">
                      {scene.number}: {scene.description.substring(0, 30)}...
                    </p>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weather</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{sheet.weatherForecast}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedSheet(sheet)}
                  className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
                  <Edit3 className="h-4 w-4" />
                </button>
                <button className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors">
                  <Download className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors">
                  Share
                </button>
                <button className="px-3 py-1 text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors">
                  Print
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Call Sheet Preview Modal */}
      {selectedSheet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Call Sheet Preview
                </h3>
                <button
                  onClick={() => setSelectedSheet(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>
              
              {/* Call Sheet Content */}
              <div className="space-y-6 text-sm">
                <div className="text-center border-b pb-4">
                  <h1 className="text-2xl font-bold">{selectedSheet.title}</h1>
                  <p className="text-lg">{new Date(selectedSheet.date).toLocaleDateString()}</p>
                  <p>{selectedSheet.location}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <strong>Weather:</strong> {selectedSheet.weatherForecast}
                  </div>
                  <div>
                    <strong>Sunrise:</strong> {selectedSheet.sunrise}
                  </div>
                  <div>
                    <strong>Sunset:</strong> {selectedSheet.sunset}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold mb-2">SCENES</h4>
                  {selectedSheet.scenes.map((scene, index) => (
                    <div key={index} className="mb-2">
                      <strong>Scene {scene.number}:</strong> {scene.description}
                      <br />
                      <span className="text-gray-600">Location: {scene.location} | Est. Time: {scene.estimatedTime}</span>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h4 className="font-bold mb-2">CAST</h4>
                  <table className="w-full border-collapse border">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="border p-2 text-left">Actor</th>
                        <th className="border p-2 text-left">Character</th>
                        <th className="border p-2 text-left">Call Time</th>
                        <th className="border p-2 text-left">Makeup</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSheet.cast.map((actor, index) => (
                        <tr key={index}>
                          <td className="border p-2">{actor.name}</td>
                          <td className="border p-2">{actor.character}</td>
                          <td className="border p-2">{actor.callTime}</td>
                          <td className="border p-2">{actor.makeup}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div>
                  <h4 className="font-bold mb-2">CREW</h4>
                  {selectedSheet.crew.map((dept, index) => (
                    <div key={index} className="mb-2">
                      <strong>{dept.department}:</strong> {dept.members.join(', ')} - Call: {dept.callTime}
                      {dept.notes && <span className="text-gray-600"> ({dept.notes})</span>}
                    </div>
                  ))}
                </div>
                
                <div>
                  <h4 className="font-bold mb-2">CATERING</h4>
                  <p><strong>Breakfast:</strong> {selectedSheet.catering.breakfast}</p>
                  <p><strong>Lunch:</strong> {selectedSheet.catering.lunch}</p>
                  {selectedSheet.catering.specialDietary.length > 0 && (
                    <p><strong>Special Dietary:</strong> {selectedSheet.catering.specialDietary.join(', ')}</p>
                  )}
                </div>
                
                <div>
                  <h4 className="font-bold mb-2">EMERGENCY CONTACTS</h4>
                  {selectedSheet.emergencyContacts.map((contact, index) => (
                    <p key={index}><strong>{contact.role}:</strong> {contact.name} - {contact.phone}</p>
                  ))}
                </div>
                
                <div>
                  <h4 className="font-bold mb-2">NOTES</h4>
                  <ul className="list-disc list-inside">
                    {selectedSheet.notes.map((note, index) => (
                      <li key={index}>{note}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                  <Download className="h-4 w-4 mr-2 inline" />
                  Download PDF
                </button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <Share className="h-4 w-4 mr-2 inline" />
                  Share
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
