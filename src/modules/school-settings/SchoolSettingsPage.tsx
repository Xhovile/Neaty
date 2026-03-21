import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, School as SchoolIcon, Calendar, 
  Layers, BookOpen, Ruler, CheckCircle2, Save 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { School } from '../../domain/school/types';
import { AcademicYear, Term, Class, Stream, Subject } from '../../domain/academics/types';
import { AssessmentComponent, GradeScale } from '../../domain/assessments/types';

interface SchoolSettingsPageProps {
  school: School;
  academicYears: AcademicYear[];
  terms: Term[];
  classes: Class[];
  streams: Stream[];
  subjects: Subject[];
  assessmentComponents: AssessmentComponent[];
  gradeScale: GradeScale[];
  onUpdateSchool: (school: School) => void;
  onUpdateAssessmentComponents: (components: AssessmentComponent[]) => void;
  onUpdateGradeScale: (scale: GradeScale[]) => void;
}

export default function SchoolSettingsPage({ 
  school, academicYears, terms, classes, streams, 
  subjects, assessmentComponents, gradeScale,
  onUpdateSchool, onUpdateAssessmentComponents, onUpdateGradeScale
}: SchoolSettingsPageProps) {
  const [activeTab, setActiveTab] = useState<'School' | 'Academic' | 'Grading' | 'Assessments'>('School');
  const [localSchool, setLocalSchool] = useState(school);
  const [localComponents, setLocalComponents] = useState(assessmentComponents);
  const [localGradeScale, setLocalGradeScale] = useState(gradeScale);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    if (activeTab === 'School') onUpdateSchool(localSchool);
    if (activeTab === 'Assessments') onUpdateAssessmentComponents(localComponents);
    if (activeTab === 'Grading') onUpdateGradeScale(localGradeScale);
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const tabs = [
    { id: 'School', label: 'School Profile', icon: SchoolIcon },
    { id: 'Academic', label: 'Academic Structure', icon: Calendar },
    { id: 'Assessments', label: 'Assessments', icon: Layers },
    { id: 'Grading', label: 'Grading Rules', icon: Ruler },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Configure Neaty to match your school's unique academic structure.</p>
        </div>
        <div className="flex items-center gap-4">
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl flex items-center gap-2 border border-emerald-100 shadow-sm"
              >
                <CheckCircle2 size={18} />
                <span className="text-sm font-bold">Settings saved!</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2 font-semibold group"
          >
            <Save size={20} className="group-hover:scale-110 transition-transform" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 shrink-0 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-xl shadow-blue-50 border border-blue-50' : 'text-gray-400 hover:bg-white hover:text-gray-600'}`}
            >
              <tab.icon size={20} className={`${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
              <span className="font-bold text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-xl p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'School' && (
              <motion.div
                key="school"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">School Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">School Name</label>
                    <input
                      type="text"
                      value={localSchool.name}
                      onChange={(e) => setLocalSchool({ ...localSchool, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Motto</label>
                    <input
                      type="text"
                      value={localSchool.motto}
                      onChange={(e) => setLocalSchool({ ...localSchool, motto: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email</label>
                    <input
                      type="email"
                      value={localSchool.email}
                      onChange={(e) => setLocalSchool({ ...localSchool, email: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone</label>
                    <input
                      type="text"
                      value={localSchool.phone}
                      onChange={(e) => setLocalSchool({ ...localSchool, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'Assessments' && (
              <motion.div
                key="assessments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Assessment Components</h2>
                  <button 
                    onClick={() => setLocalComponents([...localComponents, { id: Math.random().toString(), name: 'New Component', weight: 0, maxScore: 100 }])}
                    className="text-blue-600 text-sm font-bold hover:underline"
                  >
                    + Add Component
                  </button>
                </div>
                <div className="space-y-4">
                  {localComponents.map((comp, idx) => (
                    <div key={comp.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Name</label>
                        <input
                          type="text"
                          value={comp.name}
                          onChange={(e) => {
                            const newComps = [...localComponents];
                            newComps[idx].name = e.target.value;
                            setLocalComponents(newComps);
                          }}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="w-24">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Weight (%)</label>
                        <input
                          type="number"
                          value={comp.weight}
                          onChange={(e) => {
                            const newComps = [...localComponents];
                            newComps[idx].weight = Number(e.target.value);
                            setLocalComponents(newComps);
                          }}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="w-24">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Max Score</label>
                        <input
                          type="number"
                          value={comp.maxScore}
                          onChange={(e) => {
                            const newComps = [...localComponents];
                            newComps[idx].maxScore = Number(e.target.value);
                            setLocalComponents(newComps);
                          }}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <button 
                        onClick={() => setLocalComponents(localComponents.filter((_, i) => i !== idx))}
                        className="mt-5 text-red-400 hover:text-red-600"
                      >
                        <Layers size={18} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <p className="text-xs text-blue-700 font-medium">
                    Total Weight: <span className="font-black">{localComponents.reduce((acc, c) => acc + c.weight, 0)}%</span> (Should equal 100%)
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'Grading' && (
              <motion.div
                key="grading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Grading Scale</h2>
                  <button 
                    onClick={() => setLocalGradeScale([...localGradeScale, { id: Math.random().toString(), minScore: 0, maxScore: 0, grade: '', remark: '' }])}
                    className="text-blue-600 text-sm font-bold hover:underline"
                  >
                    + Add Grade
                  </button>
                </div>
                <div className="space-y-4">
                  {localGradeScale.map((gs, idx) => (
                    <div key={gs.id} className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Min Score</label>
                        <input
                          type="number"
                          value={gs.minScore}
                          onChange={(e) => {
                            const newScale = [...localGradeScale];
                            newScale[idx].minScore = Number(e.target.value);
                            setLocalGradeScale(newScale);
                          }}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Max Score</label>
                        <input
                          type="number"
                          value={gs.maxScore}
                          onChange={(e) => {
                            const newScale = [...localGradeScale];
                            newScale[idx].maxScore = Number(e.target.value);
                            setLocalGradeScale(newScale);
                          }}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Grade</label>
                        <input
                          type="text"
                          value={gs.grade}
                          onChange={(e) => {
                            const newScale = [...localGradeScale];
                            newScale[idx].grade = e.target.value;
                            setLocalGradeScale(newScale);
                          }}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="relative">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Remark</label>
                        <input
                          type="text"
                          value={gs.remark}
                          onChange={(e) => {
                            const newScale = [...localGradeScale];
                            newScale[idx].remark = e.target.value;
                            setLocalGradeScale(newScale);
                          }}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm"
                        />
                        <button 
                          onClick={() => setLocalGradeScale(localGradeScale.filter((_, i) => i !== idx))}
                          className="absolute -right-2 top-0 text-red-400 hover:text-red-600"
                        >
                          <Ruler size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'Academic' && (
              <motion.div
                key="academic"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Academic Years</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {academicYears.map(ay => (
                      <div key={ay.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                        <span className="font-bold text-gray-800">{ay.name}</span>
                        {ay.isCurrent && <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-full">Current</span>}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Classes & Streams</h3>
                  <div className="space-y-4">
                    {classes.map(c => (
                      <div key={c.id} className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-black text-gray-900">{c.name}</span>
                          <button className="text-blue-600 text-xs font-bold">+ Add Stream</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {streams.filter(s => s.classId === c.id).map(s => (
                            <span key={s.id} className="bg-white border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-600 shadow-sm">
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
