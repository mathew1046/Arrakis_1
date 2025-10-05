import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Upload, X, FileText, Image, Receipt, Save, Calendar,
  DollarSign, Tag, User, AlertCircle, CheckCircle
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface ExpenseEntry {
  id: string;
  title: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  submittedBy: string;
  receiptFiles: {
    name: string;
    size: number;
    type: string;
    url: string;
  }[];
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submissionDate?: string;
  approvalDate?: string;
  notes?: string;
}

interface ManualExpenseEntryProps {
  onExpenseAdded?: (expense: ExpenseEntry) => void;
  currentUser: string;
}

export const ManualExpenseEntry: React.FC<ManualExpenseEntryProps> = ({
  onExpenseAdded,
  currentUser
}) => {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: 0,
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    receiptFiles: [] as File[]
  });

  const categories = [
    'Equipment Rental',
    'Location Fees',
    'Catering',
    'Transportation',
    'Accommodation',
    'Costume & Makeup',
    'Props',
    'Post-Production',
    'Marketing',
    'Insurance',
    'Permits & Licenses',
    'Miscellaneous'
  ];

  const handleFileUpload = (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    setNewExpense(prev => ({
      ...prev,
      receiptFiles: [...prev.receiptFiles, ...validFiles].slice(0, 5) // Max 5 files
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    setNewExpense(prev => ({
      ...prev,
      receiptFiles: prev.receiptFiles.filter((_, i) => i !== index)
    }));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type === 'application/pdf') return <FileText className="h-4 w-4" />;
    return <Receipt className="h-4 w-4" />;
  };

  const handleSubmit = async (status: 'draft' | 'submitted') => {
    if (!newExpense.title || !newExpense.amount || !newExpense.category) {
      return;
    }

    setIsSubmitting(true);

    // Simulate file upload and processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const expense: ExpenseEntry = {
      id: Date.now().toString(),
      title: newExpense.title,
      amount: newExpense.amount,
      category: newExpense.category,
      description: newExpense.description,
      date: newExpense.date,
      submittedBy: currentUser,
      receiptFiles: newExpense.receiptFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file) // In real app, this would be uploaded to server
      })),
      status,
      submissionDate: status === 'submitted' ? new Date().toISOString() : undefined
    };

    onExpenseAdded?.(expense);

    // Reset form
    setNewExpense({
      title: '',
      amount: 0,
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      receiptFiles: []
    });

    setIsSubmitting(false);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Entry Button */}
      {!showForm && (
        <motion.button
          onClick={() => setShowForm(true)}
          className="w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex flex-col items-center space-y-2">
            <Plus className="h-8 w-8 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Add Manual Expense Entry
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Record expenses with receipt uploads and automatic categorization
            </p>
          </div>
        </motion.button>
      )}

      {/* Expense Entry Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Manual Expense Entry
            </h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expense Title *
                </label>
                <input
                  type="text"
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="e.g., Camera Equipment Rental for Scene 3B"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount (₹) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Select category...</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Submitted By
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={currentUser}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Additional details about this expense..."
                />
              </div>
            </div>

            {/* File Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Receipt Attachments
              </label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
                        Drop files here or click to upload
                      </span>
                      <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, PDF up to 10MB (Max 5 files)
                      </span>
                    </label>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      accept="image/*,.pdf"
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    />
                  </div>
                </div>
              </div>

              {/* Uploaded Files */}
              {newExpense.receiptFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Uploaded Files ({newExpense.receiptFiles.length}/5)
                  </p>
                  {newExpense.receiptFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-gray-500 dark:text-gray-400">
                          {getFileIcon(file.type)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary */}
            {newExpense.amount > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Expense Summary
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600 dark:text-blue-400">Amount:</span>
                    <span className="ml-2 font-medium text-blue-800 dark:text-blue-200">
                      {formatCurrency(newExpense.amount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-600 dark:text-blue-400">Category:</span>
                    <span className="ml-2 font-medium text-blue-800 dark:text-blue-200">
                      {newExpense.category || 'Not selected'}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-600 dark:text-blue-400">Date:</span>
                    <span className="ml-2 font-medium text-blue-800 dark:text-blue-200">
                      {new Date(newExpense.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-600 dark:text-blue-400">Receipts:</span>
                    <span className="ml-2 font-medium text-blue-800 dark:text-blue-200">
                      {newExpense.receiptFiles.length} files
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              
              <button
                onClick={() => handleSubmit('draft')}
                className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-yellow-100 dark:bg-yellow-900/20 hover:bg-yellow-200 dark:hover:bg-yellow-900/30 rounded-lg transition-colors flex items-center justify-center"
                disabled={isSubmitting || !newExpense.title || !newExpense.amount || !newExpense.category}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save as Draft
              </button>
              
              <button
                onClick={() => handleSubmit('submitted')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center"
                disabled={isSubmitting || !newExpense.title || !newExpense.amount || !newExpense.category}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Submit for Approval
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
