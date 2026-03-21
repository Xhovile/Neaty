import React, { useState, useMemo } from 'react';
import { Save, Calculator, User, Book, FilePlus, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MarksEntryProps } from '../types';
import { calculateWeightedTotal, getGradeFromScale } from '../constants';

export default function MarksEntry({ 
  students, subjects, enrollments, assessmentComponents, 
  gradeScale, currentTerm, currentAcademicYear, onSaveMarks, marks 
}: MarksEntryProps) {
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [scores, setScores] = useState<{ [componentId: string]: number }>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Auto-calculations
  const weightedTotal = useMemo(() => calculateWeightedTotal(scores, assessmentComponents), [scores, assessmentComponents]);
  const { grade, remark } = useMemo(() => getGradeFromScale(weightedTotal, gradeScale), [weightedTotal, gradeScale]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedSubjectId) return;

    onSaveMarks({
      studentId: selectedStudentId,
      subjectId: selectedSubjectId,
      termId: currentTerm.id,
      academicYearId: currentAcademicYear.id,
      scores,
      weightedTotal,
      grade,
      remark,
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // Reset scores
    setScores({});
  };

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marks Entry</h1>
          <p className="text-gray-500 text-sm mt-1">Enter student scores for {currentTerm.name} ({currentAcademicYear.name}).</p>
        </div>
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl flex items-center gap-2 border border-emerald-100 shadow-sm"
            >
              <CheckCircle2 size={18} />
              <span className="text-sm font-bold">Marks saved successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Entry Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select Student</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    required
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none cursor-pointer"
                  >
                    <option value="">Choose a student...</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.fullName} ({s.admissionNumber})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select Subject</label>
                <div className="relative">
                  <Book className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    required
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none cursor-pointer"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 md:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assessmentComponents.map(comp => (
                  <div key={comp.id}>
                    <label className="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                      {comp.name} ({comp.weight}%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max={comp.maxScore}
                        required
                        value={scores[comp.id] || ''}
                        onChange={(e) => setScores({ ...scores, [comp.id]: Number(e.target.value) })}
                        className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-blue-900"
                        placeholder={`Max: ${comp.maxScore}`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-blue-300">
                        /{comp.maxScore}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedStudentId || !selectedSubjectId}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3 group"
            >
              <Save size={20} className="group-hover:scale-110 transition-transform" />
              <span>Save Marks & Calculate</span>
            </button>
          </form>
        </motion.div>

        {/* Real-time Calculation Preview */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 flex flex-col"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
              <Calculator size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Live Preview</h2>
          </div>

          <div className="flex-1 space-y-8">
            <div className="text-center p-8 bg-gray-50 rounded-3xl border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Weighted Total</p>
              <p className="text-6xl font-black text-blue-600">{weightedTotal}</p>
              <p className="text-sm font-bold text-gray-500 mt-2">out of 100</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Grade</p>
                <p className={`text-2xl font-black ${grade === 'F' ? 'text-red-500' : 'text-emerald-500'}`}>{grade}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Remark</p>
                <p className="text-sm font-bold text-gray-700">{remark}</p>
              </div>
            </div>

            {selectedStudent && (
              <div className="pt-6 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Student Info</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {selectedStudent.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{selectedStudent.fullName}</p>
                    <p className="text-xs text-gray-500">{selectedStudent.admissionNumber}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
            <FilePlus size={18} className="text-amber-600 shrink-0" />
            <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
              Weighted totals are calculated dynamically based on your assessment configuration.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
