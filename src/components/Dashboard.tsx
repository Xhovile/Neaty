import React from 'react';
import { Users, BookOpen, FileText, GraduationCap, Calendar, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Student, MarkEntry, Subject, Class } from '../types';

interface DashboardProps {
  students: Student[];
  marks: MarkEntry[];
  subjects: Subject[];
  classes: Class[];
}

export default function Dashboard({ students, marks, subjects, classes }: DashboardProps) {
  const stats = [
    { label: 'Total Students', value: students.length, icon: Users, color: 'bg-blue-500', shadow: 'shadow-blue-100' },
    { label: 'Classes', value: classes.length, icon: GraduationCap, color: 'bg-emerald-500', shadow: 'shadow-emerald-100' },
    { label: 'Subjects', value: subjects.length, icon: BookOpen, color: 'bg-amber-500', shadow: 'shadow-amber-100' },
    { label: 'Reports Ready', value: marks.length, icon: FileText, color: 'bg-indigo-500', shadow: 'shadow-indigo-100' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening in Neaty today.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
            <Calendar size={20} />
          </div>
          <div className="pr-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Current Date</p>
            <p className="text-sm font-semibold text-gray-700">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-white p-6 rounded-3xl border border-gray-100 shadow-xl ${stat.shadow} flex items-center gap-5 group hover:-translate-y-1 transition-all duration-300`}
          >
            <div className={`${stat.color} p-4 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Quick Actions / Recent Activity */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
              <Zap size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">System Insights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
              <div>
                <p className="text-sm font-bold text-gray-800">Dynamic Grading Active</p>
                <p className="text-xs text-gray-500 mt-1">Configurable scales are applied to all reports.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
              <div>
                <p className="text-sm font-bold text-gray-800">Term Management</p>
                <p className="text-xs text-gray-500 mt-1">Multiple terms and academic years supported.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-2" />
              <div>
                <p className="text-sm font-bold text-gray-800">System Backup</p>
                <p className="text-xs text-gray-500 mt-1">All local data is automatically synced to browser storage.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
