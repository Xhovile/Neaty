import React, { useState, useMemo } from 'react';
import { Printer, Download, User, Search, GraduationCap, FileText, Stamp, PenTool } from 'lucide-react';
import { motion } from 'motion/react';
import { Student, Mark, Subject } from '../types';
import { SUBJECTS, calculateGrade } from '../constants';

interface ReportCardProps {
  students: Student[];
  marks: Mark[];
}

export default function ReportCard({ students, marks }: ReportCardProps) {
  const [selectedStudentId, setSelectedStudentId] = useState('');

  const studentMarks = useMemo(() => {
    return marks.filter(m => m.studentId === selectedStudentId);
  }, [marks, selectedStudentId]);

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const stats = useMemo(() => {
    if (studentMarks.length === 0) return null;
    const total = studentMarks.reduce((acc, m) => acc + m.total, 0);
    const avg = total / studentMarks.length;
    const { grade, remark } = calculateGrade(avg);
    return { total, avg, grade, remark };
  }, [studentMarks]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Header & Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Report Cards</h1>
          <p className="text-gray-500 text-sm mt-1">Generate and print professional student performance reports.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm appearance-none cursor-pointer shadow-sm"
            >
              <option value="">Select a student...</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.fullName}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handlePrint}
            disabled={!selectedStudentId}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-2xl shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2 font-semibold"
          >
            <Printer size={20} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {selectedStudentId ? (
        studentMarks.length > 0 ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden print:shadow-none print:border-none print:rounded-none"
          >
            {/* Report Card Header */}
            <div className="bg-blue-600 p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 print:bg-white print:text-gray-900 print:border-b-2 print:border-gray-200">
              <div className="flex items-center gap-6">
                <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-sm print:bg-gray-100 print:text-blue-600">
                  <GraduationCap size={48} />
                </div>
                <div>
                  <h2 className="text-3xl font-black tracking-tight uppercase">EduReport Academy</h2>
                  <p className="text-blue-100 font-medium tracking-wide print:text-gray-500">Official Academic Performance Report</p>
                </div>
              </div>
              <div className="text-right flex flex-col gap-2">
                <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm print:bg-gray-50 print:border print:border-gray-200">
                  <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest print:text-gray-400">Academic Year</p>
                  <p className="text-lg font-bold">2024 / 2025</p>
                </div>
              </div>
            </div>

            {/* Student Info Section */}
            <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 bg-gray-50/50 border-b border-gray-100">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Student Name</p>
                <p className="text-lg font-bold text-gray-800">{selectedStudent?.fullName}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Admission No.</p>
                <p className="text-lg font-bold text-gray-800">{selectedStudent?.admissionNumber}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Class / Form</p>
                <p className="text-lg font-bold text-gray-800">{selectedStudent?.class}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Term</p>
                <p className="text-lg font-bold text-gray-800">{selectedStudent?.term}</p>
              </div>
            </div>

            {/* Marks Table */}
            <div className="p-10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-100">
                    <th className="py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Subject</th>
                    <th className="py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Test 1 (20)</th>
                    <th className="py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Test 2 (20)</th>
                    <th className="py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Exam (60)</th>
                    <th className="py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Total (100)</th>
                    <th className="py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Grade</th>
                    <th className="py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {studentMarks.map((m, idx) => {
                    const subject = SUBJECTS.find(s => s.id === m.subjectId);
                    return (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-5 font-bold text-gray-800">{subject?.name}</td>
                        <td className="py-5 text-center text-gray-600 font-medium">{m.test1}</td>
                        <td className="py-5 text-center text-gray-600 font-medium">{m.test2}</td>
                        <td className="py-5 text-center text-gray-600 font-medium">{m.exam}</td>
                        <td className="py-5 text-center font-black text-blue-600">{m.total}</td>
                        <td className="py-5 text-center">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-black text-sm ${m.grade === 'F' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            {m.grade}
                          </span>
                        </td>
                        <td className="py-5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">{m.remark}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Summary Footer */}
            <div className="p-10 bg-gray-50/50 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Marks</p>
                    <p className="text-3xl font-black text-gray-800">{stats?.total}</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Average %</p>
                    <p className="text-3xl font-black text-blue-600">{stats?.avg.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Final Grade</p>
                    <p className="text-2xl font-black text-emerald-600">{stats?.grade}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Class Position</p>
                    <p className="text-2xl font-black text-gray-800">4th / 32</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <PenTool size={14} />
                    <span>Teacher's Comments</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed italic border-l-4 border-blue-200 pl-4">
                    {selectedStudent?.fullName} has shown consistent improvement this term. Their performance in {studentMarks[0]?.grade === 'A' ? 'Mathematics' : 'all subjects'} is commendable. Keep up the good work!
                  </p>
                </div>

                <div className="flex items-end justify-between pt-8">
                  <div className="text-center">
                    <div className="w-32 h-1 bg-gray-200 mb-2" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Class Teacher</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 opacity-30">
                    <Stamp size={48} className="text-blue-600" />
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Official Stamp</p>
                  </div>
                  <div className="text-center">
                    <div className="w-32 h-1 bg-gray-200 mb-2" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Head Teacher</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-xl">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <FileText size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">No Marks Found</h3>
            <p className="text-gray-500 mt-2">Please enter marks for this student first.</p>
          </div>
        )
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-xl">
          <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-200">
            <User size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Select a Student</h3>
          <p className="text-gray-500 mt-2">Choose a student from the dropdown to view their report card.</p>
        </div>
      )}
    </div>
  );
}
