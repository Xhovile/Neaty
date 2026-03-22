import React, { useEffect, useRef, useState } from 'react';
import { LayoutDashboard, Users, FileEdit, FileText, LogOut, GraduationCap, Menu, X, Settings as SettingsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { AppState } from '../state/app-store';
import { INITIAL_STATE } from '../state/seed';
import { loadState, saveState } from '../state/persistence';

import LoginPage from '../modules/auth/LoginPage';
import DashboardPage from '../modules/dashboard/DashboardPage';
import StudentsPage from '../modules/students/StudentsPage';
import MarksEntryPage from '../modules/marks-entry/MarksEntryPage';
import ReportCardsPage from '../modules/report-cards/ReportCardsPage';
import SchoolSettingsPage from '../modules/school-settings/SchoolSettingsPage';
import { fetchAuthenticatedProfile, getCurrentSession, onAuthStateChanged, signOutCurrentUser } from '../integrations/supabase/auth-service';

const createId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2, 11);
};

export default function AppShell() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const hydratedRef = useRef(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState<string>('Dashboard');

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        const saved = await loadState();
        if (!isMounted) {
          return;
        }

        const mergedState = saved ? { ...INITIAL_STATE, ...saved } : INITIAL_STATE;
        setState(mergedState);

        const session = await getCurrentSession();
        if (!isMounted || !session) {
          return;
        }

        const authState = await fetchAuthenticatedProfile(session);
        if (!isMounted) {
          return;
        }

        setState(prev => ({
          ...prev,
          ...mergedState,
          school: authState.school,
          user: authState.user,
        }));
      } catch (error) {
        console.error('Failed to bootstrap Neaty app shell.', error);
      } finally {
        if (isMounted) {
          hydratedRef.current = true;
          setIsBootstrapping(false);
        }
      }
    };

    void bootstrap();

    const unsubscribe = onAuthStateChanged((session) => {
      if (!isMounted) {
        return;
      }

      if (!session) {
        setState(prev => ({ ...prev, user: null }));
        setCurrentPage('Dashboard');
        return;
      }

      void (async () => {
        try {
          const authState = await fetchAuthenticatedProfile(session);
          if (!isMounted) {
            return;
          }

          setState(prev => ({
            ...prev,
            school: authState.school,
            user: authState.user,
          }));
          setCurrentPage('Dashboard');
        } catch (error) {
          console.error('Failed to refresh authenticated profile.', error);
        }
      })();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) {
      return;
    }

    void saveState(state);
  }, [state]);

  const handleLogin = () => {
    setCurrentPage('Dashboard');
  };

  const handleLogout = async () => {
    try {
      await signOutCurrentUser();
    } catch (error) {
      console.error('Failed to sign out.', error);
      setState(prev => ({ ...prev, user: null }));
    } finally {
      setCurrentPage('Dashboard');
    }
  };

  if (isBootstrapping) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-100">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Loading Neaty</h1>
            <p className="text-sm text-gray-500">Preparing your workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!state.user) {
    return <LoginPage onLogin={handleLogin as any} />;
  }

  const navItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Students', label: 'Students', icon: Users },
    { id: 'MarksEntry', label: 'Marks Entry', icon: FileEdit },
    { id: 'ReportCards', label: 'Report Cards', icon: FileText },
    { id: 'Settings', label: 'Settings', icon: SettingsIcon },
  ];

  const currentTerm = state.terms.find(t => t.isCurrent) || state.terms[0];
  const currentYear = state.academicYears.find(y => y.isCurrent) || state.academicYears[0];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-100 transition-all duration-300 shadow-2xl ${isSidebarOpen ? 'w-72' : 'w-20'}`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center gap-4 border-b border-gray-50">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-100 shrink-0">
              <GraduationCap size={24} />
            </div>
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-black text-xl tracking-tight text-blue-600"
              >
                Neaty
              </motion.span>
            )}
          </div>

          <nav className="flex-1 p-4 space-y-2 mt-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${currentPage === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-gray-400 hover:bg-gray-50 hover:text-blue-600'}`}
              >
                <item.icon size={20} className={`${currentPage === item.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
                {isSidebarOpen && <span className="font-bold text-sm">{item.label}</span>}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-50">
            <div className={`flex items-center gap-3 p-3 rounded-2xl bg-gray-50 mb-4 ${!isSidebarOpen && 'justify-center'}`}>
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-black shrink-0">
                {state.user.username.charAt(0).toUpperCase()}
              </div>
              {isSidebarOpen && (
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-gray-800 truncate">{state.user.fullName || state.user.username}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{state.user.role}</p>
                </div>
              )}
            </div>
            <button
              onClick={() => void handleLogout()}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all group ${!isSidebarOpen && 'justify-center'}`}
            >
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              {isSidebarOpen && <span className="font-bold text-sm">Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-20'}`}>
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 md:px-8 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{state.school.name}</p>
              <p className="text-sm font-bold text-gray-800">Neaty v1.0</p>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentPage === 'Dashboard' && (
                <DashboardPage
                  students={state.students}
                  marks={state.marks}
                  subjects={state.subjects}
                  classes={state.classes}
                />
              )}
              {currentPage === 'Students' && (
                <StudentsPage
                  students={state.students}
                  onAddStudent={(newStudent) => {
                    const student = { ...newStudent, id: createId() };
                    setState(prev => ({ ...prev, students: [...prev.students, student] }));
                  }}
                  onDeleteStudent={(id) => {
                    setState(prev => ({
                      ...prev,
                      students: prev.students.filter(s => s.id !== id),
                      marks: prev.marks.filter(m => m.studentId !== id),
                      enrollments: prev.enrollments.filter(e => e.studentId !== id)
                    }));
                  }}
                />
              )}
              {currentPage === 'MarksEntry' && (
                <MarksEntryPage
                  students={state.students}
                  enrollments={state.enrollments}
                  subjects={state.subjects}
                  assessmentComponents={state.assessmentComponents}
                  gradeScale={state.gradeScale}
                  currentTerm={currentTerm}
                  currentAcademicYear={currentYear}
                  onSaveMarks={(mark) => {
                    const newMark = { ...mark, id: createId() };
                    setState(prev => {
                      const existingIdx = prev.marks.findIndex(m =>
                        m.studentId === newMark.studentId &&
                        m.subjectId === newMark.subjectId &&
                        m.termId === newMark.termId &&
                        m.academicYearId === newMark.academicYearId
                      );
                      const updatedMarks = [...prev.marks];
                      if (existingIdx > -1) {
                        updatedMarks[existingIdx] = newMark;
                      } else {
                        updatedMarks.push(newMark);
                      }
                      return { ...prev, marks: updatedMarks };
                    });
                  }}
                  marks={state.marks}
                />
              )}
              {currentPage === 'ReportCards' && (
                <ReportCardsPage
                  students={state.students}
                  marks={state.marks}
                  school={state.school}
                  subjects={state.subjects}
                  assessmentComponents={state.assessmentComponents}
                  gradeScale={state.gradeScale}
                  enrollments={state.enrollments}
                  classes={state.classes}
                  streams={state.streams}
                  terms={state.terms}
                  academicYears={state.academicYears}
                />
              )}
              {currentPage === 'Settings' && (
                <SchoolSettingsPage
                  school={state.school}
                  academicYears={state.academicYears}
                  terms={state.terms}
                  classes={state.classes}
                  streams={state.streams}
                  subjects={state.subjects}
                  assessmentComponents={state.assessmentComponents}
                  gradeScale={state.gradeScale}
                  onUpdateSchool={(school) => setState(prev => ({ ...prev, school }))}
                  onUpdateAssessmentComponents={(assessmentComponents) => setState(prev => ({ ...prev, assessmentComponents }))}
                  onUpdateGradeScale={(gradeScale) => setState(prev => ({ ...prev, gradeScale }))}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
