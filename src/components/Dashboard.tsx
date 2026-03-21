import React, { useState, useEffect } from 'react';
import { Users, BookOpen, FileText, GraduationCap, TrendingUp, Calendar, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { getSchoolNews } from '../services/aiService';
import { Student, MarkEntry, Subject, Class } from '../types';

interface DashboardProps {
  students: Student[];
  marks: MarkEntry[];
  subjects: Subject[];
  classes: Class[];
}

export default function Dashboard({ students, marks, subjects, classes }: DashboardProps) {
  const [news, setNews] = useState<string>('Loading education trends...');

  useEffect(() => {
    const fetchNews = async () => {
      const result = await getSchoolNews();
      setNews(result);
    };
    fetchNews();
  }, []);

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AI News Section */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                <Search size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Education Trends & News</h2>
            </div>
            <div className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">AI Powered</div>
          </div>
          <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 italic whitespace-pre-wrap">
              {news}
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
            <TrendingUp size={14} />
            <span>Data sourced via Google Search Grounding</span>
          </div>
        </motion.div>

        {/* Quick Actions / Recent Activity */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-6">Quick Insights</h2>
          <div className="space-y-6">
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
          <button className="w-full mt-8 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold rounded-xl text-sm transition-colors border border-gray-200">
            View All Activity
          </button>
        </motion.div>
      </div>
    </div>
  );
}
