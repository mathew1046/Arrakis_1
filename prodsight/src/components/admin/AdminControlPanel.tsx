import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus,
  UserMinus,
  Edit3,
  Save,
  X,
  Search,
  Filter,
  Shield,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Settings,
  Eye,
  Trash2,
  Plus
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  availability: string[];
  skills: string[];
  hourlyRate?: number;
  status: 'active' | 'inactive' | 'on_leave';
  joinDate: string;
  permissions: string[];
  profileImage?: string;
}

interface AdminControlPanelProps {
  onTeamMemberUpdate?: (members: TeamMember[]) => void;
}

export const AdminControlPanel: React.FC<AdminControlPanelProps> = ({ onTeamMemberUpdate }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    name: '',
    role: '',
    department: '',
    email: '',
    phone: '',
    availability: [],
    skills: [],
    hourlyRate: 0,
    status: 'active',
    permissions: []
  });

  // Initialize demo data
  useEffect(() => {
    setTeamMembers([
      {
        id: '1',
        name: 'Sarah Wilson',
        role: 'Director of Photography',
        department: 'Cinematography',
        email: 'sarah@production.com',
        phone: '+1-555-0101',
        availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        skills: ['RED Camera', 'Lighting', 'Color Grading', 'Steadicam'],
        hourlyRate: 150,
        status: 'active',
        joinDate: '2024-01-10',
        permissions: ['camera_access', 'lighting_control', 'crew_lead']
      },
      {
        id: '2',
        name: 'Tom Rodriguez',
        role: 'VFX Supervisor',
        department: 'VFX',
        email: 'tom@vfx.com',
        phone: '+1-555-0102',
        availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        skills: ['Maya', 'Nuke', 'Houdini', 'After Effects', 'Unreal Engine'],
        hourlyRate: 120,
        status: 'active',
        joinDate: '2024-01-08',
        permissions: ['vfx_access', 'render_farm', 'asset_management']
      },
      {
        id: '3',
        name: 'Maria Garcia',
        role: 'Sound Engineer',
        department: 'Sound',
        email: 'maria@sound.com',
        phone: '+1-555-0103',
        availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        skills: ['Pro Tools', 'Sound Design', 'Boom Operation', 'Mixing'],
        hourlyRate: 100,
        status: 'active',
        joinDate: '2024-01-12',
        permissions: ['sound_equipment', 'recording_access']
      },
      {
        id: '4',
        name: 'James Chen',
        role: 'Gaffer',
        department: 'Lighting',
        email: 'james@lighting.com',
        phone: '+1-555-0104',
        availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        skills: ['LED Lighting', 'Electrical', 'DMX Control', 'Rigging'],
        hourlyRate: 90,
        status: 'on_leave',
        joinDate: '2024-01-05',
        permissions: ['electrical_access', 'lighting_control']
      },
      {
        id: '5',
        name: 'Emma Thompson',
        role: 'Script Supervisor',
        department: 'Production',
        email: 'emma@production.com',
        phone: '+1-555-0105',
        availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        skills: ['Script Analysis', 'Continuity', 'Note Taking', 'Organization'],
        hourlyRate: 80,
        status: 'active',
        joinDate: '2024-01-15',
        permissions: ['script_access', 'continuity_reports']
      }
    ]);
  }, []);

  // Filter team members
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Get unique departments
  const departments = Array.from(new Set(teamMembers.map(member => member.department)));

  // Statistics
  const activeMembers = teamMembers.filter(m => m.status === 'active').length;
  const totalMembers = teamMembers.length;
  const avgHourlyRate = teamMembers.reduce((sum, m) => sum + (m.hourlyRate || 0), 0) / teamMembers.length;

  const handleAddMember = () => {
    if (newMember.name && newMember.role && newMember.department && newMember.email) {
      const member: TeamMember = {
        id: Date.now().toString(),
        name: newMember.name,
        role: newMember.role,
        department: newMember.department,
        email: newMember.email,
        phone: newMember.phone || '',
        availability: newMember.availability || [],
        skills: newMember.skills || [],
        hourlyRate: newMember.hourlyRate || 0,
        status: newMember.status || 'active',
        joinDate: new Date().toISOString().split('T')[0],
        permissions: newMember.permissions || []
      };
      
      const updatedMembers = [...teamMembers, member];
      setTeamMembers(updatedMembers);
      onTeamMemberUpdate?.(updatedMembers);
      
      setNewMember({
        name: '',
        role: '',
        department: '',
        email: '',
        phone: '',
        availability: [],
        skills: [],
        hourlyRate: 0,
        status: 'active',
        permissions: []
      });
      setShowAddForm(false);
    }
  };

  const handleUpdateMember = (updatedMember: TeamMember) => {
    const updatedMembers = teamMembers.map(member => 
      member.id === updatedMember.id ? updatedMember : member
    );
    setTeamMembers(updatedMembers);
    onTeamMemberUpdate?.(updatedMembers);
    setEditingMember(null);
  };

  const handleRemoveMember = (id: string) => {
    const updatedMembers = teamMembers.filter(member => member.id !== id);
    setTeamMembers(updatedMembers);
    onTeamMemberUpdate?.(updatedMembers);
  };

  const handleStatusChange = (id: string, status: TeamMember['status']) => {
    const updatedMembers = teamMembers.map(member => 
      member.id === id ? { ...member, status } : member
    );
    setTeamMembers(updatedMembers);
    onTeamMemberUpdate?.(updatedMembers);
  };

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: TeamMember['status']) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'inactive': return <X className="h-4 w-4" />;
      case 'on_leave': return <Clock className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Team Members</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalMembers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Members</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{activeMembers}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Departments</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{departments.length}</p>
            </div>
            <Shield className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Hourly Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">${Math.round(avgHourlyRate)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on_leave">On Leave</option>
          </select>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Add Team Member
        </button>
      </div>

      {/* Add Member Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Add New Team Member
                </h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role *
                  </label>
                  <input
                    type="text"
                    value={newMember.role}
                    onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="e.g., Director of Photography"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Department *
                  </label>
                  <select
                    value={newMember.department}
                    onChange={(e) => setNewMember({...newMember, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Select Department</option>
                    <option value="Production">Production</option>
                    <option value="Cinematography">Cinematography</option>
                    <option value="VFX">VFX</option>
                    <option value="Sound">Sound</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Art Department">Art Department</option>
                    <option value="Wardrobe">Wardrobe</option>
                    <option value="Makeup">Makeup</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newMember.phone}
                    onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="+1-555-0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    value={newMember.hourlyRate}
                    onChange={(e) => setNewMember({...newMember, hourlyRate: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newMember.skills?.join(', ')}
                    onChange={(e) => setNewMember({...newMember, skills: e.target.value.split(',').map(s => s.trim())})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="e.g., RED Camera, Lighting, Color Grading"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMember}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Member
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <motion.div
            key={member.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">{member.department}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusColor(member.status)}`}>
                  {getStatusIcon(member.status)}
                  {member.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4 mr-2" />
                {member.email}
              </div>
              {member.phone && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="h-4 w-4 mr-2" />
                  {member.phone}
                </div>
              )}
              {member.hourlyRate && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <DollarSign className="h-4 w-4 mr-2" />
                  ${member.hourlyRate}/hour
                </div>
              )}
            </div>

            {member.skills.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {member.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                  {member.skills.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded">
                      +{member.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setEditingMember(member)}
                className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center gap-1"
              >
                <Edit3 className="h-3 w-3" />
                Edit
              </button>
              <select
                value={member.status}
                onChange={(e) => handleStatusChange(member.id, e.target.value as TeamMember['status'])}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on_leave">On Leave</option>
              </select>
              <button
                onClick={() => handleRemoveMember(member.id)}
                className="px-3 py-2 text-sm bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No team members found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};
