import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, UserPlus, X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Student } from '../types';
import { CLASSES, TERMS } from '../constants';

interface StudentsProps {
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onDeleteStudent: (id: string) => void;
}

export default function Students({ students, onAddStudent, onDeleteStudent }: StudentsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Omit<Student, 'id'>>({
    fullName: '',
    admissionNumber: '',
    gender: 'Male',
    class: CLASSES[0],
    term: TERMS[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStudent(formData);
    setIsAdding(false);
    setFormData({
      fullName: '',
      admissionNumber: '',
      gender: 'Male',
      class: CLASSES[0],
      term: TERMS[0],
    });
  };

  const filteredStudents = students.filter(s =>
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your school's student records and admissions.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2 font-semibold group"
        >
          <UserPlus size={20} className="group-hover:scale-110 transition-transform" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xl flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or admission number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold rounded-2xl text-sm transition-colors border border-gray-200">
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Admission No.</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Gender</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Class</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Term</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, idx) => (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    key={student.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        {student.admissionNumber}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-gray-800">{student.fullName}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${student.gender === 'Male' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                        {student.gender}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-600 font-medium">{student.class}</td>
                    <td className="px-8 py-5 text-sm text-gray-600 font-medium">{student.term}</td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => onDeleteStudent(student.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-gray-400 italic">
                    No students found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100"
            >
              <div className="bg-blue-600 p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserPlus size={24} />
                  <h2 className="text-xl font-bold">Add New Student</h2>
                </div>
                <button onClick={() => setIsAdding(false)} className="hover:bg-blue-500 p-1 rounded-xl transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Admission No.</label>
                    <input
                      type="text"
                      required
                      value={formData.admissionNumber}
                      onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                      placeholder="ADM-000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm appearance-none cursor-pointer"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Class</label>
                    <select
                      value={formData.class}
                      onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm appearance-none cursor-pointer"
                    >
                      {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Term</label>
                    <select
                      value={formData.term}
                      onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm appearance-none cursor-pointer"
                    >
                      {TERMS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold rounded-xl text-sm transition-colors border border-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-blue-100"
                  >
                    Save Student
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
